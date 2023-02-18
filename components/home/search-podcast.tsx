import { createToast } from "vercel-toast-center";
import useSWR from "swr";
import { useState } from "react";
import { Command } from "cmdk";
import useDebounce from "hooks/use-debounce";
import { Episode } from "types";
import { LoadingCircle } from "../shared/icons";

interface SearchPodcastProps {
  onResult: (result: string[]) => void;
}

function useEpisodes(search: string) {
  const { data, error, isLoading } = useSWR(
    () => (search !== "" ? `/api/episode?search=${search}` : null),
    fetcher,
    /// disable auto refresh.
    { refreshInterval: 1000000 },
  );
  return {
    data,
    isLoading,
    error,
  };
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SearchPodcast = ({ onResult }: SearchPodcastProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.trim(), 1000);
  const { data, error, isLoading } = useEpisodes(debouncedSearch);

  const submit = async ({ data }: { data: string }) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/analyze", {
        method: "post",
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      onResult(result);
    } catch (error) {
      if (error instanceof Error) createToast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-row gap-4">
      <div className="relative flex flex-col gap-4">
        <input
          className="input"
          placeholder="Search podcast episode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute top-5 right-4">{isLoading && <LoadingCircle />}</div>
        {data && (
          <div className="absolute top-16 w-full rounded-md border-2 border-green-500 bg-white/40 px-4 py-2 ">
            {data.data.results.map((item: Episode) => {
              return <div key={item.id}>{item.title_original}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
