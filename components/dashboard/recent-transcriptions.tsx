import { dateFromNow } from "@/lib/utils";
import { useCredits } from "hooks/use-api";
import { useRouter } from "next/router";
import Image from "next/image";
import { YoutubeIcon, FileAudio } from "lucide-react";
import { formatDuration } from "utils";
import TranscriptionContent from "./transcription-content";
import Link from "next/link";

interface RecentTranscriptionsProps {
  token: string;
  status: "completed" | "pending";
}
const RecentTranscriptions = ({ token, status }: RecentTranscriptionsProps) => {
  const router = useRouter();
  const { data, isLoading, error } = useCredits(
    1,
    status === "pending" ? 1000 : 6,
    status,
    token,
  );
  if (!isLoading && data?.length === 0) return null;
  return (
    <>
      <div className="mt-8 dark:text-white flex flex-row justify-between items-center">
        <span className="text-2xl font-semibold">
          {status === "pending" ? "Pending" : "Recent"}
        </span>
        {status === "completed" && <Link href="/credit" className="text-green-600 underline underline-offset-4 hover:text-green-600 hover:decoration-wavy">View All</Link>}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading ? (
          ["✨", "✨", "✨"].map((_, index) => (
            <>
              <div className="card" key={index}>
                <div className="flex animate-pulse flex-col">
                  <div className="mt-2 h-4 w-[20%] rounded-md bg-gray-800 md:bg-gray-200"></div>
                  <div className="text-md mt-2 h-4 w-full rounded-md bg-gray-800 md:bg-gray-200"></div>
                  <div className="mt-2 h-4 w-[60%] rounded-md bg-gray-800 md:bg-gray-200"></div>
                  <div className="mt-2 h-4 w-[30%] rounded-md bg-gray-800 md:bg-gray-200"></div>
                </div>
              </div>
            </>
          ))
        ) : error ? (
          <div>Error</div>
        ) : (
          data?.map((item) => {
            return (
              <div
                className="card cursor-pointer"
                key={item.id}
                onClick={() =>
                  router.push(`/subtitle/${encodeURIComponent(item.id)}`)
                }
              >
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    {status === "pending" ? (
                      <div className="mb-2 text-sm opacity-70">
                        <span className="dot-loader mr-4">Transcipting</span>
                        <span>{dateFromNow(item.create_at)}</span>
                      </div>
                    ) : (
                      <div className="mb-2 text-sm opacity-70">
                        <span>{dateFromNow(item.create_at)}</span>
                      </div>
                    )}
                    <div className="mb-2 line-clamp-1 text-xl">{item.name}</div>
                    {status === "pending" ? (
                      <div className="flex animate-pulse flex-col">
                        <div className="text-md h-4 w-full rounded-md bg-gray-800 md:bg-gray-200"></div>
                        <div className="mt-2 h-4 w-[60%] rounded-md bg-gray-800 md:bg-gray-200"></div>
                      </div>
                    ) : (
                      <TranscriptionContent taskId={item.id} />
                    )}
                  </div>
                  <div className="min-w-[34px]">
                    {item.type === "podcast" ? (
                      <div className="overflow-clip rounded-full border-2 border-[#4bb21a] p-[2px]">
                        <Image
                          src={item.audio_image}
                          alt={item.name}
                          width={30}
                          height={30}
                          className="rounded-full"
                          unoptimized
                        />
                      </div>
                    ) : item.type === "youtube" ? (
                      <YoutubeIcon size={30} color="#c4302b" />
                    ) : (
                      <FileAudio size={30} color="#4bb21a" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default RecentTranscriptions;
