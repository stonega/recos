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
  const query = req.query;
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.page_size ?? 20);
  const status = query.status as string | undefined;
  const skip = (page - 1) * pageSize;
  const where: any = {
    userId: { equals: userId },
  };
  if (status) {
    where.AND = {
      status: {
        equals: status,
      },
    };
  }
  const data = await prisma.credit.findMany({
    skip,
    take: pageSize,
    where,
    orderBy: {
      create_at: "desc",
    },
  });
  res.status(200).json({ data });
}
