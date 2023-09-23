import Layout from "@/components/layout";
import { Meta } from "types";
import { getToken } from "next-auth/jwt";
import { ofetch } from "ofetch";
import { useCallback, useState } from "react";
import { useAsyncEffect } from "ahooks";
import Selector from "@/components/shared/selector";
import { useTranslation } from "next-i18next";
import { prisma } from "../lib/prisma";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export async function getServerSideProps(context: any) {
  const secret = process.env.SECRET;
  const token = await getToken({ req: context.req, secret });
  const userId = token?.sub as unknown as string;
  const user = await prisma?.user.findFirst({ where: { id: userId } });
  return {
    props: {
      setting: {
        lang: user?.lang,
      },
      ...(await serverSideTranslations(user?.lang ?? "en", [
        "settings",
        "common",
      ])),
    },
  };
}

export default function Setting({ setting }: { setting: { lang: string } }) {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.studio",
    title: "Settings",
  };
  const { i18n, t } = useTranslation(["settings", "common"]);
  const credit = useMotionValue(0);
  const currentCredit = useTransform(credit, (latest: number) =>
    Math.round(latest),
  );
  const used = useMotionValue(0);
  const usedCredit = useTransform(used, (latest: number) => Math.round(latest));
  const [language, setLanguage] = useState<string | undefined>(setting.lang);

  useAsyncEffect(async () => {
    const { credit: c, used: u } = await ofetch("/api/credit");
    animate(credit, c);
    animate(used, u);
    // return control.stop;
  }, []);

  const saveLanguage = useCallback(
    async (value: string) => {
      setLanguage(value);
      await ofetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({
          lang: value,
        }),
      });
      console.log("Refresh");
      
      location.replace(location.href);
    },
    [i18n],
  );
  const options = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Chinese",
      value: "zh",
    },
    {
      label: "Japanese",
      value: "ja",
    },
    {
      label: "German",
      value: "de",
    },
    {
      label: 'French',
      value: 'fr'
    }
  ];

  return (
    <Layout meta={meta}>
      <div className="mb-8 mt-10 text-4xl font-medium dark:text-white">
        {t("settings", { ns: "common" })}
      </div>
      <div className="mt-4 flex flex-row items-center justify-between space-x-20 dark:text-white md:justify-start">
        <div className="my-2 text-2xl">{t("language", { ns: "common" })}</div>
        <Selector
          options={options}
          label="Language"
          placeholder="Select language"
          active={language}
          onSelect={saveLanguage}
        ></Selector>
      </div>
      <div className="flex flex-col space-y-2 dark:text-white">
        <div className="my-2 text-2xl">{t("credit-usage")}</div>
        <div className="flex flex-row space-x-4">
          <div className="card w-80 items-center">
            <div className="text-xl font-bold">Current Credit</div>
            <motion.div className="mt-4 text-6xl slashed-zero text-green-600">
              {currentCredit}
            </motion.div>
          </div>
          <div className="card w-80 items-center dark:text-white">
            <div className="text-xl font-bold">Total Used Credit</div>
            <motion.div className="mt-4 text-6xl slashed-zero text-green-600">
              {usedCredit}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
