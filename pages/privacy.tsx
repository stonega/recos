import Layout from "@/components/layout";
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
    ogUrl: "http://recos.studio",
    title: "Privacy policy",
  };

  return (
    <Layout meta={meta}>
      <div className="mb-0 md:mb-20"></div>
      <article className="prose font-mono lg:prose-sm dark:text-white">
        <h1 className="dark:text-white">Privacy Policy</h1>
        <p>
          Recos is an audio transcription app that allows users to transcribe
          audio and podcast content. This privacy policy outlines how we
          collect, use, and protect user data.
        </p>
        <h2 className="dark:text-white">Data Collection</h2>
        <p>
          We collect basic information such as device type, operating system,
          and usage statistics to improve the app&apos;s functionality. We do
          not save user audio content on our server. We delete the audio content
          immediately after transcription.
        </p>
        <h2 className="dark:text-white">Data Protection</h2>
        <p>
          We take the protection of user data seriously. We use
          industry-standard security protocols to protect user data from
          unauthorized access, disclosure, alteration, and destruction.
        </p>
        <h2 className="dark:text-white">Data Sharing</h2>
        <p>
          We do not share user information with third parties or sell or rent
          user data to any third party.
        </p>
        <h2 className="dark:text-white">Changes to the Privacy Policy</h2>
        <p>
          We reserve the right to modify the privacy policy at any time. We will
          notify users of any changes by posting the updated policy on the
          app&apos;s website.
        </p>
        <h2 className="dark:text-white">Contact Us</h2>
        <p>
          If you have any questions or concerns about the privacy policy, please
          contact our support team. xijieyin@gmail.com.
        </p>
      </article>
    </Layout>
  );
}
