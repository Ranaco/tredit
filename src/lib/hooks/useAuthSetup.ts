import { useEffect } from "react";
import SupabaseDB from "../supabase-client";
import { Session } from "@supabase/supabase-js";
import { SupabaseUser } from "../types";
import supabase from "../supabase";

const useSupabaseAuth = () => {
  const supabaseDB = new SupabaseDB();

  useEffect(() => {
    const handleAuthChange = async (_: string, session: Session | null) => {
      const user = session?.user;

      if (user) {
        const isRegistered: SupabaseUser[] = await supabaseDB.read<
          SupabaseUser[]
        >("id", user.id, { table: "User" });

        if ((isRegistered as SupabaseUser[]).length == 0) {
          const payload = {
            id: user.id,
            email: user.email,
            name: user.user_metadata.user_name,
            avatar_url: user.user_metadata.avatar_url,
            trext_count: 0,
            collaborating: [],
            created_at: new Date().toISOString(),
          };

          const registered: boolean = await supabaseDB.upload<SupabaseUser>(
            payload as SupabaseUser,
            { table: "User" },
          );

          if (registered) {
            window.localStorage.setItem("token", JSON.stringify(true));
          }
        } else {
          window.localStorage.setItem("token", JSON.stringify(true));
        }
      }
    };

    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener!.subscription.unsubscribe();
    };
  }, []);
};

export default useSupabaseAuth;
