"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmailVerifyMutation } from "@/redux/api/authApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import Button from "@/app/components/button";
import Link from "next/link";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("verify");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0ca197");

  const [verifyEmail, { isLoading }] = useEmailVerifyMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("primaryColor") || "#0ca197";
      setPrimaryColor(savedColor);
    }
  }, []);

  useEffect(() => {
    if (token && verificationStatus === "pending") {
      verifyEmail(token)
        .unwrap()
        .then(() => {
          setVerificationStatus("success");
          toast.success("Email verified successfully!", {
            position: "top-center",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          setVerificationStatus("error");
          setErrorMessage(err?.data?.message || "Verification failed. Please try again.");
          toast.error("Verification failed", {
            position: "top-center",
          });
        });
    } else if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Invalid verification link");
    }
  }, [token, verifyEmail, verificationStatus]);

  const getStatusContent = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Email Verified Successfully!</h2>
            <p className="text-gray-600">Your email address has been successfully verified.</p>
            <div className="mt-6">
              <Button
                onClick={() => router.push("/auth/login")}
                buttonText="Continue to Login"
                primaryColor={primaryColor}
              />
            </div>
          </div>
        );
      case "error":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FaTimesCircle className="text-red-500 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => router.push("/auth/register")}
                buttonText="Try Registering Again"
                primaryColor={primaryColor}
              />
              <Link href="/contact" className="block text-sm text-blue-600 hover:underline">
                Need help? Contact support
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FaSpinner className="text-blue-500 text-5xl animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {getStatusContent()}
      </div>
    </div>
  );
}