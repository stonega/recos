import { ArrowLeftCircle } from "lucide-react";
import Tooltip from "../shared/tooltip";
import { useClipboard } from "use-clipboard-copy";
import { saveAs } from "file-saver";
import PDFExportButton from "./pdf-export-button";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { formatTranscription } from "utils";

interface EditorProps {
  title: string;
  text: string;
  cover?: string;
  onBack(): void;
}

const ResultEditor = ({ text, title, onBack }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setJson(json);
    },
    onCreate: ({ editor }) => {
      const json = editor.getJSON();
      setJson(json);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl w-full focus:outline-none dark:prose-invert",
      },
    },
  });
  const [json, setJson] = useState<JSONContent>({ content: [] });
  const clipboard = useClipboard({
    copiedTimeout: 2000, // timeout duration in milliseconds
  });
  const handleExport = () => {
    const html = editor?.getText() ?? "";
    const blob = new Blob([JSON.stringify(html)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${title ?? "transcript"}.txt`);
  };

  async function format() {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey) {
      return;
    }
    const result = await formatTranscription(text, apiKey);
    editor?.commands.setContent(result);
  }

  return (
    <>
      <div>
        <div className="mb-8 flex flex-row justify-between dark:text-white">
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
                onClick={() => clipboard.copy(editor?.getText())}
              >
                {clipboard.copied ? "Copied !" : "COPY"}
              </button>
            </Tooltip>
            <Tooltip content="Export pure text">
              <button className="button px-2" onClick={handleExport}>
                TXT
              </button>
            </Tooltip>
            <Tooltip content="Export PDF">
              <PDFExportButton json={json} name={title}></PDFExportButton>
            </Tooltip>
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
        <div className="my-10">
          <span
            className="cursor-pointer rounded-full bg-green-400 p-2 px-6"
            onClick={format}
          >
            ✨ Let ChatGPT format the transcription
          </span>
        </div>

        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default ResultEditor;
