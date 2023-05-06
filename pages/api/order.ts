import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import bodyParser from 'body-parser'

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: Object) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
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
    console.log(req.body);
    await runMiddleware(req, res, bodyParser.raw({ type: 'application/json' }))
    const secret = process.env.LEMON_SECRET;
    const hmac = crypto.createHmac("sha256", secret!);
    const digest = Buffer.from(hmac.update(req.body).digest("hex"), "utf8");
    const signature = Buffer.from(
      (req.headers["X-Signature"] as string) || "",
      "utf8",
    );
    if (!crypto.timingSafeEqual(digest, signature)) {
      res.status(500).json({ error: "Invalid signature" });
    }
    await runMiddleware(req, res, bodyParser.json())
    const userId = req.body["meta"]["custom_data"]["user_id"];
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
