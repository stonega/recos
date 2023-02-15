import Head from "next/head";
import { NextSeo } from "next-seo";
import { Meta } from "../../types";
import NavBar from "./nav-bar";
import Footer from "./footer";

export interface LayoutProps {
  meta: Meta;
  children?: React.ReactNode;
}

const Layout = ({ children, meta }: LayoutProps) => {
  const favicon = "https://web3helpers.xyz/favicon.png";
  const title = "Recommends";
  const description = "Recommends.";
  return (
    <>
      <Head>
        <title>{meta?.title ?? title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="theme-color" content="#00501e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={meta?.description ?? description} />

        <link rel="shortcut icon" type="image/x-icon" href={meta?.logo ?? favicon} />
        <link rel="apple-touch-icon" sizes="180x180" href={meta?.logo ?? favicon} />
      </Head>
      <NextSeo
        title={meta.title ?? title}
        description={meta?.description ?? description}
        openGraph={{
          url: meta.ogUrl,
          title: meta.title ?? title,
          description: meta.description ?? description,
          images: [
            {
              url: meta.ogImage ?? favicon,
              alt: "Recommends",
              type: "image/jpeg"
            }
          ],
          site_name: "Web3.0 Helpers"
        }}
        twitter={{
          handle: "",
          site: meta.twitter,
          cardType: "summary_large_image"
        }}
      />
      <div className="bg-gradient-to-br from-green-200 via-green-100 to-green-100 dark:from-black dark:via-black dark:to-gray-800 relative w-full min-h-screen flex flex-col items-center">
        <NavBar></NavBar>
        <div className="max-w-6xl w-full px-4 py-10 min-h-[80vh]">{children}</div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default Layout;
