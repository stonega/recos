import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../shared/button";
import {
  formatDuration,
  getFee,
  getCredit,
  getTime,
  mergeMultipleSrtStrings,
  transcript,
  unzipAudios,
} from "utils";
import { useApiModal } from "./api-modal";
import { toast } from "sonner";
import { AudioInput, TranscriptOption } from "types";
import { ofetch } from "ofetch";
import InfoCard from "../shared/info-card";
import * as Switch from "@radix-ui/react-switch";
import ResultEditor from "./result-editor";
import Confetti from "../shared/confetti";
import { useSession } from "next-auth/react";
interface ResultProps {
  input: AudioInput;
  token: string;
}

type Step = "input" | "downloading" | "loading" | "result";
const DEFAULT_PROMPT = "Add punctuation marks and format the text.";
const BASE_URL = "https://recos-audio-slice-production.up.railway.app";
const DEFAULT_OPTION: TranscriptOption = {
  prompt: "",
  translate: false,
  srt: false,
};

const Result = ({ input, token }: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [progress, setProgress] = useState(0);
  const [option, setOption] = useState<TranscriptOption>(DEFAULT_OPTION);
  const [duration, setDuration] = useState<number>(input.duration);
  const { setShowApiModal, ApiModal } = useApiModal();
  const [result, setResult] = useState("");
  const { data: session } = useSession();
  const filename = useMemo(() => {
    if (typeof input.input === "string") {
      return input.title;
    }
    return input.title.split(".").slice(0, -1).join(".");
  }, [input]);

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
    setStep("input");
    setResult("");
  };
  const audioSource = useMemo(() => {
    if (typeof input.input === "string") {
      return input.input;
    }
    return URL.createObjectURL(input.input);
  }, [input.input]);

  const submit = async () => {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey && !session) {
      setShowApiModal(true);
      return;
    }
    let audioFiles = [input.input];
    if (session) {
      const credits = getCredit(duration)
      const own = await ofetch('/api/credit')
      if(own.credit < credits) {
        toast.error(`You need ${credits} credits to transcribe this audio. You have ${own.credit} credits.`, {
          duration: 10000,
        })
        return
      }
      if (typeof input.input === "string") {
        setStep("loading");
        try {
          const response = await ofetch(`${BASE_URL}/transcript`, {
            query: { url: input.input, srt: option.srt, prompt: option.prompt, title: input.title },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const finalResult = option.srt
            ? mergeMultipleSrtStrings(...response)
            : response.join(" ");
          setStep("result");
          setResult(finalResult);
          document.title = "Task Completed, " + filename;
          return;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      } else {
        setStep("loading");
        try {
          const formData = new FormData();
          formData.append("file", input.input);
          formData.append("srt", option.srt.toString());
          formData.append("prompt", option.prompt);
          const response = await ofetch(`${BASE_URL}/transcript`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const finalResult = option.srt
            ? mergeMultipleSrtStrings(...response)
            : response.join(" ");
          setStep("result");
          setResult(finalResult);
          return;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      }
    } else {
      if (typeof input.input === "string") {
        setStep("downloading");
        try {
          const response = await ofetch(`${BASE_URL}/download`, {
            query: { url: input.input },
            responseType: "blob",
          });
          const audios = await unzipAudios(response, async (progress) =>
            setProgress(progress),
          );
          audioFiles = audios;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      } else if (
        input.input instanceof File &&
        input.input.size >= 20 * 1024 * 1024
      ) {
        setStep("downloading");
        try {
          const formData = new FormData();
          formData.append("file", input.input);
          const response = await ofetch(`${BASE_URL}/upload`, {
            method: "POST",
            body: formData,
            responseType: "blob",
          });
          const audios = await unzipAudios(response, async (progress) =>
            setProgress(progress),
          );
          audioFiles = audios;
        } catch (error) {
          setStep("input");
          if (error instanceof Error) toast.error(error.message);
          return;
        }
      }
      setStep("loading");
      try {
        const results = await Promise.all(
          audioFiles.map((file) => {
            return transcript(
              file as File,
              {
                translate: option.translate,
                prompt: option.prompt,
                srt: option.srt,
              },
              apiKey!,
            );
          }),
        );
        setStep("result");
        const finalResult = option.srt
          ? mergeMultipleSrtStrings(...results)
          : results.join(" ");
        setResult(finalResult);
        document.title = "Task Completed, " + filename;
      } catch (error) {
        setStep("input");
        if (error instanceof Error) toast.error(error.message);
      }
    }
  };
  return (
    <>
      <div className="border-1 mt-6 min-h-[10rem] w-full rounded-md border border-green-400 bg-white/40 dark:bg-black/40">
        <div className="flex flex-col items-center justify-start gap-2 p-2">
          <ApiModal />
          <div className="pt-4 pb-2 text-2xl font-bold break-all dark:text-white">
            {input.title}
          </div>
          <div className="w-full rounded-md bg-green-200 px-4 py-6 dark:bg-green-400">
            <audio className="w-full" controls src={audioSource}></audio>
          </div>
        </div>
        {step === "input" && (
          <>
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
                <div className="col-span-2 flex flex-col space-y-2 rounded-md bg-green-200 p-4 dark:bg-green-400 md:col-span-4">
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
                <div className="col-span-1 flex flex-col items-center justify-between space-y-2 rounded-md bg-green-200 p-2 pt-4 dark:bg-green-400">
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {step === "input" && (
        <Button className="mx-auto mt-10 mb-6 px-8" onClick={submit}>
          Generate Transcription
        </Button>
      )}
      {step === "loading" && (
        <div className="darK:text-white mt-10 flex h-60 flex-col items-center justify-center gap-2">
          <span className="dot-loader text-2xl">Generating</span>
          <span className="mb-12">
            Please <span className="font-bold">DON&apos;T</span> close the tab, and wait a few minutes.{" "}
          </span>
          <span className="printer-loader mb-24"></span>
        </div>
      )}
      {step === "downloading" && (
        <div className="mt-10 flex h-60 flex-col items-center justify-center gap-2 dark:text-white">
          <span className="dot-loader text-2xl">Preparing</span>
          <span className="mb-10">
            Please <span className="font-bold">DON&apos;T</span> close the tab, and wait a few minutes.{" "}
          </span>
          <span className="player-loader"></span>
          <div className="my-10"></div>
        </div>
      )}
      {step === "result" && (
        <>
          <Confetti></Confetti>
          <ResultEditor
            text={result}
            title={filename}
            onBack={handleBack}
            srt={option.srt}
          />
        </>
      )}
    </>
  );
};

export default Result;
