import Layout from "@/components/layout";
import { Meta } from "types";
import { SearchBar } from "@/components/home/search-bar";
import { useState } from "react";
import { BookGrid } from "@/components/home/book-grid";

export default function Home() {
  const meta: Meta = {
    description: "Recommends.",
    logo: "https://web3helpers.xyz/favicon.png",
    ogUrl: "http://remmend.stonegate.me",
    title: "Recommends"
  };
  const [result, setResult] = useState<string[]>([]);

  return (
    <Layout meta={meta}>
      <SearchBar onResult={(result) => setResult(result)}></SearchBar>
      {result.length > 0 && <BookGrid books={result}></BookGrid>}
    </Layout>
  );
}
