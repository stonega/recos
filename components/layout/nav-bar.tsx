import Link from "next/link";
import ThemeModeButton from "./theme-mode-button";

const NavBar = () => {
  return (
    <div className="my-4 flex w-full max-w-6xl items-center justify-between px-4">
      <Link href="/">
        <span className="text-black-600 flex items-center px-4 font-serif text-2xl font-bold dark:text-green-400 md:px-0 md:text-4xl">
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
