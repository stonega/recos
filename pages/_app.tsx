import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import { Inter } from "@next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
          <Toaster richColors position="top-center" />
          <div className={cx(inter.variable)}>
            <Component {...pageProps} />
          </div>
        </SessionProvider>
      </RWBProvider>
      <Analytics />
    </>
  );
}
