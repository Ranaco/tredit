import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Main from "@/components/layout/main";
import { NextUIProvider } from "@nextui-org/react";
import { Open_Sans } from "next/font/google";

export const inter = Open_Sans({
  subsets: ["latin"],
});

export default function App({ Component, pageProps, router }: AppProps) {
  const getLayout = Component.getLayout;

  return getLayout ? (
    getLayout(
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>,
    )
  ) : (
    <NextUIProvider>
      <Main router={router}>
        <Component {...pageProps} />
      </Main>
    </NextUIProvider>
  );
}
