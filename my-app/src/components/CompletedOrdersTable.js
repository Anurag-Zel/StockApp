import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config/config";

const CompletedOrdersTable = () => {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const completedOrderResponse = await axios.get(
          // `${config.apiUrl}/orders/completed`
          `http://localhost:4000/orders/completed`
        );
        setCompletedOrders(completedOrderResponse.data);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        // Handle error, such as displaying an error message to the user
      }
    };

    // Fetch data initially
    fetchCompletedOrders();

    // Set up an interval to fetch data periodically
    const interval = setInterval(fetchCompletedOrders, 5000); // Fetch every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);
 
  console.log('Completed Orders: data kya h ', completedOrders);
  return (
    <div>
    <div className="overflow-y-auto border border-gray-200 rounded-lg shadow-md h-[20rem]">
      <h2 className="px-4 py-2 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
        Completed Orders
      </h2>
      <div >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="bg-slate-300">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
            </tr>
          </thead>
        </table>
        <div className=" h-[calc(100%-2.5rem)]"> {/* Adjust height for the scrollable body */}
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {completedOrders?.map((order, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap  text-left">{order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">{order.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CompletedOrdersTable;
