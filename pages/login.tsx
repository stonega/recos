import Layout from "@/components/layout";
import { Meta } from "types";
import { getProviders, signIn } from "next-auth/react";
import GoogleIcon from "../components/shared/icons/google-icon";
import Github from "../components/shared/icons/github";
import { useRef, useState } from "react";
import { getToken } from "next-auth/jwt";
import LoadingCircle from "@/components/shared/icons/loading-circle";
import Link from "next/link";
import { getTranslationProps } from "@/lib/server-side-props";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  const token = await getToken({ req: context.req, raw: true });
  if (token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      providers,
      ...(await getTranslationProps(context, "login")),
    },
  };
}

export default function Login({ providers }: { providers: any }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "https://recos.studio",
    title: "Recos.",
  };
  const formRef = useRef<HTMLFormElement>(null);

  const loginWithOauth = async (provider: string) => {
    if (provider == "email") {
    } else {
      const id = providers[provider].id;
      signIn(id);
    }
  };
  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loginWithEmail = async (e: any) => {
    e.preventDefault();
    if (!formRef?.current?.checkValidity()) {
      return;
    }
    try {
      setIsSending(true);
      const email = formRef.current.email.value;
      await signIn("email", { email, redirect: false });
      setEmailSent(true);
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
    }
  };

  return (
    <Layout meta={meta}>
      <div className="mx-auto mt-32 max-w-md overflow-hidden rounded-2xl bg-white px-8 dark:bg-[#2a2a2a] md:shadow-sm">
        {emailSent ? (
          <>
            <div className="pt-8 text-center text-2xl font-bold dark:text-white">
              Check your email
            </div>
            <div className="pt-8 text-center text-xl dark:text-white">
              A magic link has been sent to your email address.
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
            <div className="pt-8 text-center text-2xl font-bold dark:text-white">
              Login to Recos.
            </div>
            <div className="my-4 flex flex-col items-center">
              <div className="mb-2 w-full text-left font-semibold dark:text-white">
                Email
              </div>
              <form
                ref={formRef}
                onSubmit={loginWithEmail}
                className="block w-full"
              >
                <input
                  className="input block
            p-2
            hover:file:bg-green-300 hover:file:text-gray-700
            dark:file:bg-green-400
            "
                  aria-describedby="email"
                  placeholder="Please enter email"
                  id="email"
                  required
                  type="email"
                />

                <button
                  type="submit"
                  // onClick={() => loginWithOauth("email")}
                  className="dark:focus:ring-green-300/55 mb-2 mt-4 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-600/90 focus:outline-none focus:ring-4 focus:ring-green-600/50"
                >
                  Send magic link
                  {isSending && (
                    <span className="ml-2">
                      <LoadingCircle />
                    </span>
                  )}
                </button>
              </form>
            </div>
            <div className="relative h-[1.5px] w-full bg-green-400 after:absolute after:bottom-[-10px] after:left-[50%] after:w-8 after:translate-x-[-50%] after:bg-white after:text-center after:text-black/60 after:content-['or'] dark:after:bg-[#2a2a2a] dark:after:text-white"></div>
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
      <div className="mt-4 text-center dark:text-white">
        By proceeding, you agree to our <br />
        <Link
          href="/terms"
          className="mb-4 text-gray-500 underline decoration-solid"
        >
          terms of use
        </Link>{" "}
        and{" "}
        <Link
          className="mb-4 text-gray-500 underline decoration-solid"
          href="/privacy"
        >
          privacy policy
        </Link>
      </div>
    </Layout>
  );
}
