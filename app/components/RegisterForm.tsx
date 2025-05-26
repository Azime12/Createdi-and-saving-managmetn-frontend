'use client'

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CInput from "@/app/components/CInput";
import { useCreateUsersMutation } from "@/redux/api/userApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaArrowRight } from "react-icons/fa";
import SignIn from "@/app/ui/sign-in";
import Link from "next/link";

const RegisterForm = () => {
  const [primaryColor, setPrimaryColor] = useState<string>("#0ca197");
  const [createUser, { isLoading: isCreating, isError, error }] = useCreateUsersMutation();
  const router = useRouter();
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("primaryColor") || "#0ca197";
      setPrimaryColor(savedColor);
    }
  }, []);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const newUser = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          password: values.password,
          phoneNumber: values.phoneNumber,
        };

        const response = await createUser(newUser).unwrap();
        const verificationMessage = response?.user?.message || "Verification email sent. Please check your email.";

        toast.success(`Account created successfully! ${verificationMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        resetForm();
        router.push('/auth/login');
      } catch (err: unknown) {
        const errorMessage = 
          err && typeof err === "object" && "data" in err && err.data
            ? (err.data as { message?: string }).message
            : "An error occurred during registration. Please try again.";

        toast.error(errorMessage, {
          position: "top-center",
        });
      }
    },
  });

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto rounded-lg shadow-lg bg-white px-6 sm:px-10 py-8 border border-gray-100" style={{ fontFamily: 'Luritria, sans-serif' }}>
      <section className="text-left mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke={primaryColor} 
            className="icon-primary" 
            style={{ width: "36px", height: "36px" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
          </svg>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Create Account
          </h2>
        </div>
        <p className="text-center text-sm text-gray-600 max-w-xl mx-auto">
          Get started today by creating your account below.
        </p>
      </section>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <CInput 
              name="firstName" 
              type="text" 
              // label="First Name"
              placeholder="Enter your first name"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaUser className="text-gray-400" />} 
            />
            <CInput 
              name="lastName" 
              type="text" 
              // label="Last Name"
              placeholder="Enter your last name"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaUser className="text-gray-400" />}  
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <CInput 
              name="email" 
              type="email" 
              // label="Email"
              // placeholder="Enter your email"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaEnvelope className="text-gray-400" />} 
            />
            <CInput 
              name="phoneNumber" 
              type="tel" 
              // label="Phone Number"
              placeholder="Enter your phone number"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaPhone className="text-gray-400" />} 
            />
          </div>
          
          <div className="relative">
            <CInput 
              name="password" 
              type={showPasswords.password ? "text" : "password"} 
              // label="Password"
              placeholder="Create a password"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaLock className="text-gray-400" />}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility("password")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
            />
            {showPasswordRequirements && (
              <div className="absolute z-10 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                <p className="text-xs font-medium mb-1">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={`flex items-center ${formik.values.password.length >= 8 ? 'text-green-500' : ''}`}>
                    {formik.values.password.length >= 8 ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(formik.values.password) ? 'text-green-500' : ''}`}>
                    {/[A-Z]/.test(formik.values.password) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(formik.values.password) ? 'text-green-500' : ''}`}>
                    {/[a-z]/.test(formik.values.password) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One lowercase letter
                  </li>
                  <li className={`flex items-center ${/\d/.test(formik.values.password) ? 'text-green-500' : ''}`}>
                    {/\d/.test(formik.values.password) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One number
                  </li>
                  <li className={`flex items-center ${/[@$!%*?&]/.test(formik.values.password) ? 'text-green-500' : ''}`}>
                    {/[@$!%*?&]/.test(formik.values.password) ? <FaCheck className="mr-1 text-xs" /> : <FaArrowRight className="mr-1 text-xs" />}
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <CInput 
            name="confirmPassword" 
            type={showPasswords.confirmPassword ? "text" : "password"} 
            // label="Confirm Password"
            placeholder="Confirm your password"
            required 
            formik={formik} 
            primaryColor={primaryColor} 
            icon={<FaLock className="text-gray-400" />}
            rightIcon={
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            buttonText={isCreating ? "Creating Account..." : "Create Account"}
            isLoading={isCreating}
            disabled={!formik.isValid || formik.isSubmitting || isCreating}
            primaryColor={primaryColor}
          />
        </div>

        {isError && (
          <div className="mt-2 text-red-500 text-center text-sm">
            {error && "data" in error && error.data
              ? (error.data as { message?: string }).message
              : "Registration failed. Please try again."}
          </div>
        )}
      </form>

      <div className="relative flex items-center justify-center my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative bg-white px-3 text-sm text-gray-500">OR </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-3 mb-6">
        <div className="lg:flex-1">
          <SignIn />
        </div>
        
        <div className="text-center lg:text-right text-sm text-gray-600">
          <span>Already have an account? </span>
          <Link
            href="/auth/login"
            className="font-semibold hover:underline"
            style={{ color: primaryColor }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 