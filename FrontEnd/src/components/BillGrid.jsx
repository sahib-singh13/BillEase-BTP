// src/components/BillGrid.jsx
import React from 'react';

const BillGrid = ({ bills, isLoading, error }) => {

  if (isLoading) {
    return <div className="text-center p-10 text-gray-600">Loading bills...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-medium">Error: {error}</div>;
  }

  if (!bills || bills.length === 0) {
    return <div className="text-center p-10 text-gray-500">No bills found. Click "Add New Bill" to get started!</div>;
  }

  return (
    // Grid container: Changed gap-6 to gap-8
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6 max-w-7xl mx-auto"> {/* Increased gap */}
      {bills.map((bill) => (
        // Bill Card: Precise orange border, slightly adjusted shadow/hover
        <div
          key={bill._id}
          className="bg-white rounded-md border border-orange-400 shadow-sm overflow-hidden flex flex-col transition duration-200 ease-in-out hover:shadow-lg hover:border-orange-500" // Orange border, adjusted rounding/shadow
        >
          {/* Image or Placeholder Area */}
          {bill.billImageUrl ? (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center overflow-hidden"> {/* Increased height, added container bg */}
              <img
                src={bill.billImageUrl}
                alt={`Bill for ${bill.billName}`}
                className="max-w-full max-h-full object-contain block" // Use object-contain to show full image
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-orange-50 border-b border-orange-200 text-orange-500 italic"> {/* Increased height, themed placeholder */}
              <span>No Image</span>
            </div>
          )}
          {/* Bill Info Section */}
          <div className="p-3 text-center border-t border-orange-100"> {/* Reduced padding, added top border */}
            <h3 className="font-semibold text-base text-gray-800 mb-0.5 truncate" title={bill.billName}> {/* Slightly smaller text */}
              {bill.billName}
            </h3>
            <p className="text-xs text-gray-600"> {/* Smaller date text */}
              {/* Format date as DD/MM/YYYY */}
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