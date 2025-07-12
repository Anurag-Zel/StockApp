import React, { useState } from "react";

import PendingOrdersTable from "./components/PendingOrdersTable";

import NewOrderForm from "./components/NewOrderForm";

import CompletedOrdersTable from "./components/CompletedOrdersTable";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Order Matching System</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
          onClick={openModal}
        >
          Create New Order
        </button>
      </div>

      {isModalOpen && (
        <NewOrderForm
          closeModal={closeModal}
          isOpen={isModalOpen}
          className="mb-8"
        />
      )}
      <div className="flex flex-col justify-between">
        <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
        <PendingOrdersTable className="mb-8" />
        <h2 className="text-2xl font-bold mb-4">Complete Orders</h2>
        <CompletedOrdersTable />
      </div>
    </div>
  );
};

export default Home;
