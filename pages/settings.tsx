import Layout from "@/components/layout";
import { Meta } from "types";
import { getToken } from "next-auth/jwt";
import { ofetch } from "ofetch";
import { useEffect, useState } from "react";
import { useAsyncEffect } from "ahooks";
import Selector from "@/components/shared/selector";

export async function getServerSideProps(context: any) {
  const token = await getToken({ req: context.req, raw: true });
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
      token,
    },
  };
}

export default function Setting() {
  const meta: Meta = {
    description: "Podcast to text.",
    ogUrl: "http://recos.stonegate.me",
    title: "Settings",
  };
  const [credit, setCredit] = useState(0);
  const [used, setUsed] = useState(0);
  const [language, setLanguage] = useState<string | undefined>();

  useAsyncEffect(async () => {
    const { credit, used } = await ofetch("/api/credit");
    setCredit(credit);
    setUsed(used);
  }, []);

  useAsyncEffect(async () => {
    const { translateLanguage } = await ofetch("/api/settings");
    setLanguage(translateLanguage);
  }, []);

  function saveLanguage(value: string) {
    setLanguage(value);
    ofetch("/api/settings", {
      method: "POST",
      body: JSON.stringify({
        translateLanguage: value,
      }),
    });
  }
  const options = [
    {
      label: "Chinese",
      value: "zh-CN",
    },
    {
      label: "English",
      value: "en-US",
    },
    {
      label: "Japanese",
      value: "ja-JP",
    },
  ];

  return (
    <Layout meta={meta}>
      <div className="mb-8 mt-10 text-4xl font-medium dark:text-white">
        Settings
      </div>
      <div className="flex flex-col space-y-2 dark:text-white">
        <div className="my-2 text-2xl">Credit Usage</div>
        <div className="flex flex-row space-x-4">
          <div className="card w-80 items-center">
            <div className="text-xl font-bold">Current Credit</div>
            <div className="mt-4 text-6xl text-green-600">{credit}</div>
          </div>
          <div className="card w-80 items-center dark:text-white">
            <div className="text-xl font-bold">Total Used Credit</div>
            <div className="mt-4 text-6xl text-green-600">{used}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-x-2 dark:text-white">
        <div className="my-2 text-2xl">Language</div>
        <div className="flex flex-row items-center space-x-20">
          <div className="text-lg">Translation language</div>
          {language && (
            <Selector
              options={options}
              label="Language"
              placeholder="Select language"
              active={language}
              onSelect={saveLanguage}
            ></Selector>
          )}
        </div>
      </div>
    </Layout>
  );
}
