import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prismaMongo } from "../../../lib/prisma";

const secret = process.env.SECRET;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req, secret });
  const userId = token?.sub;
  if (!userId) {
    res.status(404).end("User not found");
  }
  const { id: taskId } = req.query as { id: string };
  const subtitles = await prismaMongo.subtitle.findMany({
    where: { task_id: taskId },
    orderBy: { id: "asc" },
  });
  const document = await prismaMongo.summary.findFirst({
    where: { task_id: taskId },
  });
  res.status(200).json({ data: { subtitles, summary: document?.summary, recos: document?.recos } });
}
