// src/components/AddBillModal.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import toast
import { FaPlus, FaTimes, FaMinus, FaImage, FaFilePdf, FaSpinner } from 'react-icons/fa'; // Added icons

// Define the API URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease";

const AddBillModal = ({ isOpen: propIsOpen = true, onClose, onBillAdded }) => { // Accept isOpen prop for animation control
  const [billName, setBillName] = useState('');
  const [shopName, setShopName] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ itemName: '', cost: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for animation

  // --- Effects ---
   useEffect(() => {
    // Use propIsOpen passed from parent (or default to true if not passed)
    if (propIsOpen) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [propIsOpen]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null); return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // --- Handlers (Keep Existing Logic) ---
  const handleAddItem = () => setItems([...items, { itemName: '', cost: '' }]);
  const handleRemoveItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const handleItemChange = (index, field, value) => { const newItems = [...items]; if (field === 'itemName' || field === 'cost') { newItems[index][field] = value; setItems(newItems); } };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { // Allow PDF
        setError('Please select an Image or PDF file.');
        setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; return;
      }
      setError(null); setSelectedFile(file);
    }
  };
  const handleRemovePhoto = () => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  // --- Validation (Keep Existing Logic) ---
  const validateForm = () => {
    if (!billName.trim()) return "Bill Name is required.";
    if (!shopName.trim()) return "Shop Name is required.";
    if (!date) return "Date is required.";
    if (items.length === 0) return "At least one item is required.";
    for (const item of items) {
      if (!item.itemName?.trim()) return "All item names are required.";
      const costValue = parseFloat(item.cost);
      if (item.cost === null || item.cost === undefined || item.cost === '' || isNaN(costValue) || costValue < 0) return "All item costs must be valid non-negative numbers.";
    }
    return null;
  };

  // --- Submission Handler (Minor change for toast) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    const validationError = validateForm();
    if (validationError) { setError(validationError); toast.error(validationError); return; }

    setIsSubmitting(true);
    const toastId = toast.loading('Adding new bill...'); // Add loading toast

    const formData = new FormData();
    formData.append('billName', billName.trim()); formData.append('shopName', shopName.trim()); formData.append('purchaseDate', date);
    const formattedItems = items.map(item => ({ itemName: item.itemName.trim(), cost: parseFloat(item.cost) }));
    formData.append('items', JSON.stringify(formattedItems));
    if (selectedFile) { formData.append('billPhoto', selectedFile); }

    try {
      const response = await axios.post(`${API_BASE_URL}/billUpload`, formData);
      if (response.data && response.data.success) {
        toast.success('Bill added successfully!', { id: toastId }); // Success toast
        if (onBillAdded) { onBillAdded(response.data.bill); }
        handleCloseAnimation(); // Close modal on success
      } else {
        const message = response.data?.message || 'Failed to add bill. Backend reported failure.';
        setError(message); toast.error(message, { id: toastId }); // Error toast
      }
    } catch (err) {
      console.error('API Submission Error:', err);
      let errorMessage = 'Failed to submit bill. Please try again.';
      if (err.response) { errorMessage = err.response.data?.message || `Server error: ${err.response.status}`; }
      else if (err.request) { errorMessage = 'Network error. Please check connection.'; }
      else { errorMessage = err.message; }
      setError(errorMessage); toast.error(errorMessage, { id: toastId }); // Error toast
    } finally { setIsSubmitting(false); }
  };

  // Close animation handler
  const handleCloseAnimation = () => {
      setShowModal(false);
      setTimeout(onClose, 300); // Call onClose after animation
  };

   const handleModalContentClick = (e) => e.stopPropagation();

   // --- Render Logic ---
   if (!propIsOpen && !showModal) return null;

   const isPdf = selectedFile?.type === 'application/pdf';

   // Reusable classes from BillDetailModal
   const baseButtonClass = "px-5 py-2.5 rounded-lg inline-flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.03] hover:shadow-md";
   const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-sm placeholder-gray-400 hover:bg-gray-50/50 disabled:bg-gray-100";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleCloseAnimation} // Use animated close
    >
      <div
        className={`bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-orange-500 shadow-xl transition-all duration-300 ease-out ${showModal ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`} // Apply same animation & style
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 flex-shrink-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add New Bill</h2>
          <button
            onClick={handleCloseAnimation} // Use animated close
            className="text-gray-400 hover:text-red-600 transition-colors duration-150 rounded-full p-1 -mr-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            aria-label="Close modal"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto px-7 py-6 custom-scrollbar space-y-6 bg-gray-50/40">
           {/* Error Display */}
          {error && (
            <div className="p-3.5 bg-red-100 text-red-800 border border-red-300 rounded-lg text-sm shadow-sm" role="alert">
                {error}
            </div>
           )}

           <form onSubmit={handleSubmit} noValidate className="space-y-6">

             {/* --- Bill Photo Section --- */}
             <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Bill Photo <span className="text-gray-500 font-normal">(Optional - Image/PDF)</span>
                </label>
                <div className="w-full p-5 border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50/30 transition-all duration-200 rounded-lg text-center group">
                    <label htmlFor="billPhotoAdd" className="cursor-pointer text-orange-600 group-hover:text-orange-700 text-sm font-medium block transition-colors">
                       <FaImage className="inline-block mr-2 mb-1 text-lg" /> Choose File
                    </label>
                    <input
                        id="billPhotoAdd"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,application/pdf" // Accept PDF
                        ref={fileInputRef}
                        disabled={isSubmitting}
                    />
                    {/* Preview Area */}
                    {previewUrl && (
                    <div className="mt-4 relative inline-block group/preview"> {/* group/preview for nested group */}
                        {isPdf ? (
                            <div className="text-center border border-gray-200 p-4 rounded-md bg-white">
                                <FaFilePdf className="mx-auto text-4xl text-red-500" />
                                <p className="text-xs text-gray-600 mt-1 truncate max-w-[150px]">{selectedFile?.name}</p>
                            </div>
                        ) : (
                            <img src={previewUrl} alt="Bill preview" className="w-36 h-36 object-cover rounded-lg border border-gray-200 shadow-sm"/>
                        )}
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-600 opacity-0 group-hover/preview:opacity-100 transition-opacity focus:outline-none focus:ring-1 focus:ring-red-400"
                            aria-label="Remove photo"
                            disabled={isSubmitting}
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                    </div>
                    )}
                </div>
             </div>

             {/* --- Text Inputs --- */}
             <div className="space-y-5">
                <div>
                    <label htmlFor="billName" className="block text-sm font-medium text-gray-600 mb-1.5">Bill Name *</label>
                    <input id="billName" type="text" placeholder="e.g., Groceries April Week 1" value={billName} onChange={(e) => setBillName(e.target.value)} className={inputClass} required disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-600 mb-1.5">Shop Name *</label>
                    <input id="shopName" type="text" placeholder="e.g., SuperMart" value={shopName} onChange={(e) => setShopName(e.target.value)} className={inputClass} required disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-600 mb-1.5">Purchase Date *</label>
                    <input id="purchaseDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} text-gray-700`} required disabled={isSubmitting}/>
                </div>
             </div>

             {/* --- Items Section --- */}
             <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-gray-700 mb-1">Items *</h3>
                <div className="space-y-3.5 border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm"> {/* Consistent Styling */}
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <label htmlFor={`itemName-${index}`} className="sr-only">Item Name {index + 1}</label>
                            <input id={`itemName-${index}`} type="text" placeholder="Item name" value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} className={`${inputClass} flex-grow py-2`} required disabled={isSubmitting}/>
                            <label htmlFor={`itemCost-${index}`} className="sr-only">Item Cost {index + 1}</label>
                            <input id={`itemCost-${index}`} type="number" placeholder="Cost" value={item.cost} onChange={(e) => handleItemChange(index, 'cost', e.target.value)} className={`${inputClass} w-32 py-2`} min="0" step="0.01" required disabled={isSubmitting}/>
                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1.5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:bg-red-100 rounded-full transition-colors duration-150" disabled={isSubmitting || items.length <= 1} aria-label={`Remove item ${index + 1}`}>
                                <FaMinus className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-semibold mt-3 pt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" disabled={isSubmitting}>
                        <FaPlus className="mr-1.5 h-4 w-4" /> Add Item
                    </button>
                </div>
             </div>

             {/* --- Submit Button --- */}
             <div className="pt-2"> {/* Add padding top before submit */}
                <button
                    type="submit"
                    // Apply consistent button styling
                    className={`${baseButtonClass} w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 shadow-md hover:shadow-lg`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="animate-spin mr-2 h-4 w-4" /> Submitting...
                        </>
                    ) : (
                        'Submit Bill'
                    )}
                </button>
             </div>
           </form>
        </div>

        {/* Scrollbar Style */}
        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; border-radius: 10px; } /* Lighter track */
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #fdba74; border-radius: 10px; border: 2px solid #f9fafb; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
            .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #fdba74 #f9fafb; }
        `}</style>

      </div>
    </div>
  );
};

export default AddBillModal;