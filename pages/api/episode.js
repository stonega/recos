import { Client } from "podcast-api";

const apiKey = process.env.LISTENNOTE_API_KEY;
const client = Client({ apiKey });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search } = req.query;
    try {
      const response = await client.search({
        q: search,
        sort_by_date: 0,
        type: "episode",
        offset: 0,
        len_min: 10,
        len_max: 90,
        published_after: 0,
        only_in: "title,description",
        language: "English",
        safe_mode: 0,
        unique_podcasts: 0,
      });
      console.log(response.data);
      res.status(200).json({ data: response.data });
    } catch (e) {
      //TODO handle the exception
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
