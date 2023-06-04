import Layout from "@/components/layout";
import { CreditHistory, Meta } from "types";
import useSWR from "swr";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import HistoryCard from "@/components/credit/HistoryCard";
import { useEffect, useState } from "react";

export { getServerSideProps } from "lib/server-side-props";

function useCredits(page: number, pageSize: number, token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const request = async (): Promise<CreditHistory[]> => {
    const response = await fetch(
      `/api/credit_history?page=${page}&page_size=${pageSize}`,
      {
        headers,
      },
    );
    const result = await response.json();
    return result.data;
  };

  const { data, error, isLoading } = useSWR(
    () => `/api/credit_history?page=${page}&page_size=${pageSize}`,
    request,
  );
  return {
    data,
    isLoading,
    error,
  };
}

export default function Credit({
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
    title: "Credit history",
  };

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<CreditHistory[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, error } = useCredits(page, 20, token);

  useEffect(() => {
    if (data && data.length > 0) {
      setRecords((records) => {
        data.forEach((item) => {
          if (!records.find((record) => item.id === record.id)) {
            records = [...records, item];
          }
        });
        return records;
      });
    } else {
      setHasMore(false);
    }
  }, [data]);

  return (
    <Layout meta={meta} providers={providers} products={products}>
      <div className="mb-8 flex flex-row justify-between dark:text-white">
        <Link className="flex flex-row items-center text-xl" href="/">
          <ArrowLeftCircle className="inline" />
          <span className="ml-2">Credits Usage</span>
        </Link>
        <div className="flex flex-row"></div>
      </div>
      {isLoading && records.length === 0 ? (
        <div className="darK:text-white mt-20 flex h-60 flex-col items-center justify-center gap-2">
          <div className="history-loader mx-auto mt-10 w-full" />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-3 divide-y divide-solid divide-green-400">
            {records &&
              records.map((item) => {
                return (
                  <div key={item.id}>
                    <HistoryCard history={item} />
                  </div>
                );
              })}
          </div>
          {!hasMore ? (
            <div className="my-4 w-full text-center text-lg opacity-70 dark:text-white">
              No more records
            </div>
          ) : isLoading ? (
            <div className="dot-loader my-4 w-full text-center text-lg opacity-70 dark:text-white">
              Loading
            </div>
          ) : (
            <div
              className="my-4 w-full cursor-pointer text-center text-lg opacity-70 dark:text-white"
              onClick={() => setPage((page) => page + 1)}
            >
              Load more
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
