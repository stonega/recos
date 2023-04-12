import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex gap-4">
        <a
          href="https://twitter.com/shimenmen"
          target="_blank"
          className="rounded-md bg-[#1da1f2] p-3 text-white"
          rel="noreferrer"
        >
          <Twitter className="mr-2 inline h-4 w-4 fill-white" />
          Twitter
        </a>
        <a
          href="https://github.com/stonega/recommends"
          target="_blank"
          className="rounded-md bg-[#24292F] p-3 text-white"
          rel="noreferrer"
        >
          <Github className="mr-2 inline h-4 w-4 fill-white" />
          GitHub
        </a>
      </div>
      <span className="mb-4 text-center text-gray-500">
        Made with ❤️ Stone © 2023 Recos.
      </span>
    </div>
  );
};

export default Footer;
