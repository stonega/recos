import useSWR from "swr";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { AudioInput, Episode } from "types";
import { ofetch } from "ofetch";
import { LoadingCircle } from "../shared/icons";

interface SearchYoutubeProps {
  onResult: (result: AudioInput) => void;
}
interface VideoInfo {
  title: string;
  length: number;
  description?: string;
}

export const SearchYoutube = ({ onResult }: SearchYoutubeProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  const submit = useCallback(
    async (link: string) => {
      const videoInfo = await ofetch<VideoInfo>('/api/video-info?platform=youtube&link=' + link);
      try {
        setIsSubmitting(true);
        setLink("");
        onResult({
          title: videoInfo.title,
          input: link,
          duration: videoInfo.length,
          prompt: videoInfo.description,
          type: 'youtube'
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
        className="input pr-24"
        placeholder="Input youtube link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <div onClick={() => submit(link)} className="absolute cursor-pointer flex flex-col justify-center items-center font-bold right-0 top-0 bg-green-200 h-[calc(100%-4px)] w-24 m-[2px] rounded-r-[4px] hover:bg-green-300">
        {isSubmitting ? <LoadingCircle /> : 'Search'}
      </div>
    </div>
  );
};
