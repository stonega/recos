import { dateFromNow } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { CreditHistory } from "types";
import { formatDuration } from "utils";
interface HistoryCardProps {
  history: CreditHistory;
}
const HistoryCard = ({ history }: HistoryCardProps) => {
  return (
    <div className="mt-4 flex flex-row justify-between">
      <div className="flex flex-col">
        <div className="text-xl dark:text-white">
          {history.name === "" ? "Unknown" : history.name}
        </div>
        <div className="text-sm opacity-70 dark:text-white">
          {dateFromNow(history.create_at)}
        </div>
        <Link href={`/subtitle/${encodeURIComponent(history.id)}`}>Read</Link>
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
