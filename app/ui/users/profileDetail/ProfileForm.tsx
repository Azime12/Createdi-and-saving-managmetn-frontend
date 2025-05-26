  "use client";

  import { useState } from "react";
  import {
    FiUpload,
    FiCalendar,
    FiUser,
    FiMapPin,
    FiCreditCard,
    FiX,
  } from "react-icons/fi";
  import * as Yup from "yup";
  import { useFormik } from "formik";
  import CInput from "@/app/components/CInput";
  import { toast } from "react-toastify";
  import { useCreateProfileMutation } from "@/redux/api/userProfileApiSlice";
  interface ProfileFormModalProps {
    profileData: any;
    onSubmit: (data: FormData) => Promise<void>;
    onClose: () => void;
    primaryColor?: string;
    userId?:string
  }
  const ProfileFormModal = ({
    profileData,
    onSubmit,
    userId,
    onClose,
    primaryColor = "#2563eb",
  }: ProfileFormModalProps) => {
    const [preview, setPreview] = useState({
      profilePhoto: "",
      idFrontPhoto: "",
      idBackPhoto: "",
    });

    const [createProfile, { isLoading }] = useCreateProfileMutation();

    const formik = useFormik({
      initialValues: {
        dateOfBirth: profileData?.dateOfBirth || "",
        wereda: profileData?.address?.wereda || "",
        zone: profileData?.address?.zone || "",
        city: profileData?.address?.city || "",
        state: profileData?.address?.state || "",
        country: profileData?.address?.country || "",
        po_Box: profileData?.address?.poBox || "",
        idType: profileData?.idType || "",
        idNumber: profileData?.idNumber || "",
        profilePhoto: null as File | null,
        idFrontPhoto: null as File | null,
        idBackPhoto: null as File | null,
      },
      validationSchema: Yup.object({
        dateOfBirth: Yup.string().required("Date of Birth is required"),
        idType: Yup.string().required("ID Type is required"),
        idNumber: Yup.string().required("ID Number is required"),
      }),
      onSubmit: async (values) => {
        const address = {
          wereda: values.wereda,
          zone: values.zone,
          city: values.city,
          state: values.state,
          country: values.country,
          poBox: values.po_Box,
        };
        const formData = new FormData();
        formData.append(
          "address",
          JSON.stringify(address));
        formData.append("dateOfBirth", values.dateOfBirth);
        formData.append("idType", values.idType);
        formData.append("idNumber", values.idNumber);   

        if (values.profilePhoto) formData.append("profilePhoto", values.profilePhoto);
        if (values.idFrontPhoto) formData.append("idFrontPhoto", values.idFrontPhoto);
        if (values.idBackPhoto) formData.append("idBackPhoto", values.idBackPhoto);

        try {
          await createProfile({ userId, formData }).unwrap();
          toast.success("Profile saved successfully!");
          onClose();
        } catch (error: any) {
          if (error?.data?.errors) {
            error.data.errors.forEach((err: string) => toast.error(err));
          } else if (error?.data?.message) {
            toast.error(error.data.message);
          } else {
            toast.error("An unexpected error occurred.");
          }
          
        }
        
      },
    });

    const handleFileChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: "profilePhoto" | "idFrontPhoto" | "idBackPhoto"
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and WEBP images are allowed.");
        return;
      }

      formik.setFieldValue(field, file);
      setPreview((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file),
      }));
    };

    const renderImagePreview = (src: string, big = false) =>
      src && (
        <img
          src={src}
          alt="Preview"
          className={`ml-3 ${
            big ? "w-64 h-auto" : "w-14 h-14"
          } object-cover rounded-md border border-gray-200`}
        />
      );

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
        <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
          <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Complete Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FiUser /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formik.values.dateOfBirth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FiCalendar className="absolute top-2.5 right-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Profile Photo</label>
                  <div className="flex items-center">
                    <label
                      htmlFor="profilePhoto"
                      className="cursor-pointer flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                    >
                      <FiUpload className="mr-2" />
                      Upload
                    </label>
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => handleFileChange(e, "profilePhoto")}
                      className="sr-only"
                    />
                    {renderImagePreview(preview.profilePhoto)}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FiMapPin /> Address Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <CInput name="wereda" type="text" label="'wereda" required formik={formik} primaryColor={primaryColor} />
                <CInput name="zone" type="text" required label="Zone" formik={formik} primaryColor={primaryColor} />
                <CInput name="city" type="text" required label="City" formik={formik} primaryColor={primaryColor} />
                <CInput name="state" type="text" required label='State'formik={formik} primaryColor={primaryColor} />
                <CInput name="country" type="text" required label="Country" formik={formik} primaryColor={primaryColor} />
                <CInput name="po_Box" type="text" required={false} label="Po Box." formik={formik} primaryColor={primaryColor} />
              </div>
            </div>

            {/* ID Info */}
            <div>
              <h3 className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FiCreditCard /> Identification
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">ID Type</label>
                  <select
                    name="idType"
                    value={formik.values.idType}
                    onChange={formik.handleChange}
                    className="w-full border p-2 rounded-md"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="National ID">National ID</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <CInput name="idNumber" type="text" required formik={formik} primaryColor={primaryColor} label="ID Number" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {["idFrontPhoto", "idBackPhoto"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium capitalize">
                      {field.replace("Photo", " Photo").replace("id", "ID ")}
                    </label>
                    <div className="flex items-center">
                      <label
                        htmlFor={field}
                        className="cursor-pointer flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                      >
                        <FiUpload className="mr-2" />
                        Upload
                      </label>
                      <input
                        id={field}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) =>
                          handleFileChange(e, field as "idFrontPhoto" | "idBackPhoto")
                        }
                        className="sr-only"
                      />
                      {renderImagePreview((preview as any)[field], true)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                {formik.isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default ProfileFormModal;
