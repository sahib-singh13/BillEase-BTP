// src/Pages/DashBoard.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Components
import AddBillModal from '../components/AddBillModal';
import BillGrid from '../components/BillGrid';
import BillDetailModal from '../components/BillDetailModal';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have this for loading state

// Services & Context
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // --- State Variables ---
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [bills, setBills] = useState([]); // Holds the original list of bills from the API
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controls AddBillModal visibility
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Controls BillDetailModal visibility
  const [selectedBill, setSelectedBill] = useState(null); // Holds the bill selected for detail view/edit
  const [isPageLoaded, setIsPageLoaded] = useState(false); // Controls initial page fade-in animation
  const [searchTerm, setSearchTerm] = useState(''); // Holds the current search input value

  // --- Effects ---

  // Effect for initial page fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100); // Short delay for CSS transition
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Effect to fetch bills when the component mounts or authentication status changes
  // Use useCallback to memoize fetchBills function
  const fetchBills = useCallback(async () => {
    // Only fetch bills if the user is authenticated
    if (!isAuthenticated) {
      setError("Please login to view bills."); // Set an error message
      setBills([]); // Ensure bills are cleared if not authenticated
      return;
    }

    setIsLoading(true); // Set loading state for API call
    setError(null); // Clear previous errors
    try {
      // Use the configured 'api' instance (handles base URL and auth token)
      const response = await api.get('/bills/getBills'); // Relative path to the endpoint

      // Validate the response structure from the backend
      if (response.data && response.data.success && Array.isArray(response.data.bills)) {
        // Sort bills by creation date (newest first) and update state
        const sortedBills = response.data.bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBills(sortedBills); // Store the original full list
      } else {
        // Handle unexpected response format
        console.error("Unexpected response format:", response.data);
        setBills([]); // Clear bills state
        setError(response.data?.message || "Received invalid data format from server.");
      }
    } catch (err) {
      // Handle API call errors
      console.error("Error fetching bills:", err);
      const message = err.response?.data?.message || err.message || 'Failed to fetch bills';
      setError(message); // Set error message for display
      setBills([]); // Clear bills on error

      // Specifically handle unauthorized errors (e.g., expired token)
      if (err.response?.status === 401) {
        setError("Session expired or invalid. Please login again.");
        // Consider triggering logout from context here if interceptor doesn't handle it
        // logout();
      }
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  }, [isAuthenticated]); // Dependency: re-run fetchBills if authentication status changes

  // Trigger fetchBills when the component mounts or fetchBills function updates
  useEffect(() => {
    fetchBills();
  }, [fetchBills]); // fetchBills is now stable due to useCallback

  // --- Filtering Logic ---
  // Use useMemo to efficiently recalculate the filtered list only when necessary
  const filteredBills = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    // If no search term, return the complete original list
    if (!lowerCaseSearchTerm) {
      return bills;
    }

    // Filter the original 'bills' array based on the search term
    return bills.filter(bill => {
      // Check if search term is in billName (case-insensitive)
      const billNameMatch = bill.billName?.toLowerCase().includes(lowerCaseSearchTerm);
      // Check if search term is in shopName (case-insensitive)
      const shopNameMatch = bill.shopName?.toLowerCase().includes(lowerCaseSearchTerm);
      // Check if search term is in any of the item names (case-insensitive)
      const itemMatch = bill.items?.some(item =>
        item.itemName?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      // Return true if the search term matches any of the checked fields
      return billNameMatch || shopNameMatch || itemMatch;
    });
  }, [bills, searchTerm]); // Dependencies: recalculate only if 'bills' or 'searchTerm' changes

  // --- Modal and Bill Action Handlers ---

  // Called when a new bill is successfully added via AddBillModal
  const handleBillAdded = (newBill) => {
    // Add to the original 'bills' state; sorting ensures newest is first
    setBills(prevBills => [newBill, ...prevBills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    toast.success('Bill added successfully!'); // User feedback
    // AddBillModal should close itself upon successful submission
  };

  // Called when a bill card in BillGrid is clicked
  const handleBillClick = (bill) => {
    setSelectedBill(bill); // Set the selected bill for the detail modal
    setIsDetailModalOpen(true); // Open the detail modal
  };

  // Called to close the BillDetailModal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    // Delay clearing selectedBill to allow for modal closing animation
    setTimeout(() => setSelectedBill(null), 300);
  };

  // Called when a bill is successfully updated via BillDetailModal
  const handleBillUpdate = (updatedBill) => {
    // Update the original 'bills' state by replacing the old version with the updated one
    setBills(prevBills =>
      prevBills.map(bill => (bill._id === updatedBill._id ? updatedBill : bill))
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Re-sort just in case
    );
    toast.success('Bill updated successfully!'); // User feedback
    // Detail modal should close itself on successful update
  };

  // Called when a bill is successfully deleted via BillDetailModal
  const handleBillDelete = (deletedBillId) => {
    // Update the original 'bills' state by filtering out the deleted bill
    setBills(prevBills => prevBills.filter(bill => bill._id !== deletedBillId));
    toast.success('Bill deleted successfully.'); // User feedback
    // Detail modal should close itself on successful delete
  };

  // --- Styling Classes ---
  const addButtonClass = `px-6 py-3 rounded-lg inline-flex items-center justify-center font-semibold text-base text-white tracking-wide bg-gradient-to-r from-orange-500 to-orange-600 shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`;
  // Search input fills the width of its container (max-w-2xl)
  const searchInputClass = "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-sm placeholder-gray-400 hover:bg-gray-50/50 disabled:opacity-50";

  // --- Render Logic ---
  return (
    // Main container with background gradient and relative positioning for shapes
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 relative">

      {/* Background Shape Animation Container */}
      <div className="shape-container absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`shape rounded-lg ${
                i % 3 === 0 ? 'bg-orange-300/40' : i % 3 === 1 ? 'bg-amber-300/40' : 'bg-orange-200/40'
              }`}
              style={{
                '--size': `${Math.random() * 70 + 15}px`,
                '--delay': `${Math.random() * -25}s`,
                '--duration': `${Math.random() * 20 + 20}s`,
                '--x-start': `${Math.random() * 100}%`,
                '--y-start': `${Math.random() * 100}%`,
                left: `var(--x-start)`,
                top: `var(--y-start)`,
                animation: `moveShape var(--duration) linear var(--delay) infinite`,
              }}
            ></div>
          ))}
      </div>

      {/* Main Content Wrapper (above shapes, includes fade-in animation) */}
      <div className={`relative z-10 flex-grow flex flex-col transition-opacity duration-700 ease-in ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Dashboard Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-5 border-b border-gray-200/80 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight text-center sm:text-left">
            My Bills <span className="text-orange-600">Dashboard</span>
          </h1>
          {/* Add New Bill Button - disabled if not authenticated */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={addButtonClass}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Please login to add bills" : "Add a new bill"}
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add New Bill
          </button>
        </header>

        {/* Search Bar Section - Centered with increased max-width */}
        <div className="mb-8 flex justify-center px-4 sm:px-0"> {/* Added padding for smaller screens */}
           <div className="relative w-full max-w-2xl"> {/* Increased max-width */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                     <FaSearch className="h-4 w-4 text-gray-400" />
                 </div>
                 <input
                     type="search"
                     aria-label="Search bills"
                     placeholder="Search bills by name, shop, or item..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className={searchInputClass} // Input takes full width of its container
                     // Disable search while loading or if not authenticated
                     disabled={!isAuthenticated || isLoading}
                 />
           </div>
        </div>

        {/* Bill Grid Display Area */}
        <main className="flex-grow">
          {/* Display loading spinner */}
          {isLoading && <div className="text-center py-10"><LoadingSpinner /></div>}

          {/* Display error message */}
          {!isLoading && error && (
             <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
                 <p className="text-base font-semibold text-red-700 mb-1">Could not load bills</p>
                 <p className="text-sm text-red-600">{error}</p>
                 {/* Optionally add a retry button */}
                 <button onClick={fetchBills} className="mt-4 px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Retry</button>
             </div>
          )}

          {/* Display Bill Grid if not loading and no error */}
          {!isLoading && !error && isAuthenticated && (
              <BillGrid
                 bills={filteredBills} // Pass the filtered list
                 isLoading={false} // Explicitly false as we handled loading above
                 error={null}      // Explicitly null as we handled error above
                 onBillClick={handleBillClick}
              />
          )}

          {/* Message: No search results found */}
          {!isLoading && !error && isAuthenticated && bills.length > 0 && filteredBills.length === 0 && searchTerm && ( // Added check for searchTerm
                <div className="text-center py-10 px-4 mt-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner border border-gray-200/50">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-base font-medium text-gray-800">No bills found matching "{searchTerm}"</h3>
                    <p className="mt-1 text-sm text-gray-500">Try searching for something else or clear the search.</p>
                     <button onClick={()=> setSearchTerm('')} className="mt-4 px-4 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition">Clear Search</button>
                </div>
          )}

           {/* Message: No bills added yet */}
           {!isLoading && !error && isAuthenticated && bills.length === 0 && ( // Only show if bills array is empty
             <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner border border-gray-200/50">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-800">No bills yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first bill.</p>
                <div className="mt-6">
                  <button onClick={() => setIsAddModalOpen(true)} className={addButtonClass} disabled={!isAuthenticated} >
                    <FaPlus className="mr-2 h-4 w-4" /> Add First Bill
                  </button>
                </div>
              </div>
           )}

            {/* Message: Not Authenticated (if error isn't already showing this) */}
            {!isAuthenticated && !error && (
                <div className="text-center py-16 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">Please log in to manage your bills.</p>
                    {/* You might want to add a login button here */}
                </div>
            )}
        </main>
      </div>

      {/* Modals - Rendered outside main flow, only when needed and authenticated */}
      {isAddModalOpen && isAuthenticated && (
        <AddBillModal
          isOpen={isAddModalOpen} // Pass isOpen prop if modal uses it for animation
          onClose={() => setIsAddModalOpen(false)}
          onBillAdded={handleBillAdded}
        />
      )}

      {selectedBill && isAuthenticated && (
        <BillDetailModal
          isOpen={isDetailModalOpen}
          bill={selectedBill}
          onClose={handleCloseDetailModal}
          onUpdate={handleBillUpdate}
          onDelete={handleBillDelete}
        />
       )}

      {/* Global Styles for Shape Animation */}
      <style jsx global>{`
        @keyframes moveShape {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
          25% { opacity: 0.7; }
          50% { opacity: 0.4; }
          75% { opacity: 0.8; }
          100% {
            transform: translate(
                calc((${Math.random()} - 0.5) * 2 * 150vw),
                calc((${Math.random()} - 0.5) * 2 * 150vh)
            ) rotate(calc((${Math.random()} - 0.5) * 720deg));
            opacity: 0.5;
          }
        }
        .shape-container {}
        .shape {
          position: absolute; display: block;
          width: var(--size); height: var(--size);
          will-change: transform, opacity;
        }
        /* Optional: Add a custom scrollbar for the main page if needed */
        /* body { scrollbar-width: thin; scrollbar-color: #fdba74 #f1f1f1; }
        body::-webkit-scrollbar { width: 8px; }
        body::-webkit-scrollbar-track { background: #f1f1f1; }
        body::-webkit-scrollbar-thumb { background-color: #fdba74; border-radius: 10px; border: 2px solid #f1f1f1; } */
      `}</style>
    </div>
  );
};

export default Dashboard;