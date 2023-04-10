import { useCallback, useEffect, useState } from "react";
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
import InfoCard from "../shared/info-card";

interface ResultProps {
  input: AudioInput;
}

type Step = "input" | "downloading" | "loading" | "result";

const Result = ({ input }: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number>(input.duration);
  const { setShowApiModal, ApiModal } = useApiModal();
  const [result, setResult] = useState("");

  const getAudioDuration = useCallback(() => {
    if (typeof input.input === "string") {
      setDuration(input.duration)
      return;
    }
    getDuration(input.input).then((result) => setDuration(result));
  }, [input.duration, input.input]);

  useEffect(() => {
    if (input.input) setStep("input");
    getAudioDuration()
  }, [getAudioDuration, input.input]);

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
        audioFiles.map( (file) => {
         transcript(file as File, input.prompt ?? '', apiKey);
        }),
      );
      setStep("result");
      setResult(results.join(" "));
    } catch (error) {
      setStep("input");
      if (error instanceof Error) toast.error(error.message);
    }
  }, [input.input, input.prompt, setShowApiModal]);
  return (
    <>
      <div className="border-1 mt-6 min-h-[20rem] w-full rounded-md border border-green-400 bg-white/40">
        {step === "input" && (
          <div className="flex h-60 flex-col items-center justify-start gap-2 p-2">
            <ApiModal />
            <div className="w-full grid grid-cols-3 gap-2">
              <InfoCard title="🎧" value={formatDuration(duration)} prefix=""></InfoCard>
              <InfoCard title="💰" value={getFee(duration)} prefix="$"></InfoCard>
              <InfoCard title="⌛" value={getTime(duration)} prefix=""></InfoCard>
            </div>
            <Button className="mt-8" onClick={submit}>
              Generate Transcript
            </Button>
          </div>
        )}
        {step === "loading" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <span>Transcribing audios...</span>
          </div>
        )}
        {step === "downloading" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <span>Downloading audios...</span>
          </div>
        )}
        {step === "result" && (
          <div className="p-4">
            <span className="text-bold">{result}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
