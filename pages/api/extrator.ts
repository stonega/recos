import type { NextApiRequest, NextApiResponse } from "next";
import { extract } from "@extractus/article-extractor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { link } = JSON.parse(req.body);
    try {
      const article = await extract(link);
      console.log(article);
      res.status(200).json(article);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
