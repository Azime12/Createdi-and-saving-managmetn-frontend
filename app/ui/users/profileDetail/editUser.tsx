import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt } from "react-icons/fa";
import { useUpdateUserMutation } from "@/redux/api/adminApiSlice";
import { useGetAllRoleQuery } from "@/redux/api/rolePermissionApiSlice";
import CInput from "@/app/components/CInput";
import Button from "@/app/components/button";
import CustomSelect from "@/app/components/CSelect";

interface EditUserFormProps {
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role?: {
      id: string;
      name: string;
    };
  };
  onCloseModal: () => void;
  primaryColor: string;
}

const EditUserForm = ({ userData, onCloseModal, primaryColor }: EditUserFormProps) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: roles, isLoading: roleIsLoading } = useGetAllRoleQuery();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .max(50, "First name must be at most 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    roleId: Yup.string().required('Role is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      roleId: userData.role?.id || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateUser({ 
          id: userData.id, 
          firstName:values.firstName,
          lastName:values.lastName,
          roleId: values.roleId
        }).unwrap();
        
        toast.success("Profile updated successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          className: "toast-success",
        });
        onCloseModal();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update profile", {
          position: "top-center",
          autoClose: 5000,
          className: "toast-error",
        });
      }
    },
  });

  // Prepare role options
  const roleOptions = roles?.roles?.map((role: any) => role.name) || [];
  const roleValues = roles?.roles?.map((role: any) => role.id) || [];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CInput
          name="firstName"
          type="text"
          label="First Name"
          placeholder="Enter first name"
          formik={formik}
          primaryColor={primaryColor}
          icon={<FaUser className="text-gray-400" />}
        />
        
        <CInput
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Enter last name"
          formik={formik}
          primaryColor={primaryColor}
          icon={<FaUser className="text-gray-400" />}
        />
      
      </div>

   

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CInput
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          formik={formik}
          primaryColor={primaryColor}
          icon={<FaEnvelope className="text-gray-400" />}
          disabled={true}

          
        />
        <CInput
          name="phoneNumber"
          type="tel"
          label="Phone Number"
          placeholder="Enter phone number"
          formik={formik}
          primaryColor={primaryColor}
          icon={<FaPhone className="text-gray-400" />}
          disabled={true}

        />    
      </div>
<div>
<CustomSelect
          name="roleId"
          label="User Role"
          options={roleOptions}
          value={roleOptions[roleValues.indexOf(formik.values.roleId)] || ''}
          onChange={(value) => {
            const selectedIndex = roleOptions.indexOf(value);
            formik.setFieldValue('roleId', roleValues[selectedIndex]);
          }}
          error={formik.touched.roleId && formik.errors.roleId}
          touched={formik.touched.roleId}
          primaryColor={primaryColor}
          disabled={roleIsLoading}
          placeholder={roleIsLoading ? "Loading roles..." : "Select a role"}
          icon={<FaShieldAlt className="text-gray-400" />}
        />
</div>
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCloseModal}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <Button
          buttonText={isLoading ? "Saving..." : "Save Changes"}
          isLoading={isLoading}
          disabled={!formik.isValid || isLoading || roleIsLoading}
          primaryColor={primaryColor}
          type="submit"
          className="px-5 py-2.5 text-sm"
        />
      </div>
    </form>
  );
};

export default EditUserForm;