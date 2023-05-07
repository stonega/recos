import { useEffect, useState } from "react";
import { AudioInput } from "types";

interface SearchAudioProps {
  onResult: (result: AudioInput) => void;
}
export const SearchAudio = ({ onResult }: SearchAudioProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.name &&
        !file.name.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/)
      ) {
        setMsg("Wrong audio format");
      } else {
        onResult({ title: file.name, input: file, duration: 0 });
      }
    }
  }, [files]);
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col">
        <input
          className="input block cursor-pointer 
            p-0
            file:mr-5
            file:border-0
            file:bg-green-200 file:py-4
            file:px-6
            file:text-gray-700 hover:file:cursor-pointer
            hover:file:bg-green-300 hover:file:text-gray-700
            dark:file:bg-green-400
            "
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          onChange={(e) => setFiles(e.target.files)}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          Following input file types are supported: mp3, mp4, mpeg, mpga, m4a,
          wav, and webm.
        </p>
      </div>
      {msg && <div className="text-red-600">{msg}</div>}
    </div>
  );
};
