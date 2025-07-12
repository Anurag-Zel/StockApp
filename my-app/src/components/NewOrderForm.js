import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import Loader from "./Loader";
import { encryptWithPublicKey } from "../utils/encryption";

const NewOrderForm = ({ isOpen, closeModal, updatePendingOrders }) => {
  const [buyer_qty, setBuyer_qty] = useState("");
  const [buyer_price, setBuyer_price] = useState("");
  const [seller_price, setSeller_price] = useState("");
  const [seller_qty, setSeller_qty] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
  const fetchPublicKey = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/orders/publicKey`);
      setPublicKey(response.data);
    } catch (err) {
      console.error("Failed to fetch public key", err);
    }
  };
  fetchPublicKey();
  },[]);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      if (!publicKey) {
        throw new Error("Public key not loaded");
      }
      
      const orderData =
        role === "buyer"
          ? { buyer_qty, buyer_price }
          : { seller_qty, seller_price };
      const endpoint =
        role === "buyer"
          ? `${config.apiUrl}/orders/addNewBuyer`
          : `${config.apiUrl}/orders/addNewSeller`;

      const encryptedData = await encryptWithPublicKey(publicKey, orderData);
      console.log("Encrypted Data:", encryptedData);
      console.log("UnEncryption:", orderData);

      const res = await axios.post(endpoint, {encryptedData});
      // const res = await axios.post(endpoint, orderData);
      console.log("response:", res);
      // Call the updatePendingOrders function passed from the parent component
      updatePendingOrders(res.data); // Assuming the response data is the newly placed order
    } catch (error) {
      console.error("Error creating new order:", error);
    }
    setLoading(false);
    e.preventDefault();
    setBuyer_qty("");
    setBuyer_price("");
    setSeller_price("");
    setSeller_qty("");
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="fixed inset-0 flex items-center justify-center z-10"
        >
          <div className="bg-white p-6 rounded-md shadow-md w-[500px] ">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
              <div
                className="text-gray-700 text-2xl font-semibold cursor-pointer"
                onClick={closeModal}
              >
                X
              </div>
            </div>

            <div className="flex items-center">
              <button
                className={`mr-4 px-3 py-1 rounded font-semibold ${
                  role === "buyer"
                    ? "bg-blue-100 text-green-600"
                    : "bg-gray-100  text-green-600"
                }`}
                onClick={() => setRole("buyer")}
              >
                Buyer
              </button>
              <button
                className={`px-3 py-1 rounded  font-semibold ${
                  role === "seller"
                    ? "bg-blue-100 text-red-600"
                    : "bg-gray-100 text-red-600"
                }`}
                onClick={() => setRole("seller")}
              >
                Seller
              </button>
            </div>

            {role === "buyer" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Buyer Qty
                  </label>
                  <input
                    type="number"
                    value={buyer_qty}
                    onChange={(e) => setBuyer_qty(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Buyer Price
                  </label>
                  <input
                    type="number"
                    value={buyer_price}
                    onChange={(e) => setBuyer_price(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {role === "seller" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Seller Qty
                  </label>
                  <input
                    type="number"
                    value={seller_qty}
                    onChange={(e) => setSeller_qty(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Seller Price
                  </label>
                  <input
                    type="number"
                    value={seller_price}
                    onChange={(e) => setSeller_price(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            <div className="flex flex-row justify-center space-x-8">
              <button
                type="submit"
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                disabled={loading}
              >
                Place Order
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewOrderForm;
