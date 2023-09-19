import { getToken } from "next-auth/jwt";
import { getProviders } from "next-auth/react";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
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
    // @ts-ignore
    return { products: products.data };
  }
  const [token, { products }] = await Promise.all([
    getToken({ req: context.req, raw: true }),
    getProducts(),
  ]);
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      providers,
      token,
      products,
    },
  };
}
