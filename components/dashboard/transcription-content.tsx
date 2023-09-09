import useSWR from "swr";
import { SrtItem } from "utils";

const TranscriptionContent = ({ taskId }: { taskId: string }) => {
  const request = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };
  const { data, isLoading } = useSWR<{ summary: string; subtitles: SrtItem[] }>(
    () => `/api/subtitle/${encodeURIComponent(taskId)}`,
    request,
  );

  return (
    <div className="flex flex-col space-y-1 bg-gradient-to-b from-black to-black/10 bg-clip-text dark:from-white dark:to-white/10">
      {isLoading ? (
        <div className="flex animate-pulse flex-col">
          <div className="text-md h-4 w-full rounded-md bg-black/50"></div>
          <div className="mt-2 h-4 w-[60%] rounded-md bg-black/50"></div>
        </div>
      ) : (
        data?.subtitles.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="line-clamp-1 bg-clip-text text-transparent"
          >
            {item.text}
          </div>
        ))
      )}
    </div>
  );
};

export default TranscriptionContent;
