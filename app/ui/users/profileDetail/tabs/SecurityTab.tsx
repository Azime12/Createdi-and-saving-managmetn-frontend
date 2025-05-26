import { FiLock, FiShield, FiUser, FiSettings } from "react-icons/fi";

const SecurityTab = ({ userData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Security Settings</h2>

        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <FiLock className="mr-2 text-blue-500" />
              Password
            </h3>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Change Password
            </button>
          </div>

          <div className="border-b pb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <FiShield className="mr-2 text-green-500" />
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {userData.isVerified ? "Enabled" : "Disabled"}
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                {userData.isVerified ? "Manage" : "Enable"}
              </button>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <FiUser className="mr-2 text-purple-500" />
              Identity Verification
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">KYC Verification</p>
                  <p className="text-sm text-gray-500">
                    {userData.profile.kycVerified
                      ? "Verified"
                      : "Not Verified"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.profile.kycVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {userData.profile.kycVerified ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Manual Verification</p>
                  <p className="text-sm text-gray-500">
                    {userData.profile.manualVerified
                      ? "Verified by admin"
                      : "Pending review"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.profile.manualVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {userData.profile.manualVerified ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <FiSettings className="mr-2 text-red-500" />
              Advanced
            </h3>
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;