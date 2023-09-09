import { SrtItem, convertTimeToSeconds, parseTimestamp } from "utils";
import classnames from "classnames";
import { useContext, useEffect, useMemo, useRef } from "react";
import { AudioPlayerContext } from "./audio-provider";

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
          "pt-2 flex flex-row items-start border-b-2 border-b-green-400 py-2 dark:text-white",
          { "bg-green-400 transition-colors": active },
        )}
      >
        <div className="mr-4">{parseTimestamp(srtItem.startTimestamp!)}</div>
        <div className="flex flex-col items-start space-y-2">
          <div className="font-serifs text-xl">{srtItem.text}</div>
          {showTranslation && (
            <div className="font-serifs text-md">
              {srtItem.translation}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SrtItemCard;
