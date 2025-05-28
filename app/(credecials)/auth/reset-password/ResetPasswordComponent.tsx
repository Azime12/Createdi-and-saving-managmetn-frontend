"use client";

import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "@/redux/api/authApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import CInput from "@/app/components/CInput";
import { FaLock, FaCheck, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "@/app/components/button";
import Link from "next/link";

const ResetPassword: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("resetPassword");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [primaryColor, setPrimaryColor] = useState<string>("#0ca197");
    console.log("token from fromend ",token)


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("primaryColor") || "#0ca197";
      setPrimaryColor(savedColor);
    }
  }, []);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Must be at least 8 characters")
      .max(50, "Must be less than 50 characters")
      .matches(/[A-Z]/, "Requires one uppercase letter")
      .matches(/[a-z]/, "Requires one lowercase letter")
      .matches(/\d/, "Requires one number")
      .matches(/[@$!%*?&]/, "Requires one special character (@$!%*?&)")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Invalid or missing reset token", { position: "top-center" });
        return;
      }

      setMessage("");
      setError("");

      try {
        const result = await resetPassword({ 
          token, 
          newPassword: values.newPassword 
        }).unwrap();
        
        setMessage(result.message || "Password reset successfully!");
        toast.success("Password has been reset successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        
        setTimeout(() => router.push("/auth/login"), 3000);
      } catch (err) {
        let errorMessage = "Failed to reset password. Please try again.";
        
        if (err && typeof err === "object" && "data" in err) {
          const errorData = err.data as { message?: string };
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage, { position: "top-center" });
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto mt-8 sm:mt-12 rounded-lg shadow-lg bg-white px-6 py-8 border border-gray-100" style={{ fontFamily: "Luritria, sans-serif" }}>
      <section className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke={primaryColor} 
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Set Password
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Create  password for your account
        </p>
      </section>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <CInput
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              required
              formik={formik}
              primaryColor={primaryColor}
              icon={<FaLock className="text-gray-400" />}
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
            />
            {showPasswordRequirements && (
              <div className="absolute z-10 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                <p className="text-xs font-medium mb-1">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={`flex items-center ${formik.values.newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                    {formik.values.newPassword.length >= 8 ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(formik.values.newPassword) ? 'text-green-500' : ''}`}>
                    {/[A-Z]/.test(formik.values.newPassword) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(formik.values.newPassword) ? 'text-green-500' : ''}`}>
                    {/[a-z]/.test(formik.values.newPassword) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One lowercase letter
                  </li>
                  <li className={`flex items-center ${/\d/.test(formik.values.newPassword) ? 'text-green-500' : ''}`}>
                    {/\d/.test(formik.values.newPassword) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One number
                  </li>
                  <li className={`flex items-center ${/[@$!%*?&]/.test(formik.values.newPassword) ? 'text-green-500' : ''}`}>
                    {/[@$!%*?&]/.test(formik.values.newPassword) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <CInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your new password"
            required
            formik={formik}
            primaryColor={primaryColor}
            icon={<FaLock className="text-gray-400" />}
          />
        </div>

        <div className="pt-2">
          <Button
            buttonText={isLoading ? "Resetting Password..." : "Reset Password"}
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

        {message && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg text-center">
            {message}
          </div>
        )}
      </form>

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

export default ResetPassword;