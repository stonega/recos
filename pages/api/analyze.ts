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
    const { data } = req.body;
    const response = await openai.createEmbedding({
      input: 'Get book names from the text\n' + data,
      model: "text-embedding-ada-002",
    });
    res.status(200).json({ data: JSON.stringify(response) });
  } else {
    // Handle any other HTTP method
  }
}
