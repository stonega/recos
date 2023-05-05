import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { LemonsqueezyClient } from "lemonsqueezy.ts";
import { ofetch } from "ofetch";

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
      console.log(stores, variants);
      const data = {
        data: {
          type: "checkouts",
          attributes: {
            custom_price: 50000,
            product_options: {
              enabled_variants: [69863],
            },
            checkout_options: {
              button_color: "#2DD272",
            },
            checkout_data: {
              custom: {
                user_id: userId,
              },
            },
            expires_at: now.toLocaleString(),
            preview: true,
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: "25043",
              },
            },
            variant: {
              data: {
                type: "variants",
                id: "69863",
              },
            },
          },
        },
      };
      const newCheckout = await ofetch(
        "https://api.lemonsqueezy.com/v1/checkouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
          },
          body: data,
        },
      );
      res.status(200).json({ link: newCheckout.data.attributes.url});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
}
