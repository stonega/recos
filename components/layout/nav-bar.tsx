import Link from "next/link";
import ThemeModeButton from "./theme-mode-button";

const NavBar = () => {
  return (
    <div className="max-w-6xl w-full my-4 px-4 flex justify-between items-center">
      <Link href="/">
        <span className="text-2xl font-mono text-black dark:text-white px-4 md:px-0 md:text-4xl font-bold flex items-center">
         Recos. 
        </span>
      </Link>
      <div className="flex flex-row">
        <ThemeModeButton></ThemeModeButton>
      </div>
    </div>
  );
};

export default NavBar;
