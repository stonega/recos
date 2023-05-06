import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { buffer, json } from "micro";
import prisma from "../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const secret = process.env.LEMON_SECRET;
    const hmac = crypto.createHmac("sha256", secret!);
    const rawBody = await buffer(req);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(
      (req.headers["x-signature"] as string) || "",
      "utf8",
    );
    if (!crypto.timingSafeEqual(digest, signature)) {
      res.status(500).json({ error: "Invalid signature" });
    }
    const body = await json(req)
    const userId = (body as any)["meta"]["custom_data"]["user_id"];
    const credit = 10;
    const user = await prisma?.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    prisma?.user.update({
      where: {
        id: userId,
      },
      data: {
        credit: user!.credit + credit,
      },
    });
    res.status(200).json({ success: true });
  }
}
