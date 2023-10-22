import supabase from "./supabase";
import type { SupabaseUser, Trext } from "./types";

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
  update: (
    searchParam: string,
    searchValue: string,
    payload: any,
    options: { table?: string },
  ) => Promise<boolean>;
  updateScratchPad: (payload: any) => void;
}

class SupabaseDB implements SupabaseProps {
  upload = async <T>(payload: T, options: { table?: string } = {}) => {
    const { table = "trext_store" } = options;

    const { error } = await supabase.from(table).insert(payload);

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  read = async <T>(
    searchParam: string,
    searchValue: string,
    options: { limit?: number; table?: string } = {},
  ) => {
    const { limit = 100, table = "trext_store" } = options;

    const { data, error } = await supabase
      .from(table)
      .select()
      .eq(searchParam, searchValue)
      .limit(limit);

    if (error) {
      console.log(error);
      throw error;
    }
    return (data as T) || ({} as T);
  };

  update = async (
    searchParam: string,
    searchValue: string,
    payload: any,
    options: { table?: string } = {},
  ) => {
    const { table = "trext_store" } = options;

    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq(searchParam, searchValue);

    if (error && !data) {
      console.error(error);
      return false;
    }

    return true;
  };

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
    const supabaseUser = await supabase.auth.getUser();
    if (supabaseUser.data) {
      const payload: Trext = {
        title: "New Editor",
        content: JSON.stringify({
          time: 0,
          blocks: [],
          version: "2.17.0",
        }),
        user_id: supabaseUser.data.user?.id!,
        collaboraters: [],
        updated_at: new Date().toISOString(),
      };

      const user: SupabaseUser[] = await this.read<SupabaseUser[]>(
        "id",
        supabaseUser.data.user?.id!,
        {
          table: "User",
        },
      );

      if (user.length !== 0) {
        this.update("id", supabaseUser.data.user?.id!, {
          trext_count: user[0].trext_count + 1,
        });
      }

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

      const { error: _ } = await supabase.from("trext_store").insert(data);
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
