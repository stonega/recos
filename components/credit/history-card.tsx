import { dateFromNow } from "@/lib/utils";
import { RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/router";
import { ofetch } from "ofetch";
import React from "react";
import { toast } from "sonner";
import { CreditHistory } from "types";
import { formatDuration } from "utils";
interface HistoryCardProps {
  history: CreditHistory;
  token: string;
}
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const HistoryCard = ({ history, token }: HistoryCardProps) => {
  const router = useRouter();
  function toDetailPage() {
    if (history.status != "completed") return;
    router.push(`/subtitle/${encodeURIComponent(history.id)}`, undefined, {
      scroll: false,
    });
  }
  async function retry(id: string) {
    await ofetch(
      `${BASE_URL}/transcript-task/retry/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    toast.success("Request sent successfully! Check back later.");
  }
  return (
    <div
      className="group flex cursor-pointer flex-row justify-between rounded-md py-4 transition-all hover:-mx-2 hover:bg-green-300 hover:px-2 dark:hover:bg-green-800"
      onClick={toDetailPage}
    >
      <div className="flex flex-col">
        <div className="text-xl dark:text-white">
          {history.name === "" ? "Unknown" : history.name}
        </div>
        <div className="text-sm opacity-70 dark:text-white">
          {dateFromNow(history.create_at)}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-lg dark:text-white">
          {formatDuration(history.audio_length / 1000)}
        </div>
        {history.status === "completed" ? (
          <div className="text-sm opacity-70 dark:text-white">
            Credit {history.credit}
          </div>
        ) : history.status === "pending" ? (
          <span className="dot-loader ml-4">Transcript</span>
        ) : (
          <>
            <span className="inline text-red-600 group-hover:hidden">
              Failed
            </span>
            <span
              className="button hidden group-hover:inline"
              onClick={() => retry(history.id)}
            >
              Retry
              <RotateCcwIcon className="ml-2 inline" size={14} />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
