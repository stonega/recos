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
      console.log(result);
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
          <label className="w-full">
            <span className="mb-4 block text-2xl"></span>
            <Field
              className="textarea"
              as="textarea"
              rows="10"
              type="value"
              name="data"
            />
            <ErrorMessage name="data">
              {(msg) => <div className="text-error">{msg}</div>}
            </ErrorMessage>
          </label>
          <div className="flex w-full flex-row items-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-green border-green mb-4"
            >
              Get Recos
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
