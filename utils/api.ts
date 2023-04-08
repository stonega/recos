import { ofetch } from "ofetch";
const OPENAI_API_URL = "https://api.openai.com/v1";

const openAiFetch = ofetch.create({
  baseURL: OPENAI_API_URL,
  headers: {
    Accept: "application/json",
  },
});

export async function transcript(file: File, apiKey: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('model', 'whisper-1')
  const  result = await openAiFetch('/audio/transcriptions', {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${apiKey}`,
      },
      body: formData
  })
  if(result.error) throw new Error(result.error.message)
  return result.text
}
