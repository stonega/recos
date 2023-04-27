import Link from "next/link";
import ThemeModeButton from "./theme-mode-button";
import { useLoginModal } from "../shared/login-modal";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";

export interface NavBarProps {
  providers: any;
}
const NavBar = ({ providers }: NavBarProps) => {
  const { setShowLoginModal, LoginModal } = useLoginModal(providers);
  const { data } = useSession();
  console.log(data);

  return (
    <div className="my-4 flex w-full max-w-6xl items-center justify-between px-2 md:px-2">
      <LoginModal />

      <div className="flex flex-row items-center">
        <Link href="/">
          <span className="text-black-600 flex items-center px-4 font-serif text-2xl font-bold dark:text-green-400 md:px-0 md:text-4xl">
            Recos.
          </span>
        </Link>
        <ThemeModeButton></ThemeModeButton>
      </div>
      <div className="flex flex-row items-center">
        {!data ? (
          <a
            className="dark:text-white cursor-pointer hover:opacity-80"
            onClick={() => setShowLoginModal(true)}
          >
            LOG IN
          </a>
        ) : (
          <UserDropdown></UserDropdown>
        )}
      </div>
    </div>
  );
};

export default NavBar;
