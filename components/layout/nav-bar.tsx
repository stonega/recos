import Link from "next/link";
import ThemeModeButton from "./theme-mode-button";
import { useLoginModal } from "../shared/login-modal";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";
import { useProductsModal } from "../shared/products-modal";

export interface NavBarProps {
  providers: any;
  products: any[];
}
const NavBar = ({ providers, products }: NavBarProps) => {
  const { setShowLoginModal, LoginModal } = useLoginModal(providers);
  const { setShowProductsModal, ProductsModal } = useProductsModal(products);
  const { data } = useSession();

  return (
    <div className="my-4 flex w-full max-w-6xl items-center justify-between px-2 md:px-2">
      <LoginModal />
      <ProductsModal />
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
            className="cursor-pointer hover:opacity-80 dark:text-white"
            onClick={() => setShowLoginModal(true)}
          >
            LOG IN
          </a>
        ) : (
          <UserDropdown
            onGetCredits={() => setShowProductsModal(true)}
          ></UserDropdown>
        )}
      </div>
    </div>
  );
};

export default NavBar;
