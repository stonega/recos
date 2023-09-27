import Layout from "@/components/layout";
import { Meta } from "types";
import WhatIsRecos from "@/components/home/what-is-recos";
import Features from "@/components/home/features";
import Button from "@/components/shared/button";
import { useRouter } from "next/router";
import Inscriptions from "@/components/home/inscriptions";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getToken } from "next-auth/jwt";
import { prisma } from "../lib/prisma";

export async function getServerSideProps(context: any) {
  const secret = process.env.SECRET;
  const token = await getToken({ req: context.req, secret });
  const userId = token?.sub as unknown as string;
  let user;
  if (userId) user = await prisma?.user.findFirst({ where: { id: userId } });
  return {
    props: {
      ...(await serverSideTranslations(user?.lang ?? "en", ["homepage", "common"])),
    },
  };
}

export default function Home() {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "https://recos.studio",
    title: "Recos.",
  };
  const router = useRouter();
  const { t } = useTranslation("homepage");

  return (
    <Layout meta={meta}>
      <div className="mb-0 md:mb-20"></div>
      <div className="flex flex-col md:grid md:grid-cols-2">
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-10 md:mb-20 text-center text-4xl font-bold leading-[3rem] text-green-600 md:text-left">
            {t("slogan")}
          </div>
          <Button
            className="mb-20 border-2 border-green-400 py-4 text-2xl font-bold md:mb-0"
            onClick={() => router.push("/dashboard")}
            outlined={true}
          >
            {t("start-button")}
          </Button>
        </div>
        <Inscriptions />
      </div>
      <Features />
      <WhatIsRecos />
    </Layout>
  );
}
