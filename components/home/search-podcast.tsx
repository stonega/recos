import { createToast } from "vercel-toast-center";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Command } from "cmdk";
import useDebounce from "hooks/use-debounce";
import { Episode } from "types";

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
    episodes: data?.data.results as Episode[] | undefined,
    isLoading,
    error,
  };
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SearchPodcast = ({ onResult }: SearchPodcastProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.trim(), 1000);
  const { episodes, error, isLoading } = useEpisodes(debouncedSearch);

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
      <Command label="Command Menu" className="flex flex-col gap-4">
        <Command.Input
          className="input"
          placeholder="Search podcast episode"
          value={search}
          onValueChange={setSearch}
        />
        {search.trim() !== "" && (
          <Command.List className="rounded-md border-2 border-green-500 bg-white/40 px-4 py-2">
            {isLoading && (
              <Command.Loading>Fetching episodes...</Command.Loading>
            )}
            {episodes &&
              episodes.map((item) => {
                return (
                  <Command.Item key={item.id} value={item.id}>
                    {item.title_original}
                  </Command.Item>
                );
              })}
          </Command.List>
        )}
      </Command>
    </div>
  );
};
