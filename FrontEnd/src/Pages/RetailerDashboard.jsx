import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddBillModal from '../components/AddBillModal';

const DashBoard = () => {
  const [showAddBillModal, setShowAddBillModal] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 relative font-sans">
      {/* Header */}
      <header className="w-full max-w-4xl mt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Manage your bills and analytics here.</p>
      </header>

      {/* Buttons Section */}
      <div className="w-full max-w-4xl mt-8 space-y-4">
        <button
          className="w-full bg-orange-500 text-white rounded-lg px-6 py-3 hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          onClick={() => console.log("Current Bill button clicked")}
        >
          Current Bill
        </button>
        <button
          className="w-full bg-orange-500 text-white rounded-lg px-6 py-3 hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          onClick={() => console.log("Past Bills button clicked")}
        >
          Past Bills
        </button>
        <button
          className="w-full bg-orange-500 text-white rounded-lg px-6 py-3 hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          onClick={() => console.log("Analytics button clicked")}
        >
          Analytics
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        className="absolute bottom-8 right-8 bg-orange-500 text-white rounded-full shadow-md p-3 hover:bg-orange-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        onClick={() => setShowAddBillModal(true)}
        aria-label="Add New Bill"
      >
        <FaPlus className="h-5 w-5" />
      </button>

      {/* Modal */}
      {showAddBillModal && (
        <AddBillModal onClose={() => setShowAddBillModal(false)} />
      )}
    </div>
  );
};

export default DashBoard;