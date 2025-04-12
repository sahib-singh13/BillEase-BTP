import React, { useState } from 'react';
import { Search, Edit, Trash2, Award, X } from 'lucide-react';

const BillGrid = ({ bills = [], onDeleteBill = () => {} }) => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bills based on search query - with proper validation
  const filteredBills = Array.isArray(bills)
    ? bills.filter(
        (bill) =>
          bill.billName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.items?.some((item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotal = (items) => {
    if (!Array.isArray(items)) return '0.00';
    return items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0).toFixed(2);
  };

  return (
    <div className="w-screen min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-orange-600 text-center">Your Bills</h1>

        {/* Search Input */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bill name, shop name, or item..."
            className="w-full pl-10 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-700"
          />
        </div>

        {/* Bill Grid */}
        {filteredBills.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No bills found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedBill(bill)}
              >
                {bill.billImage ? (
                  <div className="h-64 overflow-hidden bg-gray-100">
                    <img
                      src={bill.billImage}
                      alt="Bill"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
                <div className="p-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">{bill.billName || 'Unnamed Bill'}</h2>
                  <p className="text-sm text-gray-500 mt-2">{bill.shopName || 'Unknown Shop'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pop-Up for Bill Details */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg relative overflow-hidden">
              <div className="bg-orange-50 p-6 border-b">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-sm"
                >
                  <X size={18} />
                </button>
                <h2 className="text-2xl font-bold text-orange-600 text-center">{selectedBill.billName || 'Unnamed Bill'}</h2>
                <p className="text-gray-600 text-center mt-2">{selectedBill.shopName || 'Unknown Shop'}</p>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div>
                    <h3 className="text-sm text-gray-500 uppercase">Date</h3>
                    <p className="text-gray-800 font-medium">{formatDate(selectedBill.date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 uppercase">Total Amount</h3>
                    <p className="text-orange-600 font-bold text-xl">
                      {calculateTotal(selectedBill.items)} Rs
                    </p>
                  </div>
                </div>

                <h3 className="text-md font-semibold text-gray-700 mb-3">Items:</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                  {Array.isArray(selectedBill.items) && selectedBill.items.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-600 text-sm border-b">
                          <th className="pb-2">Item</th>
                          <th className="pb-2 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 text-gray-800">{item.name || 'Unnamed Item'}</td>
                            <td className="py-2 text-right font-medium">{(Number(item.cost) || 0).toFixed(2)} Rs</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items found</p>
                  )}
                </div>

                {selectedBill.billImage && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={selectedBill.billImage}
                      alt="Bill"
                      className="max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Edit functionality not implemented yet.');
                    }}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof onDeleteBill === 'function') {
                        onDeleteBill(selectedBill.id);
                      }
                      setSelectedBill(null);
                    }}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Claim Warranty functionality not implemented yet.');
                    }}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    <Award size={16} />
                    <span>Claim Warranty</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillGrid;