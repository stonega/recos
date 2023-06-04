import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { signIn } from "next-auth/react";
import GoogleIcon from "./icons/google-icon";
import Github from "./icons/github";

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  providers,
}: {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  providers: any;
}) => {
  const loginWithOauth = async (provider: string) => {
    const id = providers[provider].id;
    signIn(id);
    setShowLoginModal(false);
  };
  return (
    <Modal showModal={showLoginModal} setShowModal={setShowLoginModal}>
      <div className="w-full overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="pt-8 text-center text-2xl font-bold">
          Login to Recos.
        </div>
        <div className="flex flex-col items-center space-y-3 py-8">
          <button
            type="button"
            onClick={() => loginWithOauth("google")}
            className="dark:focus:ring-[#4285F4]/55 mb-2 inline-flex w-60 items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => loginWithOauth("github")}
            className="mb-2 inline-flex w-60 items-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#050708]/95 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
          >
            <Github />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function useLoginModal(providers: any) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const LoginModalCallback = useCallback(() => {
    return (
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        providers={providers}
      />
    );
  }, [showLoginModal, providers]);

  return useMemo(
    () => ({ setShowLoginModal, LoginModal: LoginModalCallback }),
    [setShowLoginModal, LoginModalCallback],
  );
}
