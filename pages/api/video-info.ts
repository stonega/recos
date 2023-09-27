import { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from "ofetch";
import { parseYoutubeDuration } from "utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { platform, link } = req.query;
    if (platform === "youtube") {
      try {
        const id = new URL(link as string).searchParams.get("v");
        const response = await ofetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${process.env.YOUTUBE_API_KEY}`,
        );
        if (response.items.length === 0) {
          res.status(404).json({ data: "not found" });
        }
        const duration = response.items[0].contentDetails.duration;
        const title = response.items[0].snippet.title;
        const description = response.items[0].snippet.description;
        res.status(200).json({
          title,
          length: parseYoutubeDuration(duration),
          description,
        });
      } catch (e) {
        console.log(e);
        res.status(500).json({ data: "internal server error" });
      }
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
