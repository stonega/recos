import Layout from "@/components/layout";
import { Meta } from "types";
import { SearchPage } from "@/components/home/search-page";
import { useState } from "react";
import { BookGrid } from "@/components/home/book-grid";
import {
  Category,
  CategorySelector,
} from "@/components/home/category-selector";
import { SearchPodcast } from "@/components/home/search-podcast";

export default function Home() {
  const meta: Meta = {
    description: "Recos.",
    logo: "https://web3helpers.xyz/favicon.png",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  const [result, setResult] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("podcast");

  return (
    <Layout meta={meta}>
      <div className="mb-20 text-2xl text-black/80 dark:text-white/80">
        Recos can help you found info like books mentioned from podcast or
        webpage. We use openai api as the engine. Have a try!
      </div>
      <CategorySelector onSelect={setCategory}></CategorySelector>
      {category === "podcast" ? (
        <SearchPodcast onResult={(result) => setResult(result)}></SearchPodcast>
      ) : (
        <SearchPage onResult={(result) => setResult(result)}></SearchPage>
      )}
      {result.length > 0 && <BookGrid books={result}></BookGrid>}
    </Layout>
  );
}
