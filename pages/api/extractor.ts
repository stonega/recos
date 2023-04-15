import type { NextApiRequest, NextApiResponse } from "next";
import { extract } from "@extractus/article-extractor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { link } = req.query;
    if (!link) {
      res.status(500).json({ error: "No link found" });
    }
    try {
      const article = await extract(link as string);
      const regExp = /<[^>]*>/g;
      if (article) article.content = article.content?.replace(regExp, "");
      res.status(200).json(article);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
