import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiEdit,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaUser,
  FaMapMarkerAlt,
  FaIdCard,
  FaBirthdayCake,
  FaCheckCircle,
} from "react-icons/fa";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import DocumentViewer from "../DocumentViewer";
import VerificationBadge from "../VerificationBadge";
import InfoField from "../InfoField";
import EditUserDialog from "../EditUserDialog";
import ProfileFormModal from "../ProfileForm";

interface OverviewTabProps {
  userData: any;
  profileinfo: any;
  isLoading?: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  setActiveTab: (tab: string) => void;
  primaryColor: string;
  userId:string;
}

const OverviewTab = ({
  profileinfo,
  userId,
  userData,
  isLoading,
  formatDate,
  primaryColor,
}: OverviewTabProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<
    "profile" | "front" | "back" | null
  >(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [dialogOpenedit, setDialogOpenEdit] = useState(false);
  const [localProfileInfo, setLocalProfileInfo] = useState(profileinfo);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basicInfo: true,
    addressInfo: true,
    identification: true,
    documents: true,
  });
  useEffect(()=>{
setLocalProfileInfo(profileinfo);
  },[profileinfo])

  const formatDob = (dateString?: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProfileSubmit = async (formData: FormData) => {
    try {
      // console.log("Submitting form data:", formData);
      // alert("Profile updated successfully!");
      setShowProfileForm(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner/>
      </div>
    );
  }else{
    console.log("local",localProfileInfo)
  }

 if (!userData) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 space-y-4">
      <p>No profile data available.</p>
      <button
        onClick={() => setShowProfileForm(true)}
        className="inline-flex items-center px-4 py-2 border border-amber-500 text-amber-700 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all"
      >
        <FiEdit className="mr-2" />
        Add User Information
      </button>

      {showProfileForm && (
        <ProfileFormModal
          onClose={() => setShowProfileForm(false)}
          onSubmit={handleProfileSubmit}
          userId={userId}
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
}


  const isProfileComplete = localProfileInfo?.profileCompleted;
  {console.log("profile console.log",localProfileInfo?.profileCompleted)}

  return (
    <>
      <div className="space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-3 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
  {localProfileInfo?.profilePhoto ? (
    <img
      src={localProfileInfo?.profilePhoto.replace(/\\/g, "/")} // Correct URL format
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <FiUser size={40} className="text-gray-400" />
  )}
  <button
    onClick={() => setActiveDocument("profile")}
    className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all opacity-0 hover:opacity-100"
  >
    <div className="bg-white bg-opacity-80 rounded-full p-1.5">
      <FiEdit className="text-gray-700 w-4 h-4" />
    </div>
  </button>
</div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {userData?.firstName} {userData?.lastName}{" "}
                      <VerificationBadge
                        verified={localProfileInfo?.identityVerified}
                        text={
                          localProfileInfo?.identityVerified
                            ? "Verified"
                            : "Pending"
                        }
                      />
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="inline-flex items-center px-4 py-2 border rounded-lg hover:opacity-90 transition-all shadow-sm"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      backgroundColor: `${primaryColor}08`,
                    }}
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2 text-gray-500" />
                    <span>{userData?.email}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-2 text-gray-500" />
                    <span>{userData?.phoneNumber}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-gray-500" />
                    <span>Joined {formatDate(userData?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!localProfileInfo?.profileCompleted? (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-5 w-5 text-amber-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-amber-800">
                    Your profile is incomplete. Please complete your profile to
                    access all features.
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowProfileForm(true)}
                      className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-600 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Complete Profile Now
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>

              <VerificationBadge
                verified={localProfileInfo?.profileCompleted}
                text={
                  localProfileInfo?.profileCompleted
                    ? "Complete"
                    : "Incomplete"
                }
              />
            </div>
          )}
        </div>

        {/* Personal Details Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between gap-5">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <FaUser className="text-gray-700" />
              Personal Details
            </h2>
            <button
              onClick={() => setDialogOpenEdit(true)}
              className="inline-flex items-center px-4 py-2 shadow-sm border-gray-500 rounded-lg hover:opacity-90 transition-all "
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: `${primaryColor}08`,
              }}
            >
              <FiEdit className="w-6 h-6 mr-2" />
              Edit
            </button>
          </div>

          <div className="divide-y divide-gray-300">
            <div className="p-6">
              <button
                onClick={() => toggleSection("basicInfo")}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  Basic Information
                </h3>
                {expandedSections.basicInfo ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>

              {expandedSections.basicInfo && (
                <div className="mt-4 space-y-3 pl-8">
                  <InfoField
                    icon={<FaBirthdayCake className="text-gray-500" />}
                    label="Date of Birth"
                    value={formatDob(localProfileInfo?.dateOfBirth)}
                  />
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="p-6">
              <button
                onClick={() => toggleSection("addressInfo")}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  Address Information
                </h3>
                {expandedSections.addressInfo ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>

              {expandedSections.addressInfo && (
                <div className="mt-4 space-y-3 pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="Country"
                      value={
                        localProfileInfo?.address?.country ||
                        "Not provided"
                      }
                    />
                    <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="City"
                      value={
                        localProfileInfo?.address?.city || "Not provided"
                      }
                    />
                    <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="State"
                      value={
                        localProfileInfo?.address?.state || "Not provided"
                      }
                    />
                    <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="Zone"
                      value={
                        localProfileInfo?.address?.zone ||
                        "Not provided"
                      }
                    />
                    <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="Wereda"
                      value={
                        localProfileInfo?.address?.wereda ||
                        "Not provided"
                      }
                    />
                     <InfoField
                      icon={<FaMapMarkerAlt className="text-gray-500" />}
                      label="Po Box."
                      value={
                        localProfileInfo?.address?.poBox ||
                        "Not provided"
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Identification */}
            <div className="p-6">
              <button
                onClick={() => toggleSection("identification")}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <FaIdCard className="text-gray-500" />
                  Identification
                </h3>
                {expandedSections.identification ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>

              {expandedSections.identification && (
                <div className="mt-4 space-y-3 pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField
                      icon={<FaIdCard className="text-gray-500" />}
                      label="ID Type"
                      value={localProfileInfo?.idType || "Not provided"}
                    />
                    <InfoField
                      icon={<FaIdCard className="text-gray-500" />}
                      label="ID Number"
                      value={localProfileInfo?.idNumber || "Not provided"}
                      secure
                    />
                    <InfoField
                      icon={<FaCheckCircle className="text-gray-500" />}
                      label="Verification Status"
                      value={
                        localProfileInfo?.identityVerified
                          ? "Verified"
                          : "Pending Verification"
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="p-2">
              <button
                onClick={() => toggleSection("documents")}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <FaIdCard className="text-gray-500" />
                  Documents
                </h3>
                {expandedSections.documents ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>

              {expandedSections.documents && (
  <div className="mt-4 pl-8">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Profile Photo */}
      <div className="flex-1">
      <h3 className="font-medium text-gray-700 mb-3">ID Documents Back Pages </h3>
      <DocumentViewer
            title={`${localProfileInfo?.idType || "ID"} Back`}
            imageUrl={localProfileInfo?.idBackPhoto}
            primaryColor={primaryColor}
          />
      </div>
      <div className="flex-1">
      <h3 className="font-medium text-gray-700 mb-3">ID Documents front Pages </h3>
      <DocumentViewer
            title={`${localProfileInfo?.idType || "ID"} Front`}
            imageUrl={localProfileInfo?.idFrontPhoto}
            primaryColor={primaryColor}
          />
      </div>



    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {activeDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">
                {activeDocument === "profile"
                  ? "Profile Photo"
                  : activeDocument === "front"
                  ? `${localProfileInfo?.idType || "ID"} Front`
                  : `${localProfileInfo?.idType || "ID"} Back`}
              </h3>
              <button
                onClick={() => setActiveDocument(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 flex justify-center bg-gray-50">
              <img
                src={
                  activeDocument === "profile"
                    ? localProfileInfo?.profilePhoto
                    : activeDocument === "front"
                    ? localProfileInfo?.idFrontPhoto
                    : localProfileInfo?.idBackPhoto
                }
                alt="Document"
                className="max-w-full max-h-[65vh] object-contain rounded-md shadow-sm border border-gray-200"
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                onClick={() => setActiveDocument(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                style={{ backgroundColor: primaryColor, color: "white" }}
                onClick={() =>
                  window.open(
                    activeDocument === "profile"
                      ? localProfileInfo?.profilePhoto
                      : activeDocument === "front"
                      ? localProfileInfo?.idFrontPhoto
                      : localProfileInfo?.idBackPhoto,
                    "_blank"
                  )
                }
              >
                <FiDownload className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileFormModal
        userId={userId}
          profileData={localProfileInfo}
          onSubmit={handleProfileSubmit}
          onClose={() => setShowProfileForm(false)}
          primaryColor={primaryColor}
        />
      )}

      <EditUserDialog
        userId={userId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={userData}
        primaryColor={primaryColor}
      />
   {dialogOpenedit && (
        <ProfileFormModal
        userId={userId}
          profileData={localProfileInfo}
          onSubmit={handleProfileSubmit}
          onClose={() => setDialogOpenEdit(false)}
          primaryColor={primaryColor}
        />
      )}
    </>
  );
};

export default OverviewTab;
