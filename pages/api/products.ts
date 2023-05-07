import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { LemonsqueezyClient } from "lemonsqueezy.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const token = await getToken({ req, secret: process.env.SECRET });
    if (!token) {
      res.status(200).json({ products: [] });
    }
    try {
      const client = new LemonsqueezyClient(process.env.LEMON_API_KEY!);
      const products = await client.listAllProducts({
        storeId: "25044",
      });
      console.log(products);
      res.status(200).json({ products: products.data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
}
