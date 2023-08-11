import { SrtItem } from "utils";
import useSWR from "swr";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { CreditHistory, Meta } from "types";
import SrtItemCard from "@/components/subtitle/srt-item-card";

const SubtitlePage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const request = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };

  const { data } = useSWR<SrtItem[]>(
    () => `/api/subtitle/${encodeURIComponent(id)}`,
    request,
  );
  const { data: record} = useSWR<CreditHistory>(() => `/api/record/${encodeURIComponent(id)}`, request)

  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  
  return (
    <Layout meta={meta}>
      {record && (
        <>
        <div className="text-2xl mt-10 dark:text-white">{record.name}</div>
        </>
      )}
      {data &&
        data.map((subtitle) => {
          return <SrtItemCard key={subtitle.id} srtItem={subtitle} />;
        })}
    </Layout>
  );
};

export default SubtitlePage;
