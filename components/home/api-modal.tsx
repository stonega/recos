import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import Button from "../shared/button";
import { object, string } from "yup";
import { LOCAL_STORAGE_API_KEY } from "utils/constant";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast} from 'sonner'


const ApiModal = ({
  showApiModal,
  setShowApiModal,
}: {
  showApiModal: boolean;
  setShowApiModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const schema = object({
    apiKey: string().required("required"),
  });
  const initialValues = {
    apiKey: "",
  };

  const submit = ({ apiKey }: { apiKey: string }) => {
    localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
    toast.success("Api key set successfully");
    setShowApiModal(false);
  };
  return (
    <Modal showModal={showApiModal} setShowModal={setShowApiModal}>
      <div className="w-full overflow-hidden bg-white md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          validateOnBlur
          onSubmit={submit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4 px-4 py-8">
              <label className="w-full">
                <div className="relative flex flex-row">
                  <Field
                    placeholder="Enter api key"
                    className="input"
                    as="input"
                    type="text"
                    name="apiKey"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="bg-green text-dark ml-2 border-green-500 dark:text-white"
                  >
                    Save
                  </Button>
                </div>
                <ErrorMessage name="data">
                  {(msg) => <div className="text-red-600">{msg}</div>}
                </ErrorMessage>
              </label>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export function useApiModal() {
  const [showApiModal, setShowApiModal] = useState(false);

  const ApiModalCallback = useCallback(() => {
    return (
      <ApiModal showApiModal={showApiModal} setShowApiModal={setShowApiModal} />
    );
  }, [showApiModal, setShowApiModal]);

  return useMemo(
    () => ({ setShowApiModal, ApiModal: ApiModalCallback }),
    [setShowApiModal, ApiModalCallback],
  );
}
