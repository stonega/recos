import { dateFromNow } from "@/lib/utils";
import { useCredits } from "hooks/use-api";
import { useRouter } from "next/router";
import Image from "next/image";
import { YoutubeIcon, FileAudio } from "lucide-react";
import TranscriptionContent from "./transcription-content";
import Link from "next/link";
import { useTranslation } from "next-i18next";

interface RecentTranscriptionsProps {
  token: string;
  status: "completed" | "pending";
}
const RecentTranscriptions = ({ token, status }: RecentTranscriptionsProps) => {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { data, isLoading, error } = useCredits(
    1,
    status === "pending" ? 1000 : 6,
    status,
    token,
  );
  if (!isLoading && data?.length === 0) return null;
  return (
    <>
      <div className="mt-8 flex flex-row items-center justify-between dark:text-white">
        <span className="text-2xl font-semibold text-green-600">
          {status === "pending" ? t("pending") : t("recent")}
        </span>
        {status === "completed" && (
          <div>
            <Link
              href="/credit"
              className="text-green-600 underline underline-offset-4 hover:text-green-600 hover:decoration-wavy"
              scroll={false}
            >
              {t("view-all")}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading
          ? ["✨", "✨", "✨"].map((_, index) => (
              <>
                <div className="card" key={index}>
                  <div className="flex animate-pulse flex-col">
                    <div className="mt-2 h-4 w-[20%] rounded-md bg-black/50"></div>
                    <div className="text-md mt-2 h-4 w-full rounded-md bg-black/50"></div>
                    <div className="mt-2 h-4 w-[60%] rounded-md bg-black/50"></div>
                    <div className="mt-2 h-4 w-[30%] rounded-md bg-black/50"></div>
                  </div>
                </div>
              </>
            ))
          : data?.map((item) => {
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
                          <span>{dateFromNow(item.create_at)}</span>
                          <span className="dot-loader ml-4">Transcript</span>
                        </div>
                      ) : (
                        <div className="mb-2 text-sm opacity-70">
                          <span>{dateFromNow(item.create_at)}</span>
                        </div>
                      )}
                      <div className="mb-2 line-clamp-1 text-xl">
                        {item.name}
                      </div>
                      {status === "pending" ? (
                        <div className="flex flex-col">
                          <div className="text-md h-4 w-full rounded-md bg-black/20"></div>
                          <div className="mt-2 h-4 w-[60%] rounded-md bg-black/20"></div>
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
            })}
      </div>
    </>
  );
};

export default RecentTranscriptions;
