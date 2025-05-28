// app/ui/login-form.tsx
"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CInput from "@/app/components/CInput";
import Button from "@/app/components/button";
import SignIn from "@/app/ui/sign-in";
import { useLoginMutation } from "@/redux/api/authApiSlice";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LoginIllustration } from "@/app/components/LoginIllustration";
import { 
  darkenColor,
  lightenColor,
  isColorLight,
  getContrastColor,
  getTextShadow 
} from "@/app/lib/colorUtils";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [isHovered, setIsHovered] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("primaryColor") || "#09c7ae";
      setPrimaryColor(savedColor);
    }
  }, []);

  const darkerColor = darkenColor(primaryColor, 20);
  
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap();
        const { token, user } = response;

        // Sign in with NextAuth credentials
        const signInResponse = await signIn("credentials", {
          redirect: false,
          token,
          user: JSON.stringify(user),
          callbackUrl: "/dashboard" // Add callbackUrl for proper redirect
        });

        if (signInResponse?.error) {
          throw new Error(signInResponse.error);
        }

        // Store auth data in localStorage (optional)
        localStorage.setItem("auth", JSON.stringify({
          token,
          user
        }));

        toast.success("Welcome back! Redirecting to dashboard...", {
          position: "top-center",
          icon: <FaUserShield style={{ color: primaryColor }} />,
        });

        // Handle redirect based on signIn response
        if (signInResponse?.url) {
          router.push(signInResponse.url);
        } else {
          // Fallback redirect if URL not provided
          router.push("/dashboard");
        }

      } catch (error) {
        let errorMessage = "Login failed. Please try again.";
        
        if ((error as any)?.data?.error) {
          errorMessage = (error as any).data.error;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast.error(errorMessage, {
          position: "top-center",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100  p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Form Section - Now on the left */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <FaLock className="text-white text-2xl" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-800"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 mt-2"
            >
              Sign in to continue to your account
            </motion.p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CInput
                name="email"
                type="email"
                              required
                formik={formik}
                primaryColor={primaryColor}
                icon={<FaEnvelope />}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CInput
                name="password"
                type="password"
                required
                formik={formik}
                primaryColor={primaryColor}
                icon={<FaLock />}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                {/* <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
                  style={{ color: primaryColor }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label> */}
              </div>

              <button
                type="button"
                onClick={() => router.push("/auth/request-reset")}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: primaryColor }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.span
                  animate={{ x: isHovered ? 2 : 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="flex items-center"
                >
                  Forgot password?
                  <FiLogIn className="ml-1" />
                </motion.span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                buttonText={isLoading ? "Authenticating..." : "Sign In"}
                isLoading={isLoading}
                disabled={!formik.isValid || formik.isSubmitting}
                primaryColor={primaryColor}
                // icon={<FiLogIn className="ml-2" />}
              />
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm mb-3">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <SignIn />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/auth/register")}
                className={`font-semibold hover:underline transition-colors`}
                style={{ color: primaryColor }}
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </div>

        {/* Illustration Section - Now on the right */}
        <div 
          className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-center"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${darkerColor})`
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            
            <LoginIllustration primaryColor={primaryColor} />
          </motion.div>
        
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mt-8 text-center"
            style={{ 
              color: getContrastColor(primaryColor),
              textShadow: getTextShadow(primaryColor)
            }}
          >
            Secure Access to Your Account
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-center px-4 py-1 rounded-lg"
            style={{ 
              color: getContrastColor(primaryColor),
              backgroundColor: `rgba(0,0,0,${isColorLight(primaryColor) ? 0.1 : 0.3})`,
              textShadow: getTextShadow(primaryColor)
            }}
          >
            Manage Saving, Credit and Loan with our powerful dashboard
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;