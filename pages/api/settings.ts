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
  if (req.method === "POST") {
    const { lang } = req.body;
    await prisma?.user.update({
      where: { id: userId },
      data: { lang },
    });
  } else {
    const user = await prisma?.user.findFirst({ where: { id: userId } });
    res.status(200).json({ lang: user?.lang });
  }
}
