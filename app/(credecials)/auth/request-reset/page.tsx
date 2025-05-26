"use client";

import { useEffect, useState } from "react";
import { useRequestPasswordResetMutation } from "@/redux/api/authApiSlice";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import CInput from "@/app/components/CInput";
import { FaEnvelope, FaArrowRight, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "@/app/components/button";
import Link from "next/link";
import { string } from "zod";

const RequestPasswordReset: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();
  const [primaryColor, setPrimaryColor] = useState<string>("#0ca197");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("primaryColor") || "#0ca197";
      setPrimaryColor(savedColor);
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage("");
      setError("");
      
      try {
        const result = await requestPasswordReset({ email: values.email.trim() }).unwrap();
        setMessage(result.message || "Password reset link sent to your email");
        setEmailSent(true);
        toast.success("Reset link sent successfully!", {
          position: "top-center",
          autoClose: 5000,
        });
        
      } catch (err) {
        let errorMessage = "Failed to send reset email. Please try again.";
        
        if (err && typeof err === "object" && "data" in err && err.data) {
          const data = err.data as { message?: string };
          if (typeof data.message === "string") {
            errorMessage = data.message;
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage, { position: "top-center" });
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto my-8 sm:my-12 rounded-xl shadow-lg bg-white px-8 py-12 border border-gray-100" style={{ fontFamily: "Luritria, sans-serif" }}>
      <section className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-50">
            <FaLock className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {emailSent ? "Check Your Email" : "Reset Password"}
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          {emailSent 
            ? "We've sent a password reset link to your email address"
            : "Enter your email to receive a password reset link"}
        </p>
      </section>

      {!emailSent ? (
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <CInput
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              required
              formik={formik}
              primaryColor={primaryColor}
              icon={<FaEnvelope className="text-gray-400" />}
            />

            <div className="flex items-center text-xs text-gray-500">
              <FaArrowRight className="mr-1 text-xs" />
              <span>We'll send you a link to reset your password</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              buttonText={isLoading ? "Sending..." : "Send Reset Link"}
              isLoading={isLoading}
              disabled={!formik.isValid || formik.isSubmitting || isLoading}
              primaryColor={primaryColor}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              If you don't see the email, check your spam folder or try resending.
            </p>
          </div>
          <button
            onClick={() => {
              setEmailSent(false);
              formik.resetForm();
            }}
            className="text-sm font-medium hover:underline"
            style={{ color: primaryColor }}
          >
            Try another email address
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="font-semibold hover:underline"
          style={{ color: primaryColor }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RequestPasswordReset;