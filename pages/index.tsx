import Layout from "@/components/layout";
import { Meta } from "types";
import WhatIsRecos from "@/components/home/what-is-recos";
import Features from "@/components/home/features";
import Button from "@/components/shared/button";
import { useRouter } from "next/router";
import Inscriptions from "@/components/home/inscriptions";

export default function Home() {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  const router = useRouter();

  return (
    <Layout meta={meta}>
      <div className="mb-0 md:mb-20"></div>
      <div className="flex flex-col md:grid md:grid-cols-2">
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-20 text-center text-4xl font-bold leading-[3rem] text-green-600 md:text-left">
            Hi, Transcript any podcast you love to text and discover even more!
          </div>
          <Button
            className="mb-20 border-2 border-green-400 py-4 text-2xl font-bold md:mb-0"
            onClick={() => router.push("/dashboard")}
            outlined={ true }
          >
            Get Started
          </Button>
        </div>
        <Inscriptions />
      </div>
      <Features />
      <WhatIsRecos />
    </Layout>
  );
}
