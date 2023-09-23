import { dateFromNow } from "@/lib/utils";
import { useRouter } from "next/router";
import React from "react";
import { CreditHistory } from "types";
import { formatDuration } from "utils";
interface HistoryCardProps {
  history: CreditHistory;
}
const HistoryCard = ({ history }: HistoryCardProps) => {
  const router = useRouter();
  function toDetailPage() {
    router.push(`/subtitle/${encodeURIComponent(history.id)}`, undefined, {
      scroll: false,
    });
  }
  return (
    <div
      className="flex cursor-pointer flex-row justify-between py-4 transition-all hover:bg-green-300 hover:px-2 dark:hover:bg-green-800"
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
        <div className="text-lg dark:text-white">Credit {history.credit}</div>
        <div className="text-sm opacity-70 dark:text-white">
          {formatDuration(history.audio_length / 1000)}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
