import { ofetch } from "ofetch";
import { TranscriptOption } from "types";
const OPENAI_API_URL = "https://api.openai.com/v1";

const openAiFetch = ofetch.create({
  baseURL: OPENAI_API_URL,
  headers: {
    Accept: "application/json",
  },
});

export async function transcript(
  file: File,
  option: TranscriptOption,
  apiKey: string,
) {
  const formData = new FormData();
  const url = option.translate
    ? "/audio/translations"
    : "/audio/transcriptions";
  const format = option.srt ? "srt" : "json";
  formData.append("file", file);
  formData.append("model", "whisper-1");
  formData.append("response_format", format);
  if (!option.translate) formData.append("prompt", option.prompt);
  const result = await openAiFetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });
  if (result.error) throw new Error(result.error.message);
  if (option.srt) return result;
  return result.text;
}

export async function formatTranscription(text: string, apiKey: string) {
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Typesetting follow text, add punctuation marks if not exist, return result with html: {"${text}"}`,
      },
    ],
    temperature: 0.2,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.0,
    // stream: true
  };
  const result = await openAiFetch("/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: data,
  });
  if (result.error) throw new Error(result.error.message);
  return result.choices[0].message.content;
}
