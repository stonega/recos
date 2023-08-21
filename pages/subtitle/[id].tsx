import { SrtItem, convertTimeToSeconds, parseTimestamp } from "utils";
import useSWR from "swr";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { CreditHistory, Meta } from "types";
import SrtItemCard from "@/components/subtitle/srt-item-card";
import Confetti from "@/components/shared/confetti";
import { AudioPlayer } from "@/components/subtitle/audio-player";
import { saveAs } from "file-saver";
import { useEffect, useMemo, useState } from "react";
import {
  AudioProvider,
  useAudioPlayer,
} from "@/components/subtitle/audio-provider";
import Tooltip from "@/components/shared/tooltip";
import { useClipboard } from "use-clipboard-copy";
const FILE_SERVER =
  "https://recos-audio-slice-production.up.railway.app/files/";
const SubtitlePage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const request = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };
  const isFresh = router.query.fresh === "true";

  const { data } = useSWR<SrtItem[]>(
    () => `/api/subtitle/${encodeURIComponent(id)}`,
    request,
  );
  const { data: record } = useSWR<CreditHistory>(
    () => `/api/record/${encodeURIComponent(id)}`,
    request,
  );
  const clipboard = useClipboard({
    copiedTimeout: 2000, // timeout duration in milliseconds
  });

  const handleExportSrt = () => {
    if (!data) return "";
    const content = data
      .map((subtitle) => `${subtitle.subtitle_id}\n${subtitle.start_timestamp} --> ${subtitle.end_timestamp}\n${subtitle.text}`)
      .join("\n\n")
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${record?.name}.srt`);
  };
  const handleExportText = () => {
    if (!data) return "";
    const content = data
      .map((subtitle) => subtitle.text)
      .join(" ")
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${record?.name}.txt`);
  };

  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Recos.",
  };
  const audioPlayerData = useMemo(
    () =>
      record
        ? {
            title: record.name,
            audio: {
              src: record.audio_url.startsWith("http")
                ? record.audio_url
                : FILE_SERVER + record.audio_url,
            },
          }
        : undefined,
    [record],
  );  

  return (
    <AudioProvider>
      <Layout meta={meta}>
        {isFresh && <Confetti />}
        {record && (
          <>
            <div className="mb-10 mt-10 dark:text-white">
              <div className="flex flex-row justify-between items-center">
                <div className="text-4xl">{record.name}</div>
                <div className="flex flex-row">
                  <Tooltip content="Export pure text">
                    <button
                      className="button px-2"
                      onClick={() => handleExportText()}
                    >
                      TXT
                    </button>
                  </Tooltip>
                  <Tooltip content="Export srt file">
                    <button
                      className="button px-2"
                      onClick={() => handleExportSrt()}
                    >
                      SRT
                    </button>
                  </Tooltip>
                  {/* <Tooltip content="Export PDF">
            <PDFExportButton json={json} name={title}></PDFExportButton>
          </Tooltip> */}
                </div>
              </div>
            </div>
            <AudioPlayer audio={audioPlayerData} />
          </>
        )}
        <div className="mr-8"></div>
        {data &&
          data.map((subtitle) => {
            return <SrtItemCard key={subtitle.id} srtItem={subtitle} />;
          })}
      </Layout>
    </AudioProvider>
  );
};

export default SubtitlePage;
