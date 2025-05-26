import { FiPlus } from "react-icons/fi";

const WishlistTab = ({ userData, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
        <div className="space-y-4">
          {userData.wishlist.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:border-pink-500 transition"
            >
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Product ID: {item.productId}
                  </p>
                  <div className="flex mt-1 text-sm">
                    <p className="text-gray-500 mr-3">Color: {item.color}</p>
                    <p className="text-gray-500">Size: {item.size}</p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-pink-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                  Buy Now
                </button>
                <button className="flex-1 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:text-pink-500 transition flex items-center justify-center">
          <FiPlus className="mr-2" />
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default WishlistTab;