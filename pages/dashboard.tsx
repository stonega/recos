import Layout from "@/components/layout";
import { AudioInput, Meta } from "types";
import {
  Category,
  CategorySelector,
} from "@/components/home/category-selector";
import { SearchAudio } from "@/components/home/search-audio";
import { SearchPodcast } from "@/components/home/search-podcast";
import { SearchYoutube } from "@/components/home/search-youtube";
import Result from "@/components/home/result";
import { useState } from "react";
import { getToken } from "next-auth/jwt";
import RecentTranscriptions from "@/components/dashboard/recent-transcriptions";
import { getTranslationProps } from "@/lib/server-side-props";

export async function getServerSideProps(context: any) {
  const token = await getToken({ req: context.req, raw: true });
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token,
      ...(await getTranslationProps(context, "dashboard"))
    },
  };
}

export default function Home({ token }: { token: any }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.studio",
    title: "Dashboard",
  };

  const [result, setResult] = useState<AudioInput>();
  const [category, setCategory] = useState<Category>("podcast");

  return (
    <Layout meta={meta}>
      <div>
        <div className="mb-0 md:mb-20"></div>
        <CategorySelector onSelect={setCategory}></CategorySelector>
        {category === "youtube" ? (
          <SearchYoutube
            onResult={(result) => setResult(result)}
          ></SearchYoutube>
        ) : category === "podcast" ? (
          <SearchPodcast
            onResult={(result) => setResult(result)}
          ></SearchPodcast>
        ) : (
          <SearchAudio onResult={(result) => setResult(result)}></SearchAudio>
        )}
        {result && (
          <Result
            input={result}
            token={token}
            closeResult={() => setResult(undefined)}
          />
        )}
        {!result && <RecentTranscriptions token={token} status="pending" />}
        {!result && <RecentTranscriptions token={token} status="completed" />}
      </div>
    </Layout>
  );
}
