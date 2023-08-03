import { Coffee, Github, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex gap-4">
        <a
          href="https://twitter.com/shimenmen"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="mr-2 inline h-6 w-6 fill-[#1da1f2] dark:stroke-white" />
        </a>
        <a
          href="https://github.com/stonega/recommends"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="mr-2 inline h-6 w-6 fill-[] dark:stroke-white" />
        </a>
        <a
          href="https://www.buymeacoffee.com/stonegate"
          target="_blank"
          rel="noreferrer"
        >
          <Coffee className="mr-2 inline h-6 w-6 fill-orange-300 dark:stroke-white" />
        </a>
      </div>
      <span className="mb-2 text-center text-gray-500">
        Made with ❤️ by Stone © 2023 Recos.
      </span>
      <div className="flex flex-row gap-4">
      <Link
        href="/privacy"
        className="mb-4 text-gray-500 underline decoration-solid"
      >
        Privacy
      </Link>
      <Link
        href="/terms"
        className="mb-4 text-gray-500 underline decoration-solid"
      >
        Terms of Use
      </Link>

      </div>
    </div>
  );
};

export default Footer;
