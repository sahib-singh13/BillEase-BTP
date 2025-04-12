// src/pages/Dashboard.js (or wherever your main view is)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import AddBillModal from '../components/AddBillModal';
import BillGrid from '../components/BillGrid'; // Import the Tailwind BillGrid

// Define the API URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch bills from the backend
  const fetchBills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed - requires backend setup from previous step
      const response = await axios.get(`${API_BASE_URL}/getBills`);

      if (response.data && Array.isArray(response.data)) {
         // Sort bills by date (newest first) before setting state
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bills when the component mounts
  useEffect(() => {
    fetchBills();
  }, []);

  // Function to handle adding a new bill to the state
  const handleBillAdded = (newBill) => {
    console.log("New bill added, updating state:", newBill);
    // Add the new bill to the beginning of the existing bills array
    setBills(prevBills => [newBill, ...prevBills]);
    // No need to close modal here if AddBillModal closes itself on success
  };

  return (
    // Main container with padding
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">My Bills</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-md inline-flex items-center transition-colors shadow-sm"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add New Bill
        </button>
      </header>

      {/* Bill Grid Display Area */}
      <main>
        <BillGrid bills={bills} isLoading={isLoading} error={error} />
      </main>

      {/* Modal Render */}
      {isModalOpen && (
        <AddBillModal
          onClose={() => setIsModalOpen(false)}
          onBillAdded={handleBillAdded} // Pass the handler function
        />
      )}
    </div>
  );
};

export default Dashboard;