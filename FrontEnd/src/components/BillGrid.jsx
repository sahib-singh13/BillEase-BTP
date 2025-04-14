// src/components/BillGrid.jsx
import React from 'react';
import { FaImage } from 'react-icons/fa'; // Icon for placeholder

const BillGrid = ({ bills, isLoading, error, onBillClick }) => {

  if (isLoading) {
    // Enhanced Loading State
    return (
        <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
            <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium">Loading Bills...</p>
        </div>
    );
  }

  if (error) {
    // Enhanced Error State
    return (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
            <p className="text-lg font-semibold text-red-700 mb-1">Oops! Something went wrong.</p>
            <p className="text-sm text-red-600">{error}</p>
            {/* Optionally add a retry button here */}
        </div>
     );
  }

  if (!bills || bills.length === 0) {
     // Enhanced Empty State
    return (
        <div className="text-center p-16 border-2 border-dashed border-gray-300 rounded-xl max-w-lg mx-auto bg-white">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-800">No bills found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new bill.</p>
             {/* You could potentially trigger the AddBillModal from here too */}
        </div>
    );
  }

  // Handle click on a bill card (no change)
  const handleCardClick = (bill) => {
    if (onBillClick) { onBillClick(bill); }
  };

  return (
    // Adjusted grid gaps
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10 max-w-7xl mx-auto">
      {bills.map((bill) => (
        <div
          key={bill._id}
          onClick={() => handleCardClick(bill)}
          // Enhanced Card Styling
          className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:border-orange-300/70 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleCardClick(bill)}
        >
          {/* Image or Placeholder Area - Increased Height */}
          {bill.billImageUrl ? (
            <div className="w-full h-72 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-2"> {/* Increased height */}
              <img
                src={bill.billImageUrl}
                alt={`Bill for ${bill.billName}`}
                className="max-w-full max-h-full object-contain block rounded-sm" // Added rounded-sm
                loading="lazy"
              />
            </div>
          ) : (
            // Enhanced Placeholder
            <div className="w-full h-72 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100/80 border-b border-orange-200/50 text-orange-400/80 p-4"> {/* Increased height & gradient */}
              <FaImage className="w-16 h-16 mb-2 opacity-60" /> {/* Larger Icon */}
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}
          {/* Bill Info Section - Enhanced Styling */}
          <div className="p-5 text-center border-t border-gray-100 bg-white">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate group-hover:text-orange-600 transition-colors" title={bill.billName}>
              {bill.billName}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(bill.purchaseDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillGrid;