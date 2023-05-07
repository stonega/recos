import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { LemonsqueezyClient } from "lemonsqueezy.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const token = await getToken({ req, secret: process.env.SECRET });
    const userId = token?.sub;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const client = new LemonsqueezyClient(process.env.LEMON_API_KEY!);
      const [stores, variants] = await Promise.all([
        client.listAllStores({}),
        client.listAllVariants({}),
      ]);
      const data = {
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              enabled_variants: [variants.data.at(0)?.id],
            },
            checkout_options: {
              button_color: "#22c55e",
            },
            checkout_data: {
              custom: {
                user_id: userId,
              },
            },
            expires_at: now.toISOString(),
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: stores.data.at(1)?.id,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variants.data.at(0)?.id,
              },
            },
          },
        },
      };
      const response = await fetch(
        "https://api.lemonsqueezy.com/v1/checkouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
          },
          body: JSON.stringify(data),
        },
      );
      const newCheckout = await response.json()
      res.status(200).json({ link: newCheckout.data.attributes.url});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
}
