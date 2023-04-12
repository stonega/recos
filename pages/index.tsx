import Layout from "@/components/layout";
import { AudioInput, Meta } from "types";
import { SearchAudio } from "@/components/home/search-audio";
import { useEffect, useState } from "react";
import {
  Category,
  CategorySelector,
} from "@/components/home/category-selector";
import { SearchPodcast } from "@/components/home/search-podcast";
import Result from "@/components/home/result";
import WhatIsRecos from "@/components/home/what-is-recos";

export default function Home() {
  const meta: Meta = {
    description: "Recos.",
    logo: "https://web3helpers.xyz/favicon.png",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  const [result, setResult] = useState<AudioInput>();
  const [category, setCategory] = useState<Category>("podcast");

  return (
    <Layout meta={meta}>
      <div className="mb-20"></div>
      <CategorySelector onSelect={setCategory}></CategorySelector>
      {category === "podcast" ? (
        <SearchPodcast onResult={(result) => setResult(result)}></SearchPodcast>
      ) : (
        <SearchAudio onResult={(result) => setResult(result)}></SearchAudio>
      )}
      {result && <Result input={result} />}
      <WhatIsRecos />
    </Layout>
  );
}
