// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast'; // Make sure toast is imported if used, otherwise remove
import AddBillModal from '../components/AddBillModal';
import BillGrid from '../components/BillGrid';
import BillDetailModal from '../components/BillDetailModal';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Keep isLoading for grid/data fetching
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // For initial fade-in effect

  // Initial fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100); // Short delay for transition
    return () => clearTimeout(timer);
  }, []);


  // --- Fetching and handler functions remain the same ---
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
      // Use toast for user feedback if installed and configured
      // toast.error(err.response?.data?.message || err.message || 'Failed to fetch bills');
      setError(err.response?.data?.message || err.message || 'Failed to fetch bills');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchBills(); }, []);

  const handleBillAdded = (newBill) => {
    setBills(prevBills => [newBill, ...prevBills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    // Optionally show success toast
    // toast.success('Bill added successfully!');
  };

  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedBill(null), 300); // Keep the delay for modal animation
  };

  const handleBillUpdate = (updatedBill) => {
    setBills(prevBills =>
      prevBills.map(bill => (bill._id === updatedBill._id ? updatedBill : bill))
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
     // Optionally show success toast
    // toast.success('Bill updated!');
  };

  const handleBillDelete = (deletedBillId) => {
    setBills(prevBills => prevBills.filter(bill => bill._id !== deletedBillId));
     // Optionally show success toast
    // toast.success('Bill deleted.');
  };
  // --- End of handlers ---


  // Refined button style inspired by UserType.js but adapted for single button
   const addButtonClass = `
    px-6 py-3 rounded-lg inline-flex items-center justify-center
    font-semibold text-base text-white tracking-wide
    bg-gradient-to-r from-orange-500 to-orange-600
    shadow-md hover:shadow-lg active:shadow-sm
    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50
    transition-all duration-300 ease-in-out
    transform hover:scale-[1.03] active:scale-[0.98]
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`;

  return (
    // --- Main Container with Gradient and Relative Positioning for Shapes ---
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 relative"> {/* Updated Gradient + Relative */}

       {/* Shape Animation Container (Copied from UserType.js) */}
      <div className="shape-container absolute inset-0 z-0 overflow-hidden pointer-events-none"> {/* pointer-events-none is often useful */}
          {[...Array(12)].map((_, i) => ( // Increased shape count slightly
            <div
              key={i}
              // Slightly softer/varied orange shapes
              className={`shape rounded-lg ${
                i % 3 === 0 ? 'bg-orange-300/40' : i % 3 === 1 ? 'bg-amber-300/40' : 'bg-orange-200/40'
              }`}
              style={{
                '--size': `${Math.random() * 70 + 15}px`, // Adjusted size range (15px to 85px)
                '--delay': `${Math.random() * -25}s`,     // Increased negative delay range
                '--duration': `${Math.random() * 20 + 20}s`, // Increased duration range (20s to 40s)
                '--x-start': `${Math.random() * 100}%`,
                '--y-start': `${Math.random() * 100}%`,
                left: `var(--x-start)`,
                top: `var(--y-start)`,
                animation: `moveShape var(--duration) linear var(--delay) infinite`,
              }}
            ></div>
          ))}
      </div>

      {/* Content wrapper - Add z-10 to stay above shapes and fade-in effect */}
      <div className={`relative z-10 flex-grow flex flex-col transition-opacity duration-700 ease-in ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header section: Enhanced styling */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-gray-200/80">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">
            My Bills <span className="text-orange-600">Dashboard</span>
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={addButtonClass} // Apply the refined button class
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add New Bill
          </button>
        </header>

        {/* Bill Grid Display Area */}
        {/* Added flex-grow to allow the grid to take available space if needed */}
        <main className="flex-grow">
          <BillGrid
             bills={bills}
             isLoading={isLoading} // Pass loading state to grid
             error={error}       // Pass error state to grid
             onBillClick={handleBillClick}
          />
           {/* You might want to show a message if there are no bills and it's not loading */}
           {!isLoading && !error && bills.length === 0 && (
             <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner border border-gray-200/50">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-800">No bills yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first bill.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={addButtonClass} // Reuse button style
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Add First Bill
                  </button>
                </div>
              </div>
           )}
        </main>
      </div> {/* End of z-10 Content Wrapper */}

      {/* Modals (Render outside the main z-10 flow, they usually handle their own z-index) */}
      {/* Ensure these modals have a high z-index (e.g., z-50) internally */}
      {isAddModalOpen && (
        <AddBillModal
          onClose={() => setIsAddModalOpen(false)}
          onBillAdded={handleBillAdded}
        />
      )}

      <BillDetailModal
        isOpen={isDetailModalOpen}
        bill={selectedBill}
        onClose={handleCloseDetailModal}
        onUpdate={handleBillUpdate}
        onDelete={handleBillDelete}
      />

      {/* Global Styles for Shape Animation (Copied from UserType.js) */}
      {/* Using <style jsx global> requires Next.js or a similar setup. */}
      {/* If using standard CRA, put this in your src/index.css */}
      <style jsx global>{`
        @keyframes moveShape {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.5; /* Start slightly more visible */
          }
          25% {
             opacity: 0.7;
          }
          50% {
             opacity: 0.4;
          }
          75% {
             opacity: 0.8; /* Brighter peak */
          }
          100% {
            transform: translate(
                calc((${Math.random()} - 0.5) * 2 * 150vw),
                calc((${Math.random()} - 0.5) * 2 * 150vh)
            ) rotate(calc((${Math.random()} - 0.5) * 720deg));
            opacity: 0.5;
          }
        }

        .shape-container {
          /* pointer-events: none; // uncomment if shapes interfere */
        }

        .shape {
          position: absolute;
          display: block;
          width: var(--size);
          height: var(--size);
          will-change: transform, opacity; /* Performance hint */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;