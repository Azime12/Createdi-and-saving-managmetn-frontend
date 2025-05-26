"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CInput from "@/app/components/CInput";
import CustomSelect from "@/app/components/CSelect";
import SearchableSelect from "@/app/components/seachableSelact";
import { useRouter } from "next/navigation";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useGetBranchByIdQuery,
} from "@/redux/api/branchApiSlice";
import { useSearchUsersQuery } from "@/redux/api/userApiSlice";
// import { ArrowBigLeftIcon } from "lucide-react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface BranchData {
  branchCode?: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  openingDate: string;
  status: string;
  managerId: string;
}

interface UserOption {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  email: string;
}

const validationSchema = Yup.object({
  branchName: Yup.string().required("Branch name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal code is required"),
  country: Yup.string().required("Country is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  openingDate: Yup.string().required("Opening date is required"),
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
  managerId: Yup.string().required("Manager is required"),
});

export default function BranchFormPage({
  params,
}: {
  params: { id?: string };
}) {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState("#0ea38f");
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManager, setSelectedManager] = useState<UserOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: searchResults,
    isLoading: isSearching,
    isError: searchError,
  } = useSearchUsersQuery(
    { field: "email", value: searchQuery },
    { skip: !searchQuery }
  );

  const { data: branchData, isLoading: branchLoading } = useGetBranchByIdQuery(
    params.id || "",
    { skip: !params.id }
  );

  useEffect(() => {
    const stored = localStorage.getItem("primaryColor");
    if (stored) setPrimaryColor(stored);
  }, []);

  const formik = useFormik({
    initialValues: {
      branchName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      email: "",
      openingDate: new Date().toISOString().split("T")[0],
      status: "active",
      managerId: "",
    },
    enableReinitialize: true,
validationSchema,
onSubmit: async (values, { setFieldError }) => {
  try {
    if (params.id) {
      await updateBranch({ id: params.id, ...values }).unwrap();
      toast.success("Branch updated successfully");
    } else {
      await createBranch(values).unwrap();
      toast.success("Branch created successfully");
    }
    router.push("/dashboard/branch");
  } catch (error: any) {
    
    console.error("Error saving branch:", error);
    
    // Handle specific field errors from backend
    if (error?.data?.details?.field === "Phone number already exists.") {
      setFieldError("phone", "This phone number is already registered");
      toast.error("This phone number is already registered");
    } 
    else if (error?.data?.details?.field === "Email already exists.") {
      setFieldError("email", "This email is already registered");
      toast.error("This email is already registered");
    }
    else {
      // Generic error handling
      const errorMessage = error?.data?.error || "Failed to save branch. Please try again.";
      const details = error?.data?.details?.field || "";
      console.log("error",details)
      toast.error(`${errorMessage} ${details}`);
    }
  }
},
  });

  // Set initial values when editing
  useEffect(() => {
    if (branchData && params.id) {
      formik.setValues({
        branchName: branchData.branchName || "",
        address: branchData.address || "",
        city: branchData.city || "",
        state: branchData.state || "",
        postalCode: branchData.postalCode || "",
        country: branchData.country || "",
        phone: branchData.phone || "",
        email: branchData.email || "",
        openingDate:
          branchData.openingDate || new Date().toISOString().split("T")[0],
        status: branchData.status || "active",
        managerId: branchData.managerId || "",
      });

      // If we have manager data, set it for the searchable select
      if (branchData.manager) {
        setSelectedManager({
          id: branchData.manager.id,
          label: `${branchData.manager.firstName} ${branchData.manager.lastName} (${branchData.manager.email})`,
          firstName: branchData.manager.firstName,
          lastName: branchData.manager.lastName,
          email: branchData.manager.email,
        });
      }
    }
  }, [branchData, params.id]);

  const fetchManagers = async (query: string) => {
    if (!query) return [];
    
    return (
      searchResults?.map((user: any) => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName} (${user.email})`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })) || []
    );
  };

  const handleManagerSelect = (option: UserOption | null) => {
    setSelectedManager(option);
    formik.setFieldValue("managerId", option?.id || "");
  };

  if (branchLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2">
      <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-4 mb-8">
  <button
    onClick={() => router.push("/dashboard/branch")}
    className={`flex items-center gap-2 text-md font-medium transition-colors hover:text-[${primaryColor}]`}
    style={{ color: primaryColor }}
  >
    <ArrowLeftCircleIcon className="w-5 h-5" />
    Back to Branches
  </button>
  
  <div className="h-6 border-l border-gray-300"></div>
  
  <h2 className="text-2xl font-bold text-gray-800">
    {params.id ? "Update Branch Details" : "Create New Branch"}
  </h2>
</div>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <CInput
            name="branchName"
            label="Branch Name"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="address"
            label="Address"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="city"
            label="City"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="state"
            label="State"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="postalCode"
            label="Postal Code"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="country"
            label="Country"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="phone"
            label="Phone"
            type="text"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="email"
            label="Email"
            type="email"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CInput
            name="openingDate"
            label="Opening Date"
            type="date"
            formik={formik}
            required
            primaryColor={primaryColor}
          />
          <CustomSelect
            label="Status"
            name="status"
            options={["active", "inactive"]}
            value={formik.values.status}
            onChange={(val) => formik.setFieldValue("status", val)}
            error={formik.errors.status}
            touched={formik.touched.status}
            primaryColor={primaryColor}
          />
<SearchableSelect
  label="Manager"
  value={selectedManager}
  onChange={handleManagerSelect}
  fetchOptions={fetchManagers}
  error={formik.errors.managerId}
  touched={formik.touched.managerId}
  primaryColor={primaryColor}
  placeholder="Search manager by email..."
  onSearch={setSearchQuery}
  loading={isSearching}
/>

       
<div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              onClick={() => router.push("/dashboard/branch")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size={20} color="white" />
                  <span className="ml-2">
                    {params.id ? "Updating..." : "Creating..."}
                  </span>
                </>
              ) : (
                params.id ? "Update" : "Add"
              )} Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}