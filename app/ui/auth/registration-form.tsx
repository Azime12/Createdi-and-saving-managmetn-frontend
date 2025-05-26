  // components/FormComponent.tsx (Client Component)
  "use client"; // Ensures this runs on the client

  import { useFormik } from "formik";
  import * as Yup from "yup";
  import React from "react";
  import CInput from "../../components/CInput"; // Ensure this import path is correct

  const validationSchema = Yup.object({
    username: Yup.string().min(3, "Must be at least 3 characters").required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
  });

  const FormComponent = () => {
    const formik = useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
      },
      validationSchema,
      onSubmit: (values) => {
        console.log("Form submitted:", values);
      },
    });

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <CInput name="username" type="text" required formik={formik} />
        <CInput name="email" type="email" required formik={formik} />
        <CInput name="password" type="password" required formik={formik} />
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Submit
        </button>
      </form>
    );
  };

  export default FormComponent;
