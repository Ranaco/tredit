import supabase from "./supabase";
import type { Trext } from "./types";

interface SupabaseProps {
  upload: <T>(payload: T, options: { table?: string }) => Promise<boolean>;
  read: <T>(
    searchParam: string,
    searchValue: string,
    options: { limit?: number; table?: string },
  ) => Promise<T[]>;
  fetchUserTrexts: () => Promise<Trext[]>;
  createNewEditor: () => Promise<[string, Trext]>;
  stream: (id: string, payload: any) => void;
  update: (id: string, title: string) => void;
  updateScratchPad: (payload: any) => void;
}

class SupabaseDB implements SupabaseProps {
  upload = async <T>(payload: T, options: { table?: string } = {}) => {
    const user = await supabase.auth.getUser();

    const { table = "trext_store" } = options;

    if (user.data) {
      const { error } = await supabase.from(table).insert(payload);

      if (error) {
        console.error(error);
        return false;
      }
    }
    return true;
  };

  read = async <T>(
    searchParam: string,
    searchValue: string,
    options: { limit?: number; table?: string } = {},
  ) => {
    const user = await supabase.auth.getUser();

    const { limit = 100, table = "trext_store" } = options;

    if (user.data) {
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq(searchParam, searchValue)
        .limit(limit);

      if (error) {
        throw error;
      }
      return (data as T) || ({} as T);
    }

    return [];
  };

  update = async (id: string, title: string) => {};

  fetchUserTrexts = async (): Promise<Trext[]> => {
    const user = await supabase.auth.getUser();

    if (user.data) {
      const { data, error } = await supabase
        .from("trext_store")
        .select("*")
        .eq("user_id", user.data.user?.id)
        .neq("title", user.data.user?.id + "-scratchpad");

      if (error) {
        throw error;
      }

      return data || [];
    }
    return [];
  };

  createNewEditor = async (): Promise<[string, Trext]> => {
    const user = await supabase.auth.getUser();
    if (user.data) {
      const payload: Trext = {
        title: "New Editor",
        content: JSON.stringify({
          time: 0,
          blocks: [],
          version: "2.17.0",
        }),
        user_id: user.data.user?.id!,
        collaboraters: [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("trext_store")
        .insert(payload)
        .select();

      const { error: err } = await supabase
        .from("trext_store")
        .update({ title: "New Editor " + data![0].id })
        .eq("id", data![0].id);
      if (err || error) {
        throw error && err;
      }
      return [data[0].id, payload];
    }
    return ["", {} as Trext];
  };

  updateScratchPad = async (payload: any) => {
    const user = await supabase.auth.getUser();

    const { count } = await supabase
      .from("trext_store")
      .select("*", { count: "exact", head: true })
      .eq("title", user.data.user?.id + "-scratchpad");

    if (count! > 0) {
      const { error } = await supabase
        .from("trext_store")
        .upsert({
          content: JSON.stringify(payload),
          updated_at: new Date().toISOString(),
        })
        .eq("title", user.data.user?.id + "-scratchpad");

      if (error) {
        throw error;
      }
    } else {
      const data = {
        title: user.data.user?.id + "-scratchpad",
        content: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
        user_id: user.data.user?.id,
      };

      const { error } = await supabase.from("trext_store").insert(data);
    }
  };

  stream = async (id: string, payload: any) => {
    const { error } = await supabase
      .from("trext_store")
      .update({
        content: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
  };
}

export default SupabaseDB;
