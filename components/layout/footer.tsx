import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4 mb-2">
        <a
          href="https://twitter.com/shimenmen"
          target="_blank"
          className="bg-[#1da1f2] text-white rounded-md p-3"
          rel="noreferrer"
        >
          <Twitter  className="inline w-4 h-4 fill-white mr-2" />
          Twitter
        </a>
        <a
          href="https://github.com/stonega/recommends"
          target="_blank"
          className="bg-[#24292F] text-white rounded-md p-3"
          rel="noreferrer"
        >
          <Github  className="inline w-4 h-4 fill-white mr-2" />
          GitHub
        </a>
      </div>
      <span className="mb-4 text-center text-gray-500">❤️ Made by Stone © 2023 Recos.</span>
    </div>
  );
};

export default Footer;
