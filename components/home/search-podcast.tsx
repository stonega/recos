import useSWR from "swr";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useDebounce from "hooks/use-debounce";
import { AudioInput, Episode } from "types";
import { LoadingCircle } from "../shared/icons";
import { motion } from "framer-motion";
import { ofetch } from "ofetch";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface SearchPodcastProps {
  onResult: (result: AudioInput) => void;
}

function useEpisodes(search: string) {
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    setPage(0);
  }, [search]);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { data, error, isLoading } = useSWR(
    () => (search !== "" ? `/api/episode?search=${search}&page=${page}` : null),
    fetcher,
    { refreshInterval: 1000000 },
  );
  useEffect(() => {
    if (data) {
      if (page === 0) {
        setEpisodes(data.episodes.data);
      } else {
        setEpisodes((episodes) => [...episodes, ...data.episodes.data]);
      }
    }
  }, [data]);
  return {
    episodes,
    isLoading,
    error,
    setPage,
    page,
  };
}
const fetcher = (url: string) => ofetch(url);

export const SearchPodcast = ({ onResult }: SearchPodcastProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.trim(), 1000);
  const { episodes, error, isLoading, setPage, page } =
    useEpisodes(debouncedSearch);

  const submit = useCallback(
    async (episode: Episode) => {
      try {
        setIsSubmitting(true);
        setSearch("");
        onResult({
          title: episode.title,
          input: episode.audioUrl,
          duration: episode.length,
          prompt: episode.podcast.title + episode.title + episode.description,
        });
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onResult],
  );

  return (
    <div className="relative flex w-full flex-col gap-4 md:w-[40rem]">
      <input
        className="input"
        placeholder="Search podcast episode with title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="absolute top-5 right-4">
        {isLoading && page === 0 && <LoadingCircle />}
      </div>

      {episodes && search && (
        <motion.div
          layoutId="underline"
          className="absolute top-16 z-10 w-full rounded-md border-2 border-green-500 bg-white/40 px-2 py-2 backdrop-blur-md dark:bg-black/50 "
        >
          <ScrollArea.Root className="h-96 w-full overflow-hidden rounded">
            <ScrollArea.Viewport className="h-full w-full rounded">
              {episodes.map((item: Episode) => {
                return (
                  <div
                    onClick={() => submit(item)}
                    key={item.id + item.audioUrl}
                    className="flex cursor-pointer flex-row space-x-2 hover:bg-green-200/50"
                  >
                    <Image
                      src={item.podcast.imageUrl}
                      alt={item.title}
                      width="60"
                      height="60"
                      className="m-2 aspect-square rounded-lg object-cover"
                      unoptimized
                    />
                    <div className="dark:text-white">
                      <div className="opacity-60">{item.podcast.title}</div>
                      <div>{item.title}</div>
                    </div>
                  </div>
                );
              })}
              <button
                className="flex w-full flex-row items-center justify-center space-x-1"
                onClick={() => setPage((page) => page + 1)}
              >
                <span>Load more</span>
                {isLoading && page > 1 && <LoadingCircle />}
              </button>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black/40 before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-black" />
          </ScrollArea.Root>
        </motion.div>
      )}
    </div>
  );
};

const EpisodeLoader = () => {
  return (
    <div className="flex animate-pulse space-x-4">
      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 rounded bg-slate-200"></div>
        <div className="space-y-3">
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="h-2 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};
