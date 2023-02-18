import { ErrorMessage, Field, Form, Formik } from "formik";
import { createToast } from "vercel-toast-center";
import { object, string } from "yup";
import Button from "../shared/button";

interface SearchPageProps {
  onResult: (result: string[]) => void;
}
export const SearchPage = ({ onResult }: SearchPageProps) => {
  const schema = object({
    data: string().required("required"),
  });
  const initialValues = {
    data: "",
  };

  const submit = async ({ data }: { data: string }) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "post",
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      onResult(result);
    } catch (error) {
      if (error instanceof Error) createToast(error.message);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      validateOnBlur
      onSubmit={submit}
    >
      {({ isSubmitting, values }) => (
        <Form className="flex flex-col gap-4">
          <label className="w-full">
            <div className="relative flex flex-row">
              <Field placeholder="Enter page url" className="input" as="input" type="url" name="data" />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="bg-green text-dark ml-2 border-green-500 dark:text-white"
              >
                Reco
              </Button>
            </div>
            <ErrorMessage name="data">
              {(msg) => <div className="text-red-600">{msg}</div>}
            </ErrorMessage>
          </label>
        </Form>
      )}
    </Formik>
  );
};
