// src/components/AddBillModal.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is imported
import { FaPlus, FaTimes, FaMinus } from 'react-icons/fa';

// Define the API URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

// Added onBillAdded prop to the function signature
const AddBillModal = ({ onClose, onBillAdded }) => {
  const [billName, setBillName] = useState('');
  const [shopName, setShopName] = useState('');
  const [date, setDate] = useState('');
  // Use itemName to match backend schema
  const [items, setItems] = useState([{ itemName: '', cost: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // State for loading and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Use this for form submission errors

  // Image preview logic
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAddItem = () => {
    setItems([...items, { itemName: '', cost: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'itemName' || field === 'cost') {
       newItems[index][field] = value;
       setItems(newItems);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
     if (file) {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.'); // Use the main error state
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setError(null); // Clear previous error
        setSelectedFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Frontend Validation Function
  const validateForm = () => {
    if (!billName.trim()) return "Bill Name is required.";
    if (!shopName.trim()) return "Shop Name is required.";
    if (!date) return "Date is required.";
    for (const item of items) {
      if (!item.itemName.trim()) return "All item names are required.";
      const costValue = parseFloat(item.cost);
      if (isNaN(costValue) || costValue < 0) {
        return "All item costs must be valid non-negative numbers.";
      }
    }
    return null; // No errors
  };

  // Handle Form Submission (includes API Call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('billName', billName.trim());
    formData.append('shopName', shopName.trim());
    formData.append('purchaseDate', date); // Use 'purchaseDate' key

    const formattedItems = items.map(item => ({
      itemName: item.itemName.trim(),
      cost: parseFloat(item.cost)
    }));
    formData.append('items', JSON.stringify(formattedItems));

    if (selectedFile) {
      formData.append('billPhoto', selectedFile); // Key: 'billPhoto'
    }

    try {
      console.log("Sending bill data..."); // Log before sending

      const response = await axios.post(
        `${API_BASE_URL}/billUpload`, // API endpoint
        formData
        // No need to set Content-Type header for FormData, axios does it
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.success) {
         // Check if the callback prop exists before calling it
         if (onBillAdded) {
            // *** THIS IS WHERE THE PARENT IS NOTIFIED ***
            onBillAdded(response.data.bill);
         }
         onClose(); // Close modal on successful submission
      } else {
         setError(response.data.message || 'Failed to add bill. Backend reported failure.');
      }

    } catch (err) {
      console.error('API Submission Error:', err);
      let errorMessage = 'Failed to submit bill. Please try again.';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error. Please check connection.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false); // Turn off loading state
    }
  };

  // JSX structure (using Tailwind as assumed from previous context)
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl" // Add shadow
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        {/* Sticky Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-3 z-10 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Error Display Area */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate> {/* Add noValidate to rely on custom validation */}

           {/* --- Bill Photo --- */}
           <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Bill Photo (Optional)
            </label>
            <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                accept="image/*"
                ref={fileInputRef}
             />
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-3 text-center">
                <div className="relative inline-block group">
                  <img
                    src={previewUrl}
                    alt="Bill preview"
                    className="w-36 h-36 object-cover rounded-lg border-2 border-gray-200"
                  />
                   <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- Text Inputs --- */}
          <div className="mb-4 space-y-3"> {/* Add space between inputs */}
             <label htmlFor="billName" className="sr-only">Bill Name</label>
             <input
              id="billName"
              type="text"
              placeholder="Bill Name *"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
             <label htmlFor="shopName" className="sr-only">Shop Name</label>
             <input
              id="shopName"
              type="text"
              placeholder="Shop Name *"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
             <label htmlFor="purchaseDate" className="sr-only">Purchase Date</label>
             <input
              id="purchaseDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-700" // Style date input
              required
            />
          </div>

          {/* --- Items Section --- */}
          <div className="mb-5">
            <h3 className="font-medium mb-2 text-gray-700">Items *</h3>
            <div className="space-y-2"> {/* Add space between item rows */}
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <label htmlFor={`itemName-${index}`} className="sr-only">Item Name {index + 1}</label>
                  <input
                    id={`itemName-${index}`}
                    type="text"
                    placeholder="Item name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <label htmlFor={`itemCost-${index}`} className="sr-only">Item Cost {index + 1}</label>
                  <input
                    id={`itemCost-${index}`}
                    type="number"
                    placeholder="Cost"
                    value={item.cost}
                    onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                    className="w-24 p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    min="0"
                    step="0.01"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={items.length <= 1}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <FaMinus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-orange-600 hover:text-orange-700 flex items-center text-sm mt-2 font-medium"
            >
              <FaPlus className="mr-1 h-3 w-3" /> Add Item
            </button>
          </div>

           {/* --- Submit Button --- */}
           <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-semibold transition-colors disabled:opacity-60"
            disabled={isSubmitting}
           >
            {isSubmitting ? 'Submitting...' : 'Submit Bill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal;