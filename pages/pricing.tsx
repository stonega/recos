import Layout from "@/components/layout";
import { ofetch } from "ofetch";
import { ArrowRight } from "lucide-react";
import { Meta } from "types";
import { ListIcon } from "@/components/shared/icons/list-icon";
import { getToken } from "next-auth/jwt";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context: any) {
  async function getProducts() {
    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/products?filter[store_id]=25044",
      {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      },
    );
    const products = await response.json();
    return products.data;
  }
  const products = await getProducts();
  const secret = process.env.SECRET;
  const token = await getToken({ req: context.req, secret });
  const userId = token?.sub as unknown as string;
  let user;
  if (userId) user = await prisma?.user.findFirst({ where: { id: userId } });

  return {
    props: {
      products,
      ...(await serverSideTranslations(user?.lang ?? "en", [
        "pricing",
        "common",
      ])),
    },
  };
}

export default function PricingPage({ products }: { products: any[] }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.studio",
    title: "Pricing",
  };
  const { t } = useTranslation("pricing");

  const getCredits = async (productId: string) => {
    const checkoutData = await ofetch("/api/checkout", {
      query: { productId },
    });
    const checkoutUrl = checkoutData.link;
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
  };

  return (
    <Layout meta={meta}>
      <div className="flex flex-col items-center">
        <h1 className="mt-16 bg-gradient-to-r from-green-600 to-[#9D4DFF] bg-clip-text text-center text-4xl font-bold leading-[3rem] text-transparent md:text-6xl">
          {t("title")}
        </h1>
        <h1 className="mt-6 text-center text-3xl dark:text-white">
          {t("description")}
        </h1>
        <div className="mt-24 flex flex-col items-center justify-start space-y-10 md:flex-row md:space-x-6 md:space-y-0">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="flex h-[400px] w-full flex-col items-start justify-between rounded-lg bg-green-400 p-8 shadow-md dark:bg-green-900 md:w-[350px]"
              >
                <div className="flex flex-col dark:text-white">
                  <div className="w-auto rounded-full text-2xl font-bold text-[#0f763d] dark:text-[#88f58d]">
                    {product.attributes.name}
                  </div>
                  <span className="my-4 font-mono text-4xl slashed-zero">
                    {product.attributes.price_formatted}
                  </span>
                  <ul className="mt-2 list-inside space-y-2 text-xl">
                    <li className="flex items-center">
                      <ListIcon />
                      {product.attributes.description
                        .replace("<p>", "")
                        .replace("</p>", "")}
                    </li>
                    <li className="flex items-center">
                      <ListIcon />
                      Translate transcription
                    </li>
                    <li className="flex items-start">
                      <ListIcon />
                      Get summary
                    </li>
                    <li className="flex items-center">
                      <ListIcon />
                      Export srt file
                    </li>
                  </ul>
                </div>
                <div className="flex w-full flex-row items-center justify-between dark:text-white">
                  <div
                    className="group cursor-pointer flex-row rounded-md text-lg font-normal"
                    onClick={() => getCredits(product.id)}
                  >
                    <span className="text-2xl font-bold">Checkout</span>
                    <ArrowRight className="ml-4 inline -translate-y-1 group-hover:animate-bounce" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}
