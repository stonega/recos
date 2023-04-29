import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { signIn } from "next-auth/react"
import GoogleIcon from "./icons/google-icon";
import { GithubIcon } from "lucide-react";

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  providers
}: {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  providers: any
}) => {

  const loginWithOauth = async (provider: string ) => {
    const id = providers[provider].id;
    signIn(id)
    setShowLoginModal(false);
  };
  return (
    <Modal showModal={showLoginModal} setShowModal={setShowLoginModal}>
      <div className="w-full overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
      <div className="py-8 flex flex-col items-center space-y-3">
      <button
        type="button"
        onClick={() => loginWithOauth('google')}
        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
      <button
        type="button"
        onClick={() => loginWithOauth('github')}
        className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2"
      >
        <GithubIcon size="18" className="mr-2" />
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
      <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} providers={providers} />
    );
  }, [showLoginModal, providers]);

  return useMemo(
    () => ({ setShowLoginModal, LoginModal: LoginModalCallback }),
    [setShowLoginModal, LoginModalCallback],
  );
}
