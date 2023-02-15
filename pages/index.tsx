import Layout from "@/components/layout";
import { Meta } from "types";
import { SearchBar } from "@/components/home/search-bar";
import { useState } from "react";

export default function Home() {
  const meta: Meta = {
    description: "Recommends.",
    logo: "https://web3helpers.xyz/favicon.png",
    ogUrl: "http://remmend.stonegate.me",
    title: "Recommends"
  };
  const [result, setResult] = useState('');

  return (
    <Layout meta={meta}>
      <SearchBar></SearchBar>
    </Layout>
  );
}
