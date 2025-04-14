// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AddBillModal from '../components/AddBillModal';
import BillGrid from '../components/BillGrid';
import BillDetailModal from '../components/BillDetailModal';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/getBills`);
      if (response.data && Array.isArray(response.data)) {
        const sortedBills = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBills(sortedBills);
      } else {
        console.error("Unexpected response format:", response.data);
        setBills([]);
        setError("Received invalid data format from server.");
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bills');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchBills(); }, []);

  const handleBillAdded = (newBill) => {
    setBills(prevBills => [newBill, ...prevBills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    // Add modal closes itself
  };

  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    // Delay clearing selectedBill until after modal fade-out (optional but smoother)
    setTimeout(() => setSelectedBill(null), 300);
  };

  const handleBillUpdate = (updatedBill) => {
    setBills(prevBills =>
      prevBills.map(bill => (bill._id === updatedBill._id ? updatedBill : bill))
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
    // Detail modal handles its own state after update
  };

  const handleBillDelete = (deletedBillId) => {
    setBills(prevBills => prevBills.filter(bill => bill._id !== deletedBillId));
    // Detail modal closes itself after delete
    // Ensure selected bill is cleared if modal doesn't close automatically
    // (It should via handleCloseAnimation in the latest modal code)
    // setSelectedBill(null);
  };

  // Base button class similar to modal for consistency
  const baseButtonClass = "px-5 py-2.5 rounded-lg inline-flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.03] hover:shadow-md";

  return (
    // Use a subtle gradient background
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-white p-4 sm:p-6 lg:p-8">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-5 border-b border-gray-200/80">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">
          My Bills
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          // Apply consistent button styling
          className={`${baseButtonClass} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 shadow-md hover:shadow-lg`}
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add New Bill
        </button>
      </header>

      {/* Bill Grid Display Area */}
      <main>
        <BillGrid
           bills={bills}
           isLoading={isLoading}
           error={error}
           onBillClick={handleBillClick}
        />
      </main>

      {/* Add Bill Modal Render */}
      {isAddModalOpen && (
        <AddBillModal
          // Consider adding isOpen prop if you want to control animation from here
          onClose={() => setIsAddModalOpen(false)}
          onBillAdded={handleBillAdded}
        />
      )}

      {/* Bill Detail Modal Render */}
      {/* isOpen controls the modal mounting and animation trigger */}
      <BillDetailModal
        isOpen={isDetailModalOpen}
        bill={selectedBill} // Pass selectedBill, modal won't render fully if null
        onClose={handleCloseDetailModal}
        onUpdate={handleBillUpdate}
        onDelete={handleBillDelete}
      />
    </div>
  );
};

export default Dashboard;