import { SrtItem, convertTimeToSeconds, parseTimestamp } from "utils";
import classnames from "classnames";
import { useContext, useEffect, useMemo, useRef } from "react";
import { AudioPlayerContext } from "./audio-provider";
import { PlayCircle } from "lucide-react";

const SrtItemCard = ({
  srtItem,
  showTranslation,
}: {
  srtItem: SrtItem;
  showTranslation: boolean;
}) => {
  const player = useContext(AudioPlayerContext);

  const containerElement = useRef<HTMLDivElement>(null);
  const active = useMemo(() => {
    const start = convertTimeToSeconds(srtItem.startTimestamp!);
    const end = convertTimeToSeconds(srtItem.endTimestamp!);
    const active =
      player?.currentTime &&
      player?.currentTime > start &&
      player?.currentTime <= end;
    return active;
  }, [player?.currentTime, srtItem.endTimestamp, srtItem.startTimestamp]);

  useEffect(() => {
    const { current } = containerElement;
    if (current && active) {
      player?.setSrtItem?.({ ...srtItem, position: current.offsetTop });
    }
  }, [containerElement, active, player?.setSrtItem]);

  return (
    <>
      <div
        ref={containerElement}
        className={classnames(
          "group flex flex-row items-start border-b-2 border-b-green-400 py-2 pt-2 transition-all delay-150 ease-in-out dark:text-white",
          {
            "-mx-2 -my-1 rounded-md bg-green-400 px-2 py-1 transition-all delay-150 ease-in-out":
              active,
          },
        )}
      >
        <div className="group-hover:hidden mr-4">{parseTimestamp(srtItem.startTimestamp!)}</div>
        <PlayCircle
          size={24}
          className="hidden group-hover:block cursor-pointer mr-6"
          onClick={() =>
            player?.seek?.(convertTimeToSeconds(srtItem.startTimestamp!))
          }
        />
        <div className="flex flex-col items-start space-y-2">
          <div className="font-serifs text-xl">{srtItem.text}</div>
          {showTranslation && (
            <div className="font-serifs text-md">{srtItem.translation}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default SrtItemCard;
