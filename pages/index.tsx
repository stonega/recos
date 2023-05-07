import Layout from "@/components/layout";
import { AudioInput, Meta } from "types";
import { SearchAudio } from "@/components/home/search-audio";
import { useState } from "react";
import {
  Category,
  CategorySelector,
} from "@/components/home/category-selector";
import { SearchPodcast } from "@/components/home/search-podcast";
import Result from "@/components/home/result";
import WhatIsRecos from "@/components/home/what-is-recos";
import { getProviders } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export default function Home({
  providers,
  token,
  products,
}: {
  providers: any;
  products: any[];
  token: string;
}) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  const [result, setResult] = useState<AudioInput>();
  const [category, setCategory] = useState<Category>("podcast");

  return (
    <Layout meta={meta} providers={providers} products={products}>
      <div className="mb-0 md:mb-20"></div>
      <CategorySelector onSelect={setCategory}></CategorySelector>
      {category === "podcast" ? (
        <SearchPodcast onResult={(result) => setResult(result)}></SearchPodcast>
      ) : (
        <SearchAudio onResult={(result) => setResult(result)}></SearchAudio>
      )}
      {result && <Result input={result} token={token} />}
      {/* {!result && <div className="bear-loader w-full" />} */}
      <WhatIsRecos />
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  const getProducts = async () => {
    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/products?filter[store_id]=25044",
      {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
        },
      },
    );
    const products = await response.json();
    // @ts-ignore
    console.log({ products: products.data });
    return { products: products.data };
  };
  const [token, { products }] = await Promise.all([
    getToken({ req: context.req, raw: true }),
    getProducts(),
  ]);

  return {
    props: {
      providers,
      token,
      products,
    },
  };
}
