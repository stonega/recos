import "@/styles/globals.css";
import "vercel-toast-center/css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import { Inter } from "@next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { ...pageProps },
}: AppProps<{}>) {
  return (
    <>
      <RWBProvider>
        <div className={cx(inter.variable)}>
          <Component {...pageProps} />
        </div>
      </RWBProvider>
      <Analytics />
    </>
  );
}
