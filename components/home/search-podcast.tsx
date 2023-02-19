import { createToast } from "vercel-toast-center";
import useSWR from "swr";
import { useCallback, useState } from "react";
import Image from "next/image";
import useDebounce from "hooks/use-debounce";
import { Episode } from "types";
import { LoadingCircle } from "../shared/icons";
import { TEST_EPISODES } from "utils/constant";

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

  const submit = useCallback(
    async (id: string) => {
      try {
        setIsSubmitting(true);
        const episodeRes = await fetch(`/api/episode?id=${id}`);
        const episode = await episodeRes.json();
        if (episode.transcript) {
          const res = await fetch("/api/analyze", {
            method: "post",
            body: JSON.stringify({ data }),
          });
          const result = await res.json();
          setSearch("");
          onResult(result);
        } else {
          createToast("Sorry, no transcript found in this episode.");
        }
      } catch (error) {
        if (error instanceof Error) createToast(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, onResult],
  );

  return (
    <div className="flex flex-row gap-4">
      <div className="relative flex flex-col gap-4">
        <input
          className="input"
          placeholder="Search podcast episode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute top-5 right-4">
          {isLoading && <LoadingCircle />}
        </div>
        {data && (
          <div className="absolute top-16 w-full rounded-md border-2 border-green-500 bg-white/40 px-2 py-2 ">
            {data.results.map((item: Episode) => {
              return (
                <div
                  onClick={() => submit(item.id)}
                  key={item.id}
                  className="flex cursor-pointer flex-row space-x-2 hover:bg-green-100"
                >
                  <Image
                    src={item.podcast.image}
                    alt={item.title_original}
                    width="60"
                    height="60"
                    className="m-2 h-10 w-10 rounded-md object-cover"
                    unoptimized
                  />
                  <div>
                    <div className="opacity-60">
                      {item.podcast.title_original}
                    </div>
                    <div>{item.title_original}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
