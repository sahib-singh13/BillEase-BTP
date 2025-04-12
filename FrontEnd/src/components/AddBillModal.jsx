import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { FaPlus, FaTimes, FaMinus } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

const AddBillModal = ({ onClose, onBillAdded }) => { // Add onBillAdded prop
  const [billName, setBillName] = useState('');
  const [shopName, setShopName] = useState('');
  const [date, setDate] = useState('');
  // --- Use itemName to match backend schema ---
  const [items, setItems] = useState([{ itemName: '', cost: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // --- State for loading and errors ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Preview logic remains the same
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAddItem = () => {
    setItems([...items, { itemName: '', cost: '' }]); // Use itemName
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    // Ensure field is either 'itemName' or 'cost'
    if (field === 'itemName' || field === 'cost') {
       newItems[index][field] = value;
       setItems(newItems);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Optional: Basic file type validation on frontend
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
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

  // --- Frontend Validation Function ---
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


  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setError(null); // Clear previous errors

    // --- Perform Validation ---
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);

    // --- Create FormData ---
    // Required because we are sending a file
    const formData = new FormData();
    formData.append('billName', billName.trim());
    formData.append('shopName', shopName.trim());
    formData.append('purchaseDate', date); // Use 'purchaseDate' key for backend

    // Prepare items: ensure cost is a number and key is 'itemName'
    const formattedItems = items.map(item => ({
      itemName: item.itemName.trim(),
      cost: parseFloat(item.cost) // Ensure cost is stored as number
    }));
    formData.append('items', JSON.stringify(formattedItems)); // Stringify the items array

    if (selectedFile) {
      formData.append('billPhoto', selectedFile); // Key must match backend: 'billPhoto'
    }

    // --- API Call ---
    try {
      console.log("Sending FormData:", formData); // Optional: Check FormData content
      // Log keys/values for easier debugging if needed
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const response = await axios.post(
        `${API_BASE_URL}/billUpload`, // Correct endpoint based on server.js and routes
        formData,
        {
          // Axios usually sets Content-Type automatically for FormData
          // headers: { 'Content-Type': 'multipart/form-data' } // Generally not needed
        }
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.success) {
         if (onBillAdded) {
            onBillAdded(response.data.bill); // Pass new bill data to parent
         }
         onClose(); // Close modal on success
      } else {
         // Handle cases where backend returns success: false
         setError(response.data.message || 'Failed to add bill. Unknown backend error.');
      }

    } catch (err) {
      console.error('API Error:', err);
      // Extract specific error message if possible
      let errorMessage = 'Failed to add bill. Please try again.';
      if (err.response) {
        // Server responded with a status code outside 2xx range
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received (network error)
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something happened setting up the request
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false); // Ensure loading state is turned off
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" // Add z-index
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" // Add max-height and scroll
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10"> {/* Make header sticky */}
          <h2 className="text-xl font-semibold">Add New Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Display Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}


        <form onSubmit={handleSubmit}>
           {/* Bill Photo Input */}
           <div className="mb-4">
            <label className="block text-sm font-medium mb-1"> {/* Reduced bottom margin */}
              Bill Photo (Optional)
            </label>
            <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                accept="image/*" // Only accept images
                ref={fileInputRef}
             />

            {previewUrl && (
              <div className="mt-3 text-center"> {/* Reduced top margin */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md hover:text-red-600 z-10"
                    aria-label="Remove photo"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                  <img
                    src={previewUrl}
                    alt="Bill preview"
                    className="w-40 h-40 object-cover rounded-lg border-2 border-orange-100" // Slightly smaller preview
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bill Details Inputs */}
          <div className="mb-4">
             <label htmlFor="billName" className="sr-only">Bill Name</label> {/* Added label for accessibility */}
             <input
              id="billName"
              type="text"
              placeholder="Bill Name *"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
              required // HTML5 required
            />
             <label htmlFor="shopName" className="sr-only">Shop Name</label> {/* Added label */}
             <input
              id="shopName"
              type="text"
              placeholder="Shop Name *"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
              required
            />
             <label htmlFor="purchaseDate" className="sr-only">Purchase Date</label> {/* Added label */}
             <input
              id="purchaseDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Items Section */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Items *</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                 <label htmlFor={`itemName-${index}`} className="sr-only">Item Name {index + 1}</label>
                 <input
                  id={`itemName-${index}`}
                  type="text"
                  placeholder="Item name"
                  // Use itemName matching state/backend
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  required
                />
                 <label htmlFor={`itemCost-${index}`} className="sr-only">Item Cost {index + 1}</label>
                 <input
                  id={`itemCost-${index}`}
                  type="number"
                  placeholder="Cost"
                  value={item.cost}
                  onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                  className="w-24 p-2 border rounded-lg"
                  min="0" // Prevent negative numbers via HTML5
                  step="0.01" // Allow decimals
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                  disabled={items.length <= 1} // Disable removing the last item
                  aria-label={`Remove item ${index + 1}`}
                >
                  <FaMinus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="text-orange-500 hover:text-orange-600 flex items-center text-sm mt-1" // Added top margin
            >
              <FaPlus className="mr-1" /> Add Item
            </button>
          </div>

           {/* Submit Button */}
           <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
            disabled={isSubmitting} // Disable button while submitting
           >
            {isSubmitting ? 'Submitting...' : 'Submit Bill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal;