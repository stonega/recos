import { ArrowLeftCircle, Divide } from "lucide-react";
import Tooltip from "../shared/tooltip";
import { useClipboard } from "use-clipboard-copy";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { changeSrtInterval, formatTranscription } from "utils";
import * as Switch from "@radix-ui/react-switch";

interface EditorProps {
  title: string;
  text: string;
  cover?: string;
  srt?: boolean;
  onBack(): void;
}

const ResultEditor = ({ text, title, srt, onBack }: EditorProps) => {
  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: testText,
  //   onUpdate: ({ editor }) => {
  //     const json = editor.getJSON();
  //     setJson(json);
  //   },
  //   onCreate: ({ editor }) => {
  //     const json = editor.getJSON();
  //     setJson(json);
  //   },
  //   editorProps: {
  //     attributes: {
  //       class:
  //         "prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full whitespace-pre-wrap focus:outline-none dark:prose-invert",
  //     },
  //   },
  // });
  // const [json, setJson] = useState<JSONContent>({ content: [] });
  const [content, setContent] = useState(text);
  const [compact, setCompact] = useState(false);

  const clipboard = useClipboard({
    copiedTimeout: 2000, // timeout duration in milliseconds
  });
  const handleExport = () => {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${title}.${srt ? "srt" : "txt"}`);
  };

  async function format() {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey) {
      return;
    }
    const result = await formatTranscription(text, apiKey);
    setContent(result);
  }

  useEffect(() => {
    if (srt && compact) {
      const newContent = changeSrtInterval(text, 30);
      setContent(newContent);
    } else {
      setContent(text);
    }
  }, [compact, srt, text]);

  return (
    <>
      <div className="mt-16 mb-8 flex flex-row justify-between dark:text-white">
        <button className="flex flex-row items-center text-xl" onClick={onBack}>
          <ArrowLeftCircle className="inline" />
          <span className="ml-2" onClick={onBack}>
            Transcription
          </span>
        </button>
        <div className="flex flex-row">
          <Tooltip content="Copy the text">
            <button
              className="button px-2"
              style={{ opacity: clipboard.copied ? "0.6" : "1" }}
              onClick={() => clipboard.copy(content)}
            >
              {clipboard.copied ? "Copied !" : "COPY"}
            </button>
          </Tooltip>
          <Tooltip content="Export pure text">
            <button className="button px-2" onClick={handleExport}>
              {srt ? "SRT" : "TXT"}
            </button>
          </Tooltip>
          {/* <Tooltip content="Export PDF">
            <PDFExportButton json={json} name={title}></PDFExportButton>
          </Tooltip> */}
          <Tooltip content="Buy me a coffee">
            <a
              href="https://www.buymeacoffee.com/stonegate"
              target="_blank"
              rel="noreferrer"
              className="px-2"
            >
              DONATE ❤️
            </a>
          </Tooltip>
        </div>
      </div>
      {/* <div className="my-10">
          <span
            className="cursor-pointer rounded-full bg-green-400 p-2 px-6"
            onClick={format}
          >
            ✨ Let ChatGPT format the transcription
          </span>
        </div> */}
      <div className="relative whitespace-pre-wrap">
        <span className="dark:text-white">{content}</span>
        {srt && (
          <div className="absolute right-4 top-2 flex flex-row">
            <label htmlFor="srt" className="mr-2 text-lg">
              Compact
            </label>
            <Switch.Root
              className="relative h-6 w-[42px] cursor-default rounded-full bg-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-green-700"
              id="srt"
              checked={compact}
              onCheckedChange={(value) => {
                setCompact(value);
                if (value) {
                }
              }}
            >
              <Switch.Thumb className="shadow-blackA7 block h-[18px] w-[18px] translate-x-0.5 rounded-full bg-white  transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>
        )}
        {/* <TextareaAutosize
          name="prompt"
          className="textarea text-lg"
          placeholder="Something about your audio, like language or keywords"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          autoFocus
        /> */}
      </div>
      {/* <EditorContent editor={editor} /> */}
    </>
  );
};

export default ResultEditor;
