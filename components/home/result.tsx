import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../shared/button";
import {
  formatDuration,
  getFee,
  getCredit,
  getTime,
  mergeMultipleSrtStrings,
  getYoutubeId,
} from "utils";
import { toast } from "sonner";
import { AudioInput, TranscriptOption } from "types";
import { ofetch } from "ofetch";
import InfoCard from "../shared/info-card";
import * as Progress from "@radix-ui/react-progress";
import ResultEditor from "./result-editor";
import Confetti from "../shared/confetti";
import { useSession } from "next-auth/react";
import { useConfirmModal } from "../shared/confirm-modal";
import axios from "axios";
import { useRouter } from "next/router";
interface ResultProps {
  input: AudioInput;
  token: string;
}

type Step = "input" | "downloading" | "uploading" | "loading" | "result";
const DEFAULT_PROMPT = "Add punctuation marks and format the text.";
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const DEFAULT_OPTION: TranscriptOption = {
  prompt: "",
  translate: false,
  srt: true,
};

const Result = ({ input, token }: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [progress, setProgress] = useState(0);
  const [option, setOption] = useState<TranscriptOption>(DEFAULT_OPTION);
  const [duration, setDuration] = useState<number>(input.duration);
  const router = useRouter();
  const onConfirm = useCallback(() => {
    const path = localStorage.getItem("path");
    if (path && path !== "/") {
      router.push(path!);
    } else {
      setStep(() => "input");
      setResult(() => "");
    }
  }, []);
  const { setShowConfirmModal, ConfirmModal } = useConfirmModal(onConfirm);
  const [result, setResult] = useState("");
  const { data: session } = useSession();
  const filename = useMemo(() => {
    if (typeof input.input === "string") {
      return input.title;
    }
    return input.title.split(".").slice(0, -1).join(".");
  }, [input]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === "/") throw "error";
      const path = localStorage.getItem("path");
      console.log(`App is changing to ${url} ${step} ${path}`);
      if (step === "input" && path !== url) {
        localStorage.setItem("path", url);
        setShowConfirmModal(true);
        throw "error";
      } else {
        return;
      }
    };
    const removeListener = () => {
      router.events.off("routeChangeStart", handleRouteChange);
      localStorage.removeItem("path");
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return removeListener;
  }, [router.events, setShowConfirmModal, step]);

  const getAudioDuration = useCallback(() => {
    if (typeof input.input === "string") {
      setDuration(input.duration);
      return;
    }
    const audio = new Audio();
    audio.src = URL.createObjectURL(input.input);
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
  }, [input.duration, input.input]);

  useEffect(() => {
    if (input.input) setStep("input");
    getAudioDuration();
  }, [getAudioDuration, input.input]);

  const handleBack = () => {
    setShowConfirmModal(true);
  };
  const audioSource = useMemo(() => {
    if (typeof input.input === "string") {
      return input.input;
    }
    return URL.createObjectURL(input.input);
  }, [input.input]);

  const submit = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    let audioFiles = [input.input];
    if (session) {
      const credits = getCredit(duration);
      const own = await ofetch("/api/credit");
      if (own.credit < credits) {
        toast.error(
          `You need ${credits} credits to transcribe this audio. You have ${own.credit} credits.`,
          {
            duration: 10000,
          },
        );
        return;
      }
      if (typeof input.input === "string") {
        setStep("loading");
        try {
          const response = await axios.get(`${BASE_URL}/transcript-task`, {
            params: {
              url: input.input,
              srt: option.srt,
              prompt: option.prompt,
              title: input.title,
              type: input.type,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const taskId = response.data.task_id;
          const result: string[] = await new Promise((resolve, reject) => {
            const id = setInterval(async () => {
              const result = await axios.get(`${BASE_URL}/tasks/${taskId}`);
              if (result.data.task_status === "SUCCESS") {
                resolve(result.data.task_result);
                clearInterval(id);
              }
            }, 1000);
          });
          const finalResult = option.srt
            ? mergeMultipleSrtStrings(...result)
            : result.join(" ");
          router.push("/subtitle/" + taskId);
          document.title = "Task Completed, " + filename;
          return;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      } else {
        try {
          const formData = new FormData();
          formData.append("file", input.input);
          formData.append("srt", option.srt.toString());
          formData.append("prompt", option.prompt);
          setStep("uploading");
          const response = await axios.post(
            `${BASE_URL}/transcript-task`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              onUploadProgress: function (progressEvent) {
                if (!progressEvent) return;
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
                );
                setProgress(percentCompleted);
              },
            },
          );
          setStep("loading");
          const taskId = response.data.task_id;
          const id = setInterval(async () => {
            const result = await axios.get(`${BASE_URL}/tasks/${taskId}`);
            if (result.data.task_status === "SUCCESS") {
              clearInterval(id);
              router.push(
                "/subtitle/" + encodeURIComponent(taskId) + "?fresh=true",
              );
            }
          }, 1000);
          return;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      }
    }
  };
  return (
    <>
      <div className="border-1 mt-6 min-h-[10rem] w-full rounded-md border border-green-400 bg-white/40 dark:bg-black/40">
        <div className="flex flex-col items-center justify-start gap-2 p-2">
          <ConfirmModal>
            <div>
              {step === "result"
                ? "Before leaving the page, please ensure that you have saved the result."
                : "The task is currently in progress. You might lose your credits if you exit."}
            </div>
          </ConfirmModal>
          <div className="break-all pb-2 pt-4 text-2xl font-bold dark:text-white">
            {input.title}
          </div>
          {/* {input.type === "youtube" ? (
            <iframe
              className="aspect-video h-auto w-full rounded-md"
              src={`https://www.youtube.com/embed/${getYoutubeId(
                input.input as string,
              )}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          ) : (
            <div className="w-full rounded-md bg-green-200 px-4 py-6 dark:bg-green-400">
              <audio className="w-full" controls src={audioSource}></audio>
            </div>
          )} */}
        </div>
        <div className="flex flex-col items-center justify-start gap-2 p-2">
          <div className="grid w-full grid-cols-3 gap-2">
            <InfoCard
              title="🎧"
              value={formatDuration(duration)}
              prefix=""
            ></InfoCard>
            <InfoCard
              title="💰"
              value={session ? getCredit(duration) : getFee(duration)}
              prefix={session ? "Credits" : "≈$"}
            ></InfoCard>
            <InfoCard
              title="⌛"
              value={getTime(duration)}
              prefix="≈"
            ></InfoCard>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-5">
            <div className="flex flex-col space-y-2 rounded-md bg-green-200 p-4 dark:bg-green-400 md:col-span-5">
              <label htmlFor="prompt" className="text-lg">
                Prompt
              </label>
              <textarea
                name="prompt"
                cols={6}
                className="textarea"
                placeholder="Something about your audio, like language or keywords"
                value={option.prompt}
                onChange={(event) =>
                  setOption({ ...option, prompt: event.target.value })
                }
              />
            </div>
            {/* <div className="col-span-1 flex flex-col items-center justify-between space-y-2 rounded-md bg-green-200 p-2 pt-4 dark:bg-green-400">
                  <label htmlFor="srt" className="text-lg">
                    Timestamp
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] cursor-default rounded-full bg-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-green-700"
                    id="srt"
                    checked={option.srt}
                    onCheckedChange={(value) =>
                      setOption({ ...option, srt: value })
                    }
                  >
                    <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white  transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                  <span className="text-xs">Return srt format</span>
                </div> */}
          </div>
        </div>
      </div>
      {step === "input" && (
        <Button className="mx-auto mb-6 mt-10 px-8" onClick={submit}>
          Generate Transcription
        </Button>
      )}
      {step === "uploading" && (
        <div className="darK:text-white mt-10 flex h-60 flex-col items-center justify-start gap-2">
          <span className="dot-loader mb-6 text-2xl dark:text-white">
            Uploading
          </span>
          <Progress.Root
            className="relative h-[8px] w-[300px] overflow-hidden rounded-full bg-black/70 dark:bg-white/50"
            style={{
              // Fix overflow clipping in Safari
              // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
              transform: "translateZ(0)",
            }}
            value={progress}
          >
            <Progress.Indicator
              className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-green-600 transition-transform duration-[660ms]"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>
      )}
      {step === "loading" && (
        <div className="darK:text-white mt-10 flex h-60 flex-col items-center justify-center gap-2">
          <span className="dot-loader text-2xl dark:text-white">
            Generating
          </span>
          <span className="mb-12 dark:text-white">
            Please <span className="font-bold">DON&apos;T</span> close the tab,
            and wait a few minutes.{" "}
          </span>
          <span className="printer-loader mb-24"></span>
        </div>
      )}
      {step === "downloading" && (
        <div className="mt-10 flex h-60 flex-col items-center justify-center gap-2 dark:text-white">
          <span className="dot-loader text-2xl dark:text-white">Preparing</span>
          <span className="mb-10 dark:text-white">
            Please <span className="font-bold">DON&apos;T</span> close the tab,
            and wait a few minutes.{" "}
          </span>
          <span className="player-loader"></span>
          <div className="my-10"></div>
        </div>
      )}
    </>
  );
};

export default Result;
