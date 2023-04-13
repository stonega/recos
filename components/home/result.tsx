import { useCallback, useEffect, useMemo, useState } from "react";
import { saveAs } from "file-saver";
import Button from "../shared/button";
import {
  formatDuration,
  getDuration,
  getFee,
  getTime,
  transcript,
  unzipAudios,
} from "utils";
import { useApiModal } from "./api-modal";
import { toast } from "sonner";
import { AudioInput } from "types";
import { ofetch } from "ofetch";
import { ArrowLeftCircle } from "lucide-react";
import InfoCard from "../shared/info-card";
import Tooltip from "../shared/tooltip";
import { useClipboard } from "use-clipboard-copy";

interface ResultProps {
  input: AudioInput;
}

type Step = "input" | "downloading" | "loading" | "result";

const DEFAULT_PROMPT = "Add punctuation marks and format the text.";

const Result = ({ input }: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<number>(input.duration);
  const { setShowApiModal, ApiModal } = useApiModal();
  const [result, setResult] = useState("");
  const clipboard = useClipboard({
    copiedTimeout: 2000, // timeout duration in milliseconds
  });

  const getAudioDuration = useCallback(() => {
    if (typeof input.input === "string") {
      setDuration(input.duration);
      return;
    }
    getDuration(input.input).then((result) => setDuration(result));
  }, [input.duration, input.input]);

  useEffect(() => {
    if (input.input) setStep("input");
    getAudioDuration();
  }, [getAudioDuration, input.input]);

  const handleExport = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${input.title ?? "transcript"}.txt`);
  };

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

  const submit = useCallback(async () => {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }
    let audioFiles = [input.input];
    if (typeof input.input === "string") {
      setStep("downloading");
      try {
        const response = await ofetch(
          "https://recos-audio-slice-production.up.railway.app/download",
          { query: { url: input.input }, responseType: "blob" },
        );
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
          return transcript(file as File, DEFAULT_PROMPT + prompt, apiKey);
        }),
      );
      setStep("result");
      setResult(results.join(" "));
    } catch (error) {
      setStep("input");
      if (error instanceof Error) toast.error(error.message);
    }
  }, [input.input, prompt, setShowApiModal]);
  return (
    <>
      <div className="border-1 mt-6 min-h-[20rem] w-full rounded-md border border-green-400 bg-white/40 dark:bg-black/40">
        <div className="flex flex-col items-center justify-start gap-2 p-2">
          <ApiModal />
          <div className="py-6 text-2xl font-bold dark:text-white">
            {input.title}
          </div>
          <div className="w-full rounded-md bg-green-200 px-4 py-6">
            <audio className="w-full" controls src={audioSource}></audio>
          </div>
        </div>
        {step === "input" && (
          <div className="flex flex-col items-center justify-start gap-2 p-2">
            <div className="grid w-full grid-cols-3 gap-2">
              <InfoCard
                title="🎧"
                value={formatDuration(duration)}
                prefix=""
              ></InfoCard>
              <InfoCard
                title="💰"
                value={getFee(duration)}
                prefix="≈ $"
              ></InfoCard>
              <InfoCard
                title="⌛"
                value={getTime(duration)}
                prefix="≈"
              ></InfoCard>
            </div>
            <div className="flex w-full flex-col space-y-2 rounded-md bg-green-200 px-4 py-6">
              <label htmlFor="prompt">Prompt</label>
              <textarea
                name="prompt"
                cols={4}
                className="textarea"
                placeholder="Something about your audio, like language or keywords"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>

            <Button className="mt-16 mb-6" onClick={submit}>
              Generate Transcript
            </Button>
          </div>
        )}
        {step === "loading" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <span className="mb-8">Transcribing...</span>
            <span className="printer-loader"></span>
          </div>
        )}
        {step === "downloading" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <span>Preparing...</span>
            <span className="player-loader"></span>
          </div>
        )}
        {step === "result" && (
          <div className="p-4">
            <div className="flex flex-row justify-between">
              <button className="flex flex-row items-center text-xl">
                <ArrowLeftCircle className="inline" />
                <span className="ml-2" onClick={handleBack}>
                  Back
                </span>
              </button>
              <div className="flex flex-row space-x-4">
                <Tooltip content="Copy the text">
                  <button className="button" onClick={clipboard.copy}>
                    {clipboard.copied ? "Copied !" : "Copy"}
                  </button>
                </Tooltip>
                <Tooltip content="Export ">
                  <button className="button" onClick={handleExport}>
                    File
                  </button>
                </Tooltip>
                <Tooltip content="Buy me a coffee">
                  <a
                    href="https://www.buymeacoffee.com/stonegate"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Donate
                  </a>
                </Tooltip>
              </div>
            </div>
            <span className="text-bold leading-loose" ref={clipboard.target}>
              {result}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
