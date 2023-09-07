import useSWR from "swr";
import { SrtItem } from "utils";

const TranscriptionContent = ({ taskId }: { taskId: string }) => {
  const request = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };
  const { data } = useSWR<{ summary: string; subtitles: SrtItem[] }>(
    () => `/api/subtitle/${encodeURIComponent(taskId)}`,
    request,
  );

  return (
    <div className="flex flex-col space-y-1 bg-gradient-to-b from-black to-black/10 bg-clip-text">
      {data?.subtitles.slice(0, 3).map((item, index) => (
        <div
          key={item.id}
          className="line-clamp-1 bg-clip-text text-transparent"
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default TranscriptionContent;
