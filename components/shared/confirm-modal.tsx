import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import Button from "./button";

const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  onConfirm,
  children,
}: {
  showConfirmModal: boolean;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  onConfirm(): void;
  children: ReactNode;
}) => {
  return (
    <Modal
      showModal={showConfirmModal}
      setShowModal={setShowConfirmModal}
      clickToClose={false}
    >
      <div className="w-full overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="px-4 pt-8 text-center text-xl font-bold">
          {children}
        </div>
        <div className="mt-8 flex flex-row items-center">
          <Button
            className="w-30 mx-auto mb-6 mt-6 border-green-500 bg-green-100 px-8 font-normal"
            onClick={() => {
              localStorage.removeItem("path");
              setShowConfirmModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-30 mx-auto mb-6 mt-6 px-8"
            onClick={() => {
              setShowConfirmModal(false);
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export function useConfirmModal(onConfirm: () => void) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const ConfirmModalCallback = useCallback(
    ({ children }: { children: ReactNode }) => {
      return (
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          onConfirm={onConfirm}
        >
          {children}
        </ConfirmModal>
      );
    },
    [showConfirmModal, onConfirm],
  );

  return useMemo(
    () => ({ setShowConfirmModal, ConfirmModal: ConfirmModalCallback }),
    [setShowConfirmModal, ConfirmModalCallback],
  );
}
