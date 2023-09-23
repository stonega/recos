import Link from "next/link";
import ThemeModeButton from "./theme-mode-button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import UserDropdown from "./user-dropdown";
import { useTranslation } from "next-i18next";

export interface NavBarProps {
  providers: any;
  products: any[];
}
const NavBar = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const { t } = useTranslation("common");

  return (
    <div className="my-4 flex w-full max-w-6xl items-center justify-between px-2 md:px-2">
      <div className="flex flex-row items-center">
        <Link href="/">
          <span className="text-black-600 flex items-center px-4 font-serif text-2xl font-bold dark:text-green-600 md:px-0 md:text-4xl">
            Recos.
          </span>
        </Link>
        <span className="rounded-full  bg-green-300 px-2 py-1 text-sm dark:bg-green-600">
          Beta
        </span>
        <ThemeModeButton></ThemeModeButton>
        <Link
          href="/dashboard"
          className="mx-8 hidden text-xl underline underline-offset-8 hover:text-green-600 hover:decoration-wavy dark:text-white md:block"
        >
          {t("dashboard")}
        </Link>
        <Link
          href="/pricing"
          className="hidden text-xl underline underline-offset-8 hover:text-green-600 hover:decoration-wavy dark:text-white md:block"
        >
          {t("pricing")}
        </Link>
      </div>
      {pathname?.includes("/login") ? null : (
        <div className="flex flex-row items-center">
          {!data ? (
            <Link
              className="cursor-pointer hover:opacity-80 dark:text-white"
              href="/login"
            >
              {t("sign-in")}
            </Link>
          ) : (
            <UserDropdown />
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
