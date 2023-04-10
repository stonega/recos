import useSWR from "swr";
import { toast} from 'sonner'
import { useCallback, useState } from "react";
import Image from "next/image";
import useDebounce from "hooks/use-debounce";
import { AudioInput, Episode } from "types";
import { LoadingCircle } from "../shared/icons";
import { motion } from "framer-motion";
import { ofetch } from "ofetch";

interface SearchPodcastProps {
  onResult: (result: AudioInput) => void;
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
const fetcher = (url: string) => ofetch(url);

export const SearchPodcast = ({ onResult }: SearchPodcastProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.trim(), 1000);
  const { data, error, isLoading } = useEpisodes(debouncedSearch);

  const submit = useCallback(
    async (id: string) => {
      try {
        setIsSubmitting(true);
        const episode = await ofetch(`/api/episode?id=${id}`);
        setSearch('')
        onResult({
          input: episode.audio,
          duration: episode.audio_length_sec,
          prompt: episode.podcast.name + episode.name+ episode.description,
          transcript: episode.transcript
        })
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onResult],
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
        {data && search && (
          <motion.div
            layoutId="underline"
            className="absolute top-16 w-full rounded-md border-2 border-green-500 bg-white/40 backdrop-blur-md px-2 py-2 "
          >
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
                    className="rounded-fill m-2 object-cover"
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
          </motion.div>
        )}
      </div>
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
