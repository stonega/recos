import Layout from "@/components/layout";
import { CreditHistory, Meta } from "types";
import HistoryCard from "@/components/credit/history-card";
import { useEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import { useCredits } from "hooks/use-api";
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
      ...(await getTranslationProps(context, "credit"))
    },
  };
}

export default function Credit({ token }: { token: string }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.studio",
    title: "Credit",
  };

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<CreditHistory[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, error } = useCredits(page, 20, undefined, token);

  useEffect(() => {
    if (!data) return;
    if (data.length > 0) {
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
    <Layout meta={meta}>
      <div className="mb-6 mt-0 md:mt-10 text-4xl font-medium dark:text-white">
        History
      </div>
      {isLoading && records.length === 0 ? (
        <div className="darK:text-white mt-20 flex h-60 flex-col items-center justify-center gap-2">
          <div className="history-loader mx-auto mt-10 w-full" />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {records &&
              records.map((item) => {
                return (
                  <div key={item.id}>
                    <HistoryCard history={item} token={token} />
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
              onClick={() => {
                if (hasMore) setPage((page) => page + 1);
              }}
            >
              Load more
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
