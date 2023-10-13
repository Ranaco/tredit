import supabase from "./supabase";
import type { Trext } from "./types";

interface SupabaseProps {
  upload: () => Promise<boolean>;
  read: (searchParam: string, searchValue: string) => Promise<Trext[]>;
  fetchUserTrexts: () => Promise<Trext[]>;
  stream: (id: string, payload: any) => void;
  updateScratchPad: (payload: any) => void;
}

class SupabaseDB implements SupabaseProps {
  upload = async () => {
    return true;
  };

  read = async (searchParam: string, searchValue: string) => {
    const user = await supabase.auth.getUser();

    if (user.data) {
      const { data, error } = await supabase
        .from("trext_store")
        .select("*")
        .eq(searchParam, searchValue);

      if (error) {
        throw error;
      }
      return (data as Trext[]) || [];
    }

    return [];
  };

  fetchUserTrexts = async (): Promise<Trext[]> => {
    const user = await supabase.auth.getUser();
    if (user.data) {
      const { data, error } = await supabase
        .from("trext_store")
        .select("*")
        .eq("user_id", user.data.user?.id)
        .neq("title", user.data.user?.id + "-scratchpad");
      return data || [];
    }
    return [];
  };

  updateScratchPad = async (payload: any) => {
    const user = await supabase.auth.getUser();
    const { error } = await supabase
      .from("trext_store")
      .update({
        content: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq("title", user.data.user?.id + "-scratchpad");

    if (error) {
      throw error;
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
