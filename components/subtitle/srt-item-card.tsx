import { SrtItem, convertTimeToSeconds, parseTimestamp } from "utils";
import classnames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AudioPlayerContext } from "./audio-provider";

const SrtItemCard = ({
  srtItem
}: {
  srtItem: SrtItem;
}) => {

  const player = useContext(AudioPlayerContext)

  const [autoScroll, setAutoScroll] = useState(true);
  const containerElement = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const start = convertTimeToSeconds(srtItem.start_timestamp!)
  //   const end = convertTimeToSeconds(srtItem.end_timestamp!)
  //   const active = player?.currentTime && player?.currentTime > start && player?.currentTime <= end
  //   if (!autoScroll) {
  //     return;
  //   }
  //   const { current } = containerElement;
  //   if (current && active) {
  //     current.scrollTop = current.scrollHeight;
  //   }
  // }, [containerElement, autoScroll, srtItem.start_timestamp, srtItem.end_timestamp, player?.currentTime]);

  const activeClassName = useMemo(() => {
    const start = convertTimeToSeconds(srtItem.start_timestamp!)
    const end = convertTimeToSeconds(srtItem.end_timestamp!)
    const active = player?.currentTime && player?.currentTime > start && player?.currentTime <= end
    return active ?  "text-green-600 font-bold" : ""
  }, [player?.currentTime, srtItem.end_timestamp, srtItem.start_timestamp])
  return (
    <>

      <div className="mt-2 flex flex-row items-center border-b-2 border-b-green-600 py-2 dark:text-white">
        <div className="mr-4">{parseTimestamp(srtItem.start_timestamp!)}</div>
        <div className={classnames("font-serifs text-xl", activeClassName)}>{srtItem.text}</div>
      </div>
    </>
  );
};

export default SrtItemCard;
