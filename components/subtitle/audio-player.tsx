import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AudioData, useAudioPlayer } from "./audio-provider";
import { Slider } from "./buttons/slider";

import {
  VolumeX,
  PlayCircle,
  Rewind,
  FastForward,
  PauseCircle,
} from "lucide-react";
import { PlaybackRateButton } from "./buttons/playback-rate-button";

function parseTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  return [hours, minutes, seconds];
}

function formatHumanTime(seconds: number) {
  // TODO: i18n
  const [h, m, s] = parseTime(seconds);
  return `${h} hour${h === 1 ? "" : "s"}, ${m} minute${
    m === 1 ? "" : "s"
  }, ${s} second${s === 1 ? "" : "s"}`;
}

export function AudioPlayer({ audio }: { audio?: AudioData }) {
  const player = useAudioPlayer(audio);
  const wasPlayingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(player.currentTime);

  useEffect(() => {
    setCurrentTime(undefined);
  }, [player.currentTime]);

  const numberFormatter = {
    format: formatHumanTime,
    resolvedOptions: Intl.NumberFormat().resolvedOptions,
  };

  return (
    <div className="flex items-center gap-6 rounded-md bg-green-300 px-4 py-4 sticky top-10 backdrop-blur-lg dark:bg-green-900 md:px-6">
      <div className="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
        <span
          className="truncate text-center text-xl font-bold leading-6 md:text-left"
          title={player?.meta?.title}
        >
          {player?.meta?.title}
        </span>
        <div className="flex justify-between gap-6">
          <div className="flex flex-none items-center gap-4">
            <Rewind onClick={() => player.seekBy?.(-10)} />
            <div className="">
              {player?.playing ? (
                <PauseCircle
                  size={32}
                  className="cursor-pointer"
                  onClick={() => player.pause?.()}
                />
              ) : (
                <PlayCircle
                  size={32}
                  className="cursor-pointer"
                  onClick={() => player.play?.()}
                />
              )}
            </div>
            <FastForward
              className="cursor-pointer"
              onClick={() => player.seekBy?.(10)}
            />
          </div>
          <Slider
            label="Curren time"
            maxValue={player.duration}
            step={1}
            value={currentTime ?? player.currentTime ?? 0}
            onChange={(value: any) => setCurrentTime(value)}
            onChangeEnd={(value: any) => {
              player.seek?.(value);
              if (wasPlayingRef.current) {
                player.play?.();
              }
            }}
            numberFormatter={numberFormatter as any}
            onChangeStart={() => {
              wasPlayingRef.current = player.playing;
              player.pause?.();
            }}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <PlaybackRateButton player={player} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
