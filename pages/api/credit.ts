import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";

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
  const user = await prisma?.user.findFirst({ where: { id: userId } });
  const used = await prisma?.credit.aggregate({ where: { userId }, _sum: { credit: true } })
  res.status(200).json({ credit: user?.credit, used: used?._sum?.credit || 0 });
}
