import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../../lib/prisma";

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
  const record = await prisma?.credit.findFirst({ where: { id: taskId } });
  res.status(200).json({ data: record });
}
