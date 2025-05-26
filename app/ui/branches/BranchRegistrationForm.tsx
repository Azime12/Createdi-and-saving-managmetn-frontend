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
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useSearchUsersQuery({
    field: 'email', // Searching by email; this can be changed as needed
    value: searchQuery,
  });

  const fetchManagers = () => {
    return data?.users.map((user: any) => ({
      id: user.id,
      label: user.email,
      ...user,
    })) || [];
  };

  const { data: branchData, isLoading: branchLoading } = useGetBranchByIdQuery(
    params.id || "",
    {
      skip: !params.id,
    }
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
    onSubmit: async (values) => {
      try {
        if (params.id) {
          await updateBranch({ id: params.id, ...values }).unwrap();
        } else {
          await createBranch(values).unwrap();
        }
        router.push("/branches"); // Redirect to branches list
      } catch (error) {
        console.error("Error saving branch:", error);
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
    }
  }, [branchData, params.id]);

  if (branchLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {params.id ? "Update Branch" : "Add New Branch"}
          </h2>
          <button
            onClick={() => router.push("/branches")}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
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
            value={formik.values.managerId}
            onChange={(id) => formik.setFieldValue('managerId', id)}
            fetchOptions={fetchManagers}
            error={formik.errors.managerId}
            touched={formik.touched.managerId}
            primaryColor={primaryColor}
            placeholder="Search manager by email..."
            onSearch={setSearchQuery}
            loading={isLoading} // Pass the loading state here
          />

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              onClick={() => router.push("/branches")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              {params.id ? "Update" : "Add"} Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
