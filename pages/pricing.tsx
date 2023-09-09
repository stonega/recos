import Layout from "@/components/layout";
import { ofetch } from "ofetch";
import { ArrowRight } from "lucide-react";
import { Meta } from "types";

export async function getServerSideProps() {
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

  return {
    props: {
      products,
    },
  };
}

export default function PricingPage({ products }: { products: any[] }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Pricing",
  };

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
          Transparent and affordable price
        </h1>
        <h1 className="mt-6 text-center text-3xl dark:text-white">
          One credit for one minute audio, free for first 20 minutes
        </h1>
        <div className="mt-24 flex flex-col items-center justify-start space-y-10 md:flex-row md:space-x-10 md:space-y-0">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="flex h-[400px] w-full flex-col items-start justify-between rounded-lg bg-green-400 p-8 shadow-md dark:bg-green-900 md:w-[350px]"
              >
                <div className="flex flex-col dark:text-white">
                  <span className="text-4xl font-bold">
                    {product.attributes.name}
                  </span>
                  <span className="text-xl">
                    {product.attributes.description
                      .replace("<p>", "")
                      .replace("</p>", "")}
                  </span>
                  <ul className="mt-6 list-disc list-inside">
                    <li>Translate transcription</li>
                    <li>Summary transcription</li>
                  </ul>
                </div>
                <div className="flex w-full flex-row items-center justify-between dark:text-white">
                  <span className="font-mono text-4xl slashed-zero">
                    {product.attributes.price_formatted}
                  </span>
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
