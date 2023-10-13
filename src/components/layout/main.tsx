import * as React from "react";
import { NextRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../Sidebar";
import { Pacifico } from "next/font/google";
import { Divider } from "@nextui-org/react";
import { inter } from "@/pages/_app";

export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

interface MainProps {
  router: NextRouter;
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ router, children }) => {
  return (
    <div className="h-screen w-screen m-0 p-0">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Ranaco" />
        <meta name="author" content="https://github.com/Ranaco/" />
        <meta
          name="description"
          content="A realtime collaborative web editor for markdown and more!"
        />
        <title>TrEdit</title>
      </Head>
      <div
        className={`w-full h-full flex flex-row overflow-x-hidden ${inter.className}`}
      >
        <Sidebar router={router} />
        <Divider orientation="vertical" />
        {children}
      </div>
    </div>
  );
};

export default Main;
