import { SrtItem, convertTimeToSeconds, parseTimestamp } from "utils";
import classnames from "classnames";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

  const activeClassName = useMemo(() => {
    return active ? "text-green-600 font-bold" : "";
  }, [active]);
  return (
    <>
      <div
        ref={containerElement}
        className="mt-2 flex flex-row items-start border-b-2 border-b-green-600 py-2 dark:text-white"
      >
        <div className="mr-4">{parseTimestamp(srtItem.startTimestamp!)}</div>
        <div className="flex flex-col items-start space-y-2">
          <div className={classnames("font-serifs text-xl", activeClassName)}>
            {srtItem.text}
          </div>
          {showTranslation && (
            <div className={classnames("font-serifs text-md", activeClassName)}>
              {srtItem.defaultTranslationText}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SrtItemCard;
