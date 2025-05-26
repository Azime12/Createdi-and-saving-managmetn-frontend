"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CInput from "@/app/components/CInput";
import { useCreateUserByAdminMutation } from "@/redux/api/adminApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/app/components/button";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

interface AddNewUserByAdminProps {
  onCloseModal?: () => void;
  onStartProcessing?: () => void;
}

const AddNewUserByAdmin: React.FC<AddNewUserByAdminProps> = ({ 
  onCloseModal, 
  onStartProcessing 
}) => {
  const [primaryColor, setPrimaryColor] = useState("#0ca197");
  const [createUser, { isLoading: isCreating }] = useCreateUserByAdminMutation();

  useEffect(() => {
    const savedColor = localStorage.getItem("primaryColor") || "#0ca197";
    setPrimaryColor(savedColor);
  }, []);

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
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        onStartProcessing?.();
        const newUser = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phoneNumber: values.phoneNumber,
        };

        const response = await createUser(newUser).unwrap();

        toast.success(
          `${response.message} ${response.user?.message || ""}`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );

        // Wait for toast to show before closing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        resetForm();
        onCloseModal?.();
      } catch (err: any) {
        const errorMessage =
          err?.data?.error ||
          err?.data?.message ||
          err?.message ||
          "An error occurred during registration. Please try again.";
        
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      }
    },
  });

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto rounded-lg shadow-lg bg-white px-6 sm:px-10 py-8 border border-gray-100" style={{ fontFamily: 'Luritria, sans-serif' }}>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <CInput 
              name="firstName" 
              type="text" 
              placeholder="Enter your first name"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaUser className="text-gray-400" />} 
            />
            <CInput 
              name="lastName" 
              type="text" 
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
              placeholder="Enter your email"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaEnvelope className="text-gray-400" />} 
            />
            <CInput 
              name="phoneNumber" 
              type="tel" 
              placeholder="Enter your phone number"
              required 
              formik={formik} 
              primaryColor={primaryColor} 
              icon={<FaPhone className="text-gray-400" />} 
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            buttonText={isCreating ? "Creating Account..." : "Create Account"}
            isLoading={isCreating}
            disabled={!formik.isValid || formik.isSubmitting || isCreating}
            primaryColor={primaryColor}
          />
        </div>
      </form>
    </div>
  );
};

export default AddNewUserByAdmin;