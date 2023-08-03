import Layout from "@/components/layout";
import Button from "@/components/shared/button";
import { ofetch } from "ofetch";
import { ArrowRight } from 'lucide-react'
import { Meta } from "types";
export { getServerSideProps } from "lib/server-side-props";

export default function Home({
  providers,
  products,
}: {
  providers: any;
  products: any[];
}) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Price",
  };
  
  const getCredits = async (productId: string) => {
    const checkoutData = await ofetch("/api/checkout", {
      query: { productId },
    });
    const checkoutUrl = checkoutData.link;
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
  };


  return (
    <Layout meta={meta} providers={providers} products={products}>
      <div className="flex flex-col items-center">
        <h1 className="text-green-600 text-6xl font-bold mt-20">Transparent and affordable price</h1>
        <h1 className="text-4xl mt-10 dark:text-white">One credit for one minute audio</h1>
        <div className="flex flex-row items-center mt-24 justify-start space-x-10">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="flex h-[400px] w-[400px] flex-col items-center border-2 border-green-700 justify-between rounded-lg bg-green-200 dark:bg-green-900 p-8"
              >
                <div className="flex flex-col dark:text-white">
                  <span className="text-4xl font-bold">
                    {product.attributes.name}
                  </span>
                  <span className="text-2xl mt-10">
                    {product.attributes.description
                      .replace("<p>", "")
                      .replace("</p>", "")}
                  </span>
                </div>
                <div className="w-full flex flex-row justify-between items-center dark:text-white">
                  <span className="text-4xl font-mono">
                    {product.attributes.price_formatted}
                  </span>
                <Button
                  type="button"
                  onClick={() => getCredits(product.id)}
                  className="h-16 w-full flex-row justify-center text-lg font-normal rounded-md"
                >
                  <span className="text-2xl">
                    Checkout
                  </span>
                  <ArrowRight className="inline ml-4" />
                </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}
