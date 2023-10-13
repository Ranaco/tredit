import * as React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Main from "@/components/layout/main";
import { NextUIProvider } from "@nextui-org/react";
import { Open_Sans } from "next/font/google";
import supabase from "@/lib/supabase";
import type { StateType, StateValue } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import SupabaseDB from "@/lib/supabase-client";
import { AblyProvider } from "ably/react";
import { Realtime } from "ably";

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
  const ably = new Realtime.Promise({ clientId: clientID, key: apiKey });

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
    const data = await supabase.auth.getUser();

    const trexts = await supabaseDB.fetchUserTrexts();

    setState({
      user: data.data.user || ({} as User),
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
    supabase.auth.onAuthStateChange((event, session) => {
      handleAuth();
    });
    handleData();
  }, []);

  return getLayout ? (
    getLayout(
      <AblyProvider client={ably}>
        <Context.Provider value={{ state, setState, updateTrextContent }}>
          <NextUIProvider>
            <Component {...pageProps} />
          </NextUIProvider>
        </Context.Provider>
        ,
      </AblyProvider>,
    )
  ) : (
    <AblyProvider client={ably}>
      <Context.Provider value={{ state, setState, updateTrextContent }}>
        <NextUIProvider>
          <Main router={router}>
            <Component {...pageProps} />
          </Main>
        </NextUIProvider>
      </Context.Provider>
    </AblyProvider>
  );
}
