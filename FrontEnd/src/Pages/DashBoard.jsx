import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddBillModal from '../components/AddBillModal';
const DashBoard = () => {
  const [showAddBillModal, setShowAddBillModal] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-orange-50 relative">
      {/* Bills Button */}
      <div className="w-full max-w-4xl mt-8 flex justify-center">
        <button
          className="bg-orange-500 text-white rounded-full px-6 py-3 hover:bg-orange-600 transition-colors duration-300 focus:outline-none"
          onClick={() => console.log("Bills button clicked")}
        >
          Bills
        </button>
      </div>

      {/* Add Button */}
      <button
        className="absolute bottom-8 right-8 bg-orange-500 text-white rounded-full shadow-md p-3 hover:bg-orange-600 transition-colors duration-300"
        onClick={() => setShowAddBillModal(true)}
        aria-label="Add New Bill"
      >
        <FaPlus className="h-5 w-5" />
      </button>

      {showAddBillModal && (
        <AddBillModal onClose={() => setShowAddBillModal(false)} />
      )}
    </div>
  );
};

export default DashBoard;