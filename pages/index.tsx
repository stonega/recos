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
import Features from "@/components/home/features";

export { getServerSideProps } from "lib/server-side-props";

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
      {!result && <Features></Features>}
      {!result && <WhatIsRecos />}
    </Layout>
  );
}
