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
    const response = await openai.createEmbedding({
      input: "Get book names from the text: " + input,
      model: "text-embedding-ada-002",
    });
    res.status(200).json({ data: JSON.stringify(response) });
  } else {
    res.status(500).json({ data: "error" });
  }
}
