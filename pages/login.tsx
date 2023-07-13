
import Layout from "@/components/layout";
import { Meta } from "types";
import { signIn } from "next-auth/react";
import GoogleIcon from "../components/shared/icons/google-icon";
import Github from "../components/shared/icons/github";
import { useState } from "react";

export { getServerSideProps } from "lib/server-side-props";

export default function Home({
  providers,
  products,
}: {
  providers: any;
  products: any[];
  token: string;
}) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "https://recos.studio",
    title: "Recos.",
  };

  const loginWithOauth = async (provider: string) => {
    const id = providers[provider].id;
    signIn(id);
  };

  const [email, setEmail] = useState("")

  return (
    <Layout meta={meta} providers={providers} products={products}>
      <div className="mx-auto mt-32 px-8 overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-sm">
        <div className="pt-8 text-center text-2xl font-bold">
          Login to Recos.
        </div>
        <div className="my-4 flex flex-col items-center">
        <div className="text-left w-full mb-2 font-semibold">Email</div>
        <input
          className="input block cursor-pointer 
            p-2
            hover:file:bg-green-300 hover:file:text-gray-700
            dark:file:bg-green-400
            "
          aria-describedby="file_input_help"
          placeholder="Please enter email"
          id="file_input"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
          <button
            type="button"
            onClick={() => loginWithOauth("email")}
            className="mt-4 dark:focus:ring-green-300/55 mb-2 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-600/90 focus:outline-none focus:ring-4 focus:ring-green-600/50"
          >
            Sign in/ Sign up with Email
          </button>
        </div>
        <div className="h-[1.5px] relative w-full bg-green-400 after:content-['or'] after:text-black/60 after:bg-white after:text-center after:w-8 after:absolute after:left-[50%] after:bottom-[-10px] after:translate-x-[-50%]"></div>
        <div className="flex flex-col items-center space-y-3 py-8">
          <button
            type="button"
            onClick={() => loginWithOauth("google")}
            className="dark:focus:ring-[#4285F4]/55 mb-2 inline-flex w-full justify-center items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => loginWithOauth("github")}
            className="mb-2 inline-flex w-full justify-center items-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#050708]/95 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
          >
            <Github />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </Layout>
  );
}
