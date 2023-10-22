import * as React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Main from "@/components/layout/main";
import { NextUIProvider } from "@nextui-org/react";
import { Open_Sans } from "next/font/google";
import supabase from "@/lib/supabase";
import {
  Trext,
  type StateType,
  type StateValue,
  type SupabaseUser,
} from "@/lib/types";
import SupabaseDB from "@/lib/supabase-client";
import useSupabaseAuth from "@/lib/hooks/useAuthSetup";
import { Realtime } from "ably";
import { AblyProvider } from "ably/react";

export const inter = Open_Sans({
  subsets: ["latin"],
});

export const Context = React.createContext<StateType>({} as StateType);

export const useAppContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

const clientID = process.env.NEXT_PUBLIC_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ABLY_API;

export default function App({ Component, pageProps, router }: AppProps) {
  useSupabaseAuth();

  // const ably = new Realtime.Promise({
  //   key: apiKey,
  //   clientId: clientID,
  // });

  const getLayout = Component.getLayout;
  const [state, setState] = React.useState<StateValue>({} as StateValue);

  const handleAuth = React.useCallback(async () => {
    if (typeof window !== "undefined") {
      const data = await supabase.auth.getUser();
      const isAuthenticated = JSON.parse(
        window.localStorage.getItem("token") || "{}",
      );

      if (!isAuthenticated || !data.data.user) {
        router.replace("/login");
      }
    }
  }, [router.asPath]);

  const handleData = async () => {
    const supabaseDB = new SupabaseDB();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const data: SupabaseUser[] = await supabaseDB.read<SupabaseUser[]>(
      "id",
      user?.id!,
      {
        table: "User",
      },
    );

    const trexts = await supabaseDB.fetchUserTrexts();

    const currUser = await supabaseDB.read<SupabaseUser[]>("id", user?.id!, {
      table: "User",
    });

    const sharedTrextIds: string[] = currUser[0]?.collaborating || [];

    let sharedTrexts: Trext[] = [];

    for (let i of sharedTrextIds) {
      var sharedTrext = await supabaseDB.read<Trext[]>("id", i);
      sharedTrexts = [...sharedTrexts, sharedTrext[0]];
    }

    setState({
      sharedTrexts: sharedTrexts || [],
      user: data[0] || ({} as SupabaseUser),
      trexts: trexts || [],
    });
  };
  const updateTrextContent = (trextId: string, newContent: string) => {
    const updatedTrexts = state.trexts.map((trext) => {
      if (trext.id === trextId) {
        return {
          ...trext,
          content: newContent,
        };
      }
      return trext;
    });

    setState((prevState) => ({
      ...prevState,
      trexts: updatedTrexts,
    }));
  };

  React.useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      handleAuth();
    });

    // ably.connection.on("connected", () => {
    //   console.log("Connected");
    // });
    //
    // ably.connection.on("update", (e) => {
    //   console.log("Update", e);
    // });

    handleData();
  }, []);

  return getLayout ? (
    getLayout(
      <Context.Provider value={{ state, setState, updateTrextContent }}>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </Context.Provider>,
    )
  ) : (
    <Context.Provider value={{ state, setState, updateTrextContent }}>
      <NextUIProvider>
        <Main router={router}>
          <Component {...pageProps} />
        </Main>
      </NextUIProvider>
    </Context.Provider>
  );
}
