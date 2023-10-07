import * as React from "react";
import Head from "next/head";

interface SecondaryProps {
  children: React.ReactNode;
  title: string;
}

const Secondary: React.FC<SecondaryProps> = ({ children, title }) => {
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
        <title>{title}</title>
      </Head>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Secondary;
