import { FiPlus } from "react-icons/fi";

const SavingsTab = ({ userData, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Savings Accounts</h2>
        <div className="space-y-4">
          {userData.accounts
            .filter((a) => a.type === "savings")
            .map((account) => (
              <div
                key={account.id}
                className="border rounded-lg p-4 hover:border-green-500 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Premium Savings</p>
                    <p className="text-sm text-gray-500">
                      •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <p className="text-green-600 font-bold">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">APY</p>
                    <p className="font-medium">{account.apy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Interest Earned</p>
                    <p className="font-medium">
                      {formatCurrency(
                        (account.balance * account.apy) / 100 / 12
                      )}
                      /mo
                    </p>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Add Funds
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <button className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Open New Savings Account
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Savings Goals</h2>
        <div className="border rounded-lg p-4 hover:border-green-500 transition">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Emergency Fund</p>
              <p className="text-sm text-gray-500">
                Target: {formatCurrency(10000)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-bold">
                {formatCurrency(8200)}
              </p>
              <p className="text-sm text-gray-500">82% complete</p>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: "82%" }}
            ></div>
          </div>
        </div>
        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:text-green-500 transition flex items-center justify-center">
          <FiPlus className="mr-2" />
          Create New Goal
        </button>
      </div>
    </div>
  );
};

export default SavingsTab;