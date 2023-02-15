import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { object, string } from "yup";
import Button from "../shared/button";

export const SearchBar = () => {
  const [result, setResult] = useState<string | undefined>();
  const schema = object({
    data: string().required("Required"),
    type: string().required("Required"),
  });
  const initialValues = {
    data: "",
    type: "text",
  };
  const submit = async ({ data, type }: { data: string; type: string }) => {
    try {
      console.log(data, type);
      const res = await fetch("/api/analyze", {
        method: "post",
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      console.log(result.data);

    } catch (error) {
      if (error instanceof Error) setResult(error.message);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      validateOnBlur
      onSubmit={submit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <label className="w-full relative">
            <span className="mb-4 block text-2xl"></span>
            <Field
              className="textarea"
              as="textarea"
              rows="6"
              type="value"
              name="data"
            />
            <ErrorMessage name="data">
              {(msg) => <div className="text-red-600 absolute right-4 bottom-2">{msg}</div>}
            </ErrorMessage>
          </label>
          <div className="flex flex-col w-full space-2 items-center justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-green border-green-500 mb-4 text-dark dark:text-white"
            >
              Get Recos
            </Button>
            <span>Books supported right now</span>
          </div>
        </Form>
      )}
    </Formik>
  );
};
