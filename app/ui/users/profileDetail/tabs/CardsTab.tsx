import { FiPlus } from "react-icons/fi";

const CardsTab = ({ userData, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm opacity-80">VISA</p>
              <p className="text-xl font-medium tracking-wider">
                •••• •••• •••• {userData.cards[0].lastFour}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Balance</p>
              <p className="text-xl font-bold">
                {formatCurrency(userData.cards[0].balance)}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-80">Card Holder</p>
              <p className="font-medium">{userData.cards[0].cardHolder}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Expires</p>
              <p className="font-medium">{userData.cards[0].expiry}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm font-medium">Spending Limit</h3>
            <p className="text-xl font-bold mt-1">
              {formatCurrency(1000000)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Available Credit
            </h3>
            <p className="text-xl font-bold mt-1">
              {formatCurrency(1000000 - userData.cards[0].balance)}
            </p>
          </div>
        </div>

        <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition flex items-center justify-center">
          <FiPlus className="mr-2" />
          Add New Card
        </button>
      </div>
    </div>
  );
};

export default CardsTab;