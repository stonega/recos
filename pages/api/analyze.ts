import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-0X0HpVK7VBKcdfxshYHYcNNA",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { data } = JSON.parse(req.body);
    const input = data.replace("\n", " ");
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "return book names from the text: " + input,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({ data: response.data });
  } else {
    res.status(500).json({ data: "error" });
  }
}
