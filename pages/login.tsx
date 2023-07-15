import Layout from "@/components/layout";
import { Meta } from "types";
import { getProviders, signIn } from "next-auth/react";
import GoogleIcon from "../components/shared/icons/google-icon";
import Github from "../components/shared/icons/github";
import { useRef, useState } from "react";
import { getToken } from "next-auth/jwt";
import { redirect } from "next/navigation";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  const token = await getToken({ req: context.req, raw: true });
  return {
    props: {
      providers,
      token,
    },
  };
}

export default function Login({
  providers,
  token,
}: {
  providers: any;
  token: any;
}) {
  if (token) redirect("/");
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "https://recos.studio",
    title: "Recos.",
  };
  const formRef = useRef<HTMLFormElement>(null)

  const loginWithOauth = async (provider: string) => {
    if (provider == "email") {
    } else {
      const id = providers[provider].id;
      signIn(id);
    }
  };

  const loginWithEmail = async (e: any) => {
      e.preventDefault()
      if(!formRef?.current?.checkValidity()) {
        return
      }
      try {
        await signIn("email", { email, redirect: false });
        setEmailSent(true);
      } catch (error) {}
  }

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  return (
    <Layout meta={meta} providers={providers} products={[]}>
      <div className="mx-auto mt-32 overflow-hidden bg-white px-8 md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-sm">
        {emailSent ? (
          <>
            <div className="pt-8 text-center text-2xl font-bold">
              Check your email
            </div>
            <div className="pt-8 text-center text-xl">
              A sign in link has been sent to your email address.
            </div>
            <div
              onClick={() => setEmailSent(false)}
              className="cursor-pointer py-8 text-center text-green-600"
            >
              Back
            </div>
          </>
        ) : (
          <>
            <div className="pt-8 text-center text-2xl font-bold">
              Login to Recos.
            </div>
            <div className="my-4 flex flex-col items-center">
              <div className="mb-2 w-full text-left font-semibold">Email</div>
              <form ref={formRef} onSubmit={loginWithEmail} className="block w-full">
              <input
                className="input block
            p-2
            hover:file:bg-green-300 hover:file:text-gray-700
            dark:file:bg-green-400
            "
                aria-describedby="email"
                placeholder="Please enter email"
                id="email"
                value={email}
                required
                type="email"
                onChange={(e) => {setEmail(e.target.value)}}
              />

              <button
                type="submit"
                // onClick={() => loginWithOauth("email")}
                className="dark:focus:ring-green-300/55 mt-4 mb-2 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-600/90 focus:outline-none focus:ring-4 focus:ring-green-600/50"
              >
                Sign in/ Sign up with Email
              </button>
              </form>
            </div>
            <div className="relative h-[1.5px] w-full bg-green-400 after:absolute after:left-[50%] after:bottom-[-10px] after:w-8 after:translate-x-[-50%] after:bg-white after:text-center after:text-black/60 after:content-['or']"></div>
            <div className="flex flex-col items-center space-y-3 py-8">
              <button
                type="button"
                onClick={() => loginWithOauth("google")}
                className="dark:focus:ring-[#4285F4]/55 mb-2 inline-flex w-full items-center justify-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
              <button
                type="button"
                onClick={() => loginWithOauth("github")}
                className="mb-2 inline-flex w-full items-center justify-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#050708]/95 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
              >
                <Github />
                Sign in with GitHub
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
