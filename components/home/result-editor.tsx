import { ArrowLeftCircle } from "lucide-react";
import Tooltip from "../shared/tooltip";
import { useClipboard } from "use-clipboard-copy";
import { saveAs } from "file-saver";
import { useMemo, useState } from "react";
import { formatTranscription } from "utils";
import TextareaAutosize from "react-textarea-autosize";

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
  const clipboard = useClipboard({
    copiedTimeout: 2000, // timeout duration in milliseconds
  });
  const handleExport = () => {
    const text = content;
    const blob = new Blob([text], {
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

  return (
    <>
      <div className="mt-16 mb-8 flex flex-row justify-between dark:text-white">
        <button className="flex flex-row items-center text-xl">
          <ArrowLeftCircle className="inline" />
          <span className="ml-2" onClick={onBack}>
            Transcription
          </span>
        </button>
        <div className="flex flex-row">
          <Tooltip content="Copy the text">
            <button
              className="button px-2"
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
      <div className="whitespace-pre-wrap">
        <TextareaAutosize
          name="prompt"
          className="textarea text-lg"
          placeholder="Something about your audio, like language or keywords"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          autoFocus
        />
      </div>
      {/* <EditorContent editor={editor} /> */}
    </>
  );
};

export default ResultEditor;
