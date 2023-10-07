import supabase from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

interface SupabaseProps {
  upload: () => Promise<boolean>;
  read: () => Promise<boolean>;
}

class Supabase implements SupabaseProps {
  private client: SupabaseClient = supabase;

  upload = async () => {
    return true;
  };

  read = async () => {
    return true;
  };
}

export default Supabase;
