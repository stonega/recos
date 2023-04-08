import { useCallback, useEffect, useState } from "react";
import Button from "../shared/button";
import { formatDuration, getDuration, getFee, getTime, transcript } from "utils";
import { useApiModal } from "./api-modal";
import { toast} from 'sonner';

interface ResultProps {
  input: File | string;
}

type Step = "input" | "loading" | "result";

const Result = (props: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [duration, setDuration] = useState<number>(0);
  const { setShowApiModal, ApiModal } = useApiModal();
  const [result, setResult] = useState("");

  useEffect(() => {
    if(props.input) setStep('input')
  }, [props.input])

  const getAudioDuration = () => {
    if (typeof props.input === "string") return;
    getDuration(props.input).then((result) => setDuration(result));
  };
  getAudioDuration();

  const submit = useCallback(async () => {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }
    setStep("loading");
    try {
      const result = await transcript(props.input as File, apiKey);
      setStep("result");
      setResult(result);
    } catch (error) {
        setStep("input")
      if (error instanceof Error) toast.error(error.message);
    }
  }, [props.input, setShowApiModal]);
  return (
    <>
      <div className="border-1 mt-4 min-h-[20rem] w-full rounded-md border border-green-400 bg-white/40">
        {step === "input" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <ApiModal />
            <span>Audio duration: {formatDuration(duration)} </span>
            <span>Estimated openai API fee: ~${getFee(duration)} </span>
            <span>Estimated generate time: ~{getTime(duration)} </span>
            <Button className="mt-4" onClick={submit}>
              Transcript
            </Button>
          </div>
        )}
        {step === "loading" && (
          <div className="flex h-60 flex-col items-center justify-center gap-2">
            <span>Transcribing...</span>
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
