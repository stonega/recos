import { SrtItem } from "utils";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import useSWR from "swr";
import { CreditHistory, Meta } from "types";
import SrtItemCard from "@/components/subtitle/srt-item-card";
import Confetti from "@/components/shared/confetti";
import { AudioPlayer } from "@/components/subtitle/audio-player";
import { saveAs } from "file-saver";
import { use, useMemo, useState } from "react";
import { AudioProvider } from "@/components/subtitle/audio-provider";
import Tooltip from "@/components/shared/tooltip";
import { toast } from "sonner";

const FILE_SERVER =
  "https://recos-audio-slice-production.up.railway.app/files/";
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const SubtitlePage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const request = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };
  const isFresh = router.query.fresh === "true";
  const [activeTab, setActiveTab] = useState<"summary" | "recos" | undefined>(
    undefined,
  );
  const [showTranslation, setShowTranslation] = useState(false);

  const { data } = useSWR<{
    summary: string;
    recos: string;
    subtitles: SrtItem[];
  }>(() => `/api/subtitle/${encodeURIComponent(id)}`, request);
  const { data: record } = useSWR<CreditHistory>(
    () => `/api/record/${encodeURIComponent(id)}`,
    request,
  );
  const handleExportSrt = () => {
    if (!data) return "";
    const content = data.subtitles
      .map(
        (subtitle) =>
          `${subtitle.subtitle_id}\n${subtitle.startTimestamp} --> ${subtitle.endTimestamp}\n${subtitle.text}`,
      )
      .join("\n\n");
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${record?.name}.srt`);
  };
  const handleExportText = () => {
    if (!data) return "";
    const content = data.subtitles.map((subtitle) => subtitle.text).join(" ");
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${record?.name}.txt`);
  };

  const handleTask = (task: string) => {
    if (task === "translate" && data?.subtitles[0].defaultTranslationText) {
      setActiveTab(undefined);
      setShowTranslation(true);
      return;
    }
    if (task === "recos" && data?.recos) {
      setActiveTab(task as any);
      return;
    }
    if (task === "summary" && data?.summary) {
      setActiveTab(task as any);
      return;
    }
    toast.success("Request sent successfully! Check back later.");
    const url = `${BASE_URL}/subtitles/${task}/${encodeURIComponent(id)}`;
    fetch(url);
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
              <div className="flex flex-row items-center justify-between">
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
          </>
        )}
        <div className="mb-4 flex flex-row space-x-2">
          <div
            className="cursor-pointer rounded-full border-none bg-green-400 px-6 py-2 font-semibold dark:bg-green-600"
            onClick={() => handleTask("translate")}
          >
            ✨ Translate
          </div>
          <div
            className="cursor-pointer rounded-full border-none bg-green-400 px-4 py-2 font-semibold dark:bg-green-600"
            onClick={() => handleTask("summary")}
          >
            ✨ Summary
          </div>
          <div
            className="cursor-pointer rounded-full border-none bg-green-400 px-4 py-2 font-semibold dark:bg-green-600"
            onClick={() => handleTask("recos")}
          >
            ✨ Recos
          </div>
        </div>
        {record && <AudioPlayer audio={audioPlayerData} />}
        <div className="mr-8"></div>
        {activeTab === "recos"
          ? data && <div className="mt-8 text-xl leading-10">{data.recos}</div>
          : activeTab === "summary"
          ? data && (
              <div className="mt-8 text-xl leading-10">{data.summary}</div>
            )
          : data &&
            data.subtitles.map((subtitle) => {
              return (
                <SrtItemCard
                  key={subtitle.id}
                  srtItem={subtitle}
                  showTranslation={showTranslation}
                />
              );
            })}
      </Layout>
    </AudioProvider>
  );
};

export default SubtitlePage;
