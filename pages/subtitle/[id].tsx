import { SrtItem } from "utils";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import useSWR from "swr";
import { CreditHistory, Meta } from "types";
import SrtItemCard from "@/components/subtitle/srt-item-card";
import Confetti from "@/components/shared/confetti";
import AudioPlayer from "@/components/subtitle/audio-player";
import { saveAs } from "file-saver";
import { useState } from "react";
import { AudioProvider } from "@/components/subtitle/audio-provider";
import Tooltip from "@/components/shared/tooltip";
import { toast } from "sonner";
import TaskButton from "@/components/subtitle/task-button";
import { ofetch } from "ofetch";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_SETTINGS } from "@/lib/constants";
import { prisma } from "../../lib/prisma";
import { useTranslation } from "next-i18next";
import { getTokenProps, getTranslationProps } from "@/lib/server-side-props";

const FILE_SERVER =
  "https://recos-audio-slice-production.up.railway.app/files/";
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";

export async function getServerSideProps(context: any) {
  const id = context.query.id as string;
  const record = await prisma?.credit.findFirst({ where: { id } });

  return {
    props: {
      record: {
        id: record?.id,
        task_id: record?.task_id,
        name: record?.name,
        audio_url: record?.audio_url,
        type: record?.type,
        audio_length: record?.audio_length,
      },
      ...(await getTokenProps(context)),
      ...(await getTranslationProps(context, "subtitle")),
    },
  };
}

const SubtitlePage = ({
  token,
  record,
}: {
  token: any;
  record: CreditHistory;
}) => {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.studio",
    title: "Recos.",
  };

  const audioPlayerData = {
    title: record.name,
    audio: {
      src: record.audio_url.startsWith("http")
        ? record.audio_url
        : FILE_SERVER + record.audio_url,
    },
  };
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
  const { t } = useTranslation(["subtitle", "common"]);
  const { data, mutate } = useSWR<{
    summary: string;
    recos: string;
    subtitles: SrtItem[];
    translateStatus?: string;
    summaryStatus?: string;
    recosStatus?: string;
  }>(`/api/subtitle/${encodeURIComponent(record["task_id"])}`, request);

  const handleExportSrt = () => {
    if (!data) return "";
    const content = data.subtitles
      .map(
        (subtitle) =>
          `${subtitle.id}\n${subtitle.startTimestamp} --> ${subtitle.endTimestamp}\n${subtitle.text}`,
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

  const handleTask = async (task: string) => {
    if (
      (task === "translate" && !data?.translateStatus) ||
      (task === "summary" && !data?.summary) ||
      (task === "recos" && !data?.recos)
    ) {
      const d = await request(
        `/api/subtitle/${encodeURIComponent(record["task_id"])}`,
      );
      mutate(d);
    }
    if (task === "translate" && data?.translateStatus) {
      setShowTranslation(() => !showTranslation);
      return;
    }
    if (task === "recos" && data?.recos) {
      if (activeTab === task) {
        setActiveTab(undefined);
        return;
      }
      setActiveTab(task as any);
      return;
    }
    if (task === "summary" && data?.summary) {
      if (activeTab === task) {
        setActiveTab(undefined);
        return;
      }
      setActiveTab(task as any);
      return;
    }
    const url = `${BASE_URL}/subtitles/${task}/${encodeURIComponent(id)}`;
    mutate({ ...data, [`${task}Status`]: "pending" });
    await ofetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // mutate({ ...data, [`${task}Status`]: task_id });
    toast.success("Request sent successfully! Check back later.");
  };

  return (
    <AudioProvider>
      <Layout meta={meta}>
        {isFresh && <Confetti />}
        <div className="mb-6 mt-0 flex flex-col items-center justify-between space-y-2 md:mt-10 md:flex-row">
          <div className="text-4xl dark:text-white">{record.name}</div>
          <div className="flex w-full flex-row justify-start md:w-auto">
            <Tooltip content="Export pure text">
              <button
                className="px-2"
                style={{ display: "block" }}
                onClick={() => handleExportText()}
              >
                TXT
              </button>
            </Tooltip>
            <Tooltip content="Export srt file">
              <button
                className="px-2"
                style={{ display: "block" }}
                onClick={() => handleExportSrt()}
              >
                SRT
              </button>
            </Tooltip>
          </div>
        </div>
        <AudioPlayer audio={audioPlayerData} />
        <div className="flex flex-row space-x-2 overflow-x-scroll py-4 md:overflow-hidden">
          <TaskButton
            task="translate"
            handleTask={handleTask}
            taskId={data?.translateStatus}
          />
          <TaskButton
            task="summary"
            handleTask={handleTask}
            taskId={data?.summaryStatus}
          />
          <TaskButton
            task="recos"
            handleTask={handleTask}
            taskId={data?.recosStatus}
          />
        </div>
        <AnimatePresence>
          {activeTab === "recos"
            ? data && (
                <motion.div
                  className="mb-8 mt-4 rounded-md border-2 border-green-400 p-2 text-xl leading-10 dark:text-white"
                  {...FADE_DOWN_ANIMATION_SETTINGS}
                >
                  {data.recos}
                </motion.div>
              )
            : activeTab === "summary" &&
              data && (
                <motion.div
                  className="mb-8 mt-4 rounded-md border-2 border-green-400 p-4 text-xl leading-10 dark:text-white"
                  {...FADE_DOWN_ANIMATION_SETTINGS}
                >
                  {data.summary}
                </motion.div>
              )}
        </AnimatePresence>
        {data?.subtitles &&
          data?.subtitles.map((subtitle) => {
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
