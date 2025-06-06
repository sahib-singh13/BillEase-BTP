// src/components/BillDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast';
import {
    FaEdit, FaTrash, FaTimes, FaSave, FaUndo, FaPlus, FaMinus,
    FaImage, FaFilePdf, FaSpinner, FaPhone, FaMapMarkerAlt,
    FaShieldAlt // Icon for Warranty
} from 'react-icons/fa';
import api from '../services/api'; // Use the configured api instance
import { useAuth } from '../context/AuthContext'; // Import useAuth to potentially get user details

const BillDetailModal = ({ bill, isOpen, onClose, onUpdate, onDelete }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const { user } = useAuth(); // Get current user data if needed for claim page

  // --- State Variables ---
  const [isEditing, setIsEditing] = useState(false);
  const [editableBillData, setEditableBillData] = useState({ // Initialize fully
    billName: '', shopName: '', purchaseDate: '', billImageUrl: null, items: [], _id: null, cloudinaryId: null,
    shopPhoneNumber: '', shopAddress: '', user: null
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Combined loading for update/delete
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false); // Track if form has changes
  const [showModal, setShowModal] = useState(false); // For animation

  // --- Effects ---
  useEffect(() => { // Modal open/close animation
    if (isOpen) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  // Populate/reset state when bill prop changes or modal opens/closes
  useEffect(() => {
    if (bill && isOpen) {
      const formattedDate = bill.purchaseDate ? new Date(bill.purchaseDate).toISOString().split('T')[0] : '';
      setEditableBillData({
        billName: bill.billName || '',
        shopName: bill.shopName || '',
        purchaseDate: formattedDate,
        billImageUrl: bill.billImageUrl || null,
        items: bill.items ? JSON.parse(JSON.stringify(bill.items)) : [],
        _id: bill._id,
        cloudinaryId: bill.cloudinaryId || null,
        shopPhoneNumber: bill.shopPhoneNumber || '',
        shopAddress: bill.shopAddress || '',
        user: bill.user // Keep user ID associated with the bill
      });
      // Reset edit-specific state ONLY if not currently editing OR if the bill prop itself changes
      if (!isEditing || (editableBillData._id !== bill._id)) {
         setSelectedFile(null);
         setPreviewUrl(null);
         setError(null);
         setIsDirty(false);
      }
    } else if (!isOpen) {
       // Reset more state when modal is fully closed
       setIsEditing(false);
       setSelectedFile(null);
       setPreviewUrl(null);
       setError(null);
       setIsDirty(false);
       setEditableBillData({ billName: '', shopName: '', purchaseDate: '', billImageUrl: null, items: [], _id: null, cloudinaryId: null, shopPhoneNumber: '', shopAddress: '', user: null });
    }
  // Depend on bill._id to re-populate when a different bill is selected
  // Depend on isOpen to populate when opened
  // Depend on isEditing to prevent resetting while user is actively editing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill?._id, isOpen, isEditing]);

  useEffect(() => { // File preview generation
    if (!selectedFile) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    // Cleanup function to revoke the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableBillData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleItemChange = (index, field, value) => {
    setEditableBillData(prev => {
      // Create a deep copy of items to avoid direct state mutation
      const newItems = JSON.parse(JSON.stringify(prev.items));
      if (index >= 0 && index < newItems.length) {
         newItems[index][field] = value;
      }
      return { ...prev, items: newItems };
    });
    setIsDirty(true);
  };

  const handleAddItem = () => {
    setEditableBillData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', cost: '' }] // Add new empty item
    }));
    setIsDirty(true);
  };

  const handleRemoveItem = (index) => {
    if (editableBillData.items.length <= 1 && isEditing) {
        toast.error("At least one item is required.");
        return;
    }
    setEditableBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index) // Remove item at index
    }));
    setIsDirty(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; // Use optional chaining
    if (file) {
      // Validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select an image (JPEG, PNG, GIF, WebP) or PDF file.');
        setSelectedFile(null); setPreviewUrl(null); if(e.target) e.target.value = ''; // Clear file input
        return;
      }
      const maxSize = 10 * 1024 * 1024; // Example: 10MB limit
      if (file.size > maxSize) {
          setError(`File size exceeds the limit of ${maxSize / 1024 / 1024}MB.`);
          setSelectedFile(null); setPreviewUrl(null); if(e.target) e.target.value = '';
          return;
      }
      // Valid file
      setError(null);
      setSelectedFile(file);
      setIsDirty(true);
    }
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!bill?._id) return;
    if (window.confirm(`Are you sure you want to delete the bill "${editableBillData.billName || 'this bill'}"? This cannot be undone.`)) {
      setIsLoading(true); setError(null);
      const toastId = toast.loading(`Deleting bill...`);
      try {
        await api.delete(`/bills/deleteBills/${bill._id}`);
        toast.success(`Bill deleted successfully!`, { id: toastId });
        onDelete(bill._id); // Notify parent
        handleCloseAnimation(); // Close modal
      } catch (err) {
        console.error("Error deleting bill:", err);
        const message = err.response?.data?.message || err.message || 'Failed to delete bill.';
        setError(message); toast.error(message, { id: toastId });
      } finally { setIsLoading(false); }
    }
  };

  // --- Toggle Edit Mode ---
  const handleEditToggle = () => {
    setError(null); // Clear errors on toggle
    if (isEditing) { // If cancelling edit
      // Reset form state to match the original 'bill' prop
      const formattedDate = bill.purchaseDate ? new Date(bill.purchaseDate).toISOString().split('T')[0] : '';
      setEditableBillData({
         billName: bill.billName || '', shopName: bill.shopName || '',
         purchaseDate: formattedDate, billImageUrl: bill.billImageUrl || null,
         items: bill.items ? JSON.parse(JSON.stringify(bill.items)) : [],
         _id: bill._id, cloudinaryId: bill.cloudinaryId || null,
         shopPhoneNumber: bill.shopPhoneNumber || '', shopAddress: bill.shopAddress || '',
         user: bill.user
      });
      setSelectedFile(null); // Clear selected file
      setPreviewUrl(null);   // Clear preview
      setIsDirty(false);     // Reset dirty flag
    }
    // Toggle the editing state
    setIsEditing(!isEditing);
  };

  // --- Form Validation ---
  const validateForm = () => {
    if (!editableBillData.billName?.trim()) return "Bill Name is required.";
    if (!editableBillData.shopName?.trim()) return "Shop Name is required.";
    if (!editableBillData.purchaseDate) return "Purchase Date is required.";
    if (!editableBillData.items || editableBillData.items.length === 0) return "At least one item is required.";
    for (const item of editableBillData.items) {
      if (!item.itemName?.trim()) return "All item names are required.";
      const costValue = parseFloat(item.cost);
      // Check cost validity more thoroughly
      if (item.cost === null || item.cost === undefined || item.cost === '' || isNaN(costValue) || costValue < 0) {
           return `Item "${item.itemName || '(Unnamed)'}" requires a valid non-negative cost.`;
      }
    }
    // Add validation for phone number format if desired (optional)
    // const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    // if (editableBillData.shopPhoneNumber && !phoneRegex.test(editableBillData.shopPhoneNumber)) {
    //     return "Invalid shop phone number format.";
    // }
    return null; // No errors
  };

  // --- Form Submission (Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing || !bill?._id || !isDirty) {
        if(isDirty === false && isEditing){ toast('No changes detected to save.', { icon: 'ℹ️' }); }
        return;
    }
    setError(null);
    const validationError = validateForm();
    if (validationError) { setError(validationError); toast.error(validationError); return; }

    setIsLoading(true);
    const toastId = toast.loading('Updating bill...');
    const formData = new FormData();

    // --- Append changed fields ONLY ---
    // Compare current editable state with the original 'bill' prop
    if (editableBillData.billName !== bill.billName) formData.append('billName', editableBillData.billName || '');
    if (editableBillData.shopName !== bill.shopName) formData.append('shopName', editableBillData.shopName || '');
    const originalFormattedDate = bill.purchaseDate ? new Date(bill.purchaseDate).toISOString().split('T')[0] : '';
    if (editableBillData.purchaseDate !== originalFormattedDate) formData.append('purchaseDate', editableBillData.purchaseDate || '');
    // Compare items (simple stringify comparison, might need deep compare for complex cases)
    if (JSON.stringify(editableBillData.items) !== JSON.stringify(bill.items || [])) {
        const formattedItems = editableBillData.items.map(item => ({
            itemName: item.itemName.trim(),
            // Ensure cost is parsed as a number before sending
            cost: isNaN(parseFloat(item.cost)) ? 0 : parseFloat(item.cost)
        }));
        formData.append('items', JSON.stringify(formattedItems));
    }
    // Compare new fields
    if (editableBillData.shopPhoneNumber !== (bill.shopPhoneNumber || '')) formData.append('shopPhoneNumber', editableBillData.shopPhoneNumber.trim());
    if (editableBillData.shopAddress !== (bill.shopAddress || '')) formData.append('shopAddress', editableBillData.shopAddress.trim());
    // Always append file if a new one is selected
    if (selectedFile) formData.append('billPhoto', selectedFile);
    // --- End Append ---

    // Check if any data was actually added to FormData
    let hasDataToSend = !!selectedFile;
    // formData.entries() might not be standard in all environments for checking size directly
    // Iterate to check if any fields were added besides potentially the file
    // Use Array.from to safely iterate if needed: Array.from(formData.keys()).length > (selectedFile ? 1 : 0)
    if (!hasDataToSend) {
        for (const key of formData.keys()) {
             if (key !== 'billPhoto') { // Check for non-file keys
                hasDataToSend = true;
                break;
             }
        }
    }


    if (!hasDataToSend) { // Check if only file OR nothing changed
        setIsLoading(false); toast('No changes detected.', { id: toastId, icon: '🤷' });
        setIsEditing(false); setIsDirty(false); return;
    }

    try {
      const response = await api.patch(`/bills/updateBills/${bill._id}`, formData);
      toast.success('Bill updated successfully!', { id: toastId });
      onUpdate(response.data.bill); // Pass updated bill data back
      setIsEditing(false); setIsDirty(false); setSelectedFile(null); setPreviewUrl(null);
    } catch (err) {
      console.error("Error updating bill:", err);
      const message = err.response?.data?.message || err.message || 'Failed to update bill.';
      setError(message); toast.error(message, { id: toastId });
    } finally { setIsLoading(false); }
  };

  // --- Locate on Map Handler ---
  const handleLocateMap = () => {
      const address = editableBillData.shopAddress?.trim();
      if (!address) { toast.error("No shop address provided to locate."); return; }
      const query = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  // --- Warranty Claim Handler ---
  const handleClaimWarrantyClick = () => {
    if (!bill) return;
    // Use the currently displayed data (which matches 'bill' prop unless editing was cancelled)
     const currentBillDetails = {
         ...editableBillData // Includes all fields currently in state
     };
    // Ensure user details from context are available
    if (!user) {
        toast.error("User details not available. Cannot proceed with warranty claim.");
        return;
    }
    console.log("Navigating to warranty claim with bill:", currentBillDetails, "and user:", user);
    navigate('/warranty-claim', {
        state: {
            billData: currentBillDetails, // Pass the detailed bill data
            currentUser: user            // Pass current logged-in user details
        }
    });
    handleCloseAnimation(); // Close the modal after initiating navigation
  };

  // --- Other handlers & Render setup ---
  const handleModalContentClick = (e) => e.stopPropagation(); // Prevent closing modal on inner click
  const handleCloseAnimation = () => { setShowModal(false); setTimeout(onClose, 300); }; // Close with animation
  if (!isOpen && !showModal) return null; // Render nothing if closed
  const displayImageUrl = previewUrl || editableBillData.billImageUrl;
  const isPdf = selectedFile?.type === 'application/pdf' || (!selectedFile && displayImageUrl?.toLowerCase().endsWith('.pdf'));

  // Reusable classes
  const baseButtonClass = "px-5 py-2.5 rounded-lg inline-flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.03] hover:shadow-md";
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-sm placeholder-gray-400 hover:bg-gray-50/50 disabled:bg-gray-100";
  const viewTextClass = "text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2.5 rounded-lg border border-gray-200 min-h-[46px] break-words text-sm shadow-inner flex items-center";
  const iconInputWrapperClass = "relative";
  const iconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1.5";

  return (
    // Modal Backdrop
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleCloseAnimation}
    >
      {/* Modal Content Box */}
      <div
        className={`bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-orange-500 shadow-xl transition-all duration-300 ease-out ${showModal ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
        onClick={handleModalContentClick}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 flex-shrink-0 bg-white border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight"> {isEditing ? 'Edit Bill Details' : 'Bill Details'} </h2>
          <button onClick={handleCloseAnimation} className="text-gray-400 hover:text-red-600 transition-colors duration-150 rounded-full p-1 -mr-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1" aria-label="Close modal"> <FaTimes size={22} /> </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto px-7 py-6 custom-scrollbar space-y-7 bg-gray-50/40">
          {error && <div className="mb-4 p-3.5 bg-red-100 text-red-800 border border-red-300 rounded-lg text-sm shadow-sm" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} noValidate className="space-y-7">
            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-6">
              {/* Left Side: Image/File Area */}
              <div className="flex flex-col items-center justify-start space-y-5">
                 {/* Edit Mode File Input & Previews */}
                 {isEditing && (
                   <div className="w-full p-5 border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50/30 transition-all duration-200 rounded-lg text-center group">
                     <label htmlFor="billPhotoEdit" className="cursor-pointer text-orange-600 group-hover:text-orange-700 text-sm font-medium block transition-colors"> <FaImage className="inline-block mr-2 mb-1 text-lg" /> {selectedFile ? selectedFile.name : 'Change image / PDF'} </label>
                     <input type="file" id="billPhotoEdit" name="billPhoto" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" disabled={isLoading}/>
                     {previewUrl && !isPdf && <img src={previewUrl} alt="New preview" className="mt-4 max-h-32 mx-auto object-contain border border-gray-200 rounded-md shadow-sm"/>}
                     {previewUrl && isPdf && <div className="mt-4 text-center"><FaFilePdf className="mx-auto text-4xl text-red-500" /><p className="text-xs text-gray-600 mt-1 truncate max-w-[150px]">{selectedFile?.name}</p></div>}
                     {!selectedFile && editableBillData.billImageUrl && <p className="text-xs text-gray-500 mt-2">(Current file shown below)</p>}
                   </div>
                 )}
                 {/* File Display Area */}
                <div className="w-full h-64 bg-white flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 shadow-md p-2">
                     {isPdf && displayImageUrl && ( <div className='text-center p-4'> <FaFilePdf className="mx-auto text-6xl text-red-600 mb-3" /> <p className='text-sm text-gray-700 font-medium'>PDF Document</p> <a href={displayImageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline mt-1 block">View PDF</a> </div> )}
                     {!isPdf && displayImageUrl && ( <img src={displayImageUrl} alt={`Bill for ${editableBillData.billName || 'Unknown Bill'}`} className="max-w-full max-h-full object-contain rounded-sm"/> )}
                     {!displayImageUrl && ( <div className="text-center p-4"> <FaImage className="mx-auto text-5xl text-gray-300 mb-2" /> <span className="text-gray-400 italic text-sm">No Image Available</span> </div> )}
                 </div>
              </div>

              {/* Right Side: Textual Details */}
              <div className="space-y-6">
                {/* Bill Name */}
                <div> <label htmlFor="billNameEdit" className={labelClass}>Bill Name *</label> {isEditing ? ( <input id="billNameEdit" name="billName" type="text" placeholder="Bill Description" value={editableBillData.billName} onChange={handleChange} className={inputClass} required disabled={isLoading}/> ) : ( <p className={viewTextClass}>{editableBillData.billName || '(Not Set)'}</p> )} </div>
                {/* Shop Name */}
                <div> <label htmlFor="shopNameEdit" className={labelClass}>Shop Name *</label> {isEditing ? ( <input id="shopNameEdit" name="shopName" type="text" placeholder="Name of the shop" value={editableBillData.shopName} onChange={handleChange} className={inputClass} required disabled={isLoading}/> ) : ( <p className={viewTextClass}>{editableBillData.shopName || '(Not Set)'}</p> )} </div>
                {/* Shop Phone */}
                <div>
                    <label htmlFor="shopPhoneNumberEdit" className={labelClass}>Shop Phone</label>
                    {isEditing ? ( <div className={iconInputWrapperClass}> <div className={iconClass}><FaPhone size={14}/></div> <input id="shopPhoneNumberEdit" type="tel" name="shopPhoneNumber" placeholder="Enter phone (optional)" value={editableBillData.shopPhoneNumber} onChange={handleChange} className={`${inputClass} pl-10`} disabled={isLoading}/> </div> )
                     : ( <p className={`${viewTextClass} ${!editableBillData.shopPhoneNumber ? 'italic text-gray-500' : ''}`}> {editableBillData.shopPhoneNumber || '(Not Provided)'} </p> )}
                </div>
                {/* Shop Address & Locate Button */}
                <div>
                     <label htmlFor="shopAddressEdit" className={labelClass}>Shop Address</label>
                     {isEditing ? ( <div className={iconInputWrapperClass}> <div className={iconClass}><FaMapMarkerAlt size={15}/></div> <input id="shopAddressEdit" type="text" name="shopAddress" placeholder="Enter address (optional)" value={editableBillData.shopAddress} onChange={handleChange} className={`${inputClass} pl-10`} disabled={isLoading}/> </div> )
                     : ( <div> <p className={`${viewTextClass} ${!editableBillData.shopAddress ? 'italic text-gray-500' : ''}`}> {editableBillData.shopAddress || '(Not Provided)'} </p> {editableBillData.shopAddress && ( <button type="button" onClick={handleLocateMap} className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center hover:underline disabled:opacity-50" disabled={isLoading} title={`Locate address on Google Maps`} > <FaMapMarkerAlt className="mr-1.5 h-4 w-4" /> Locate on Map </button> )} </div> )}
                </div>
                {/* Purchase Date */}
                <div> <label htmlFor="purchaseDateEdit" className={labelClass}>Purchase Date *</label> {isEditing ? ( <input id="purchaseDateEdit" name="purchaseDate" type="date" value={editableBillData.purchaseDate} onChange={handleChange} className={`${inputClass} text-gray-700`} required disabled={isLoading}/> ) : ( <p className={viewTextClass}>{editableBillData.purchaseDate ? new Date(editableBillData.purchaseDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}</p> )} </div>
              </div>
            </div>
            {/* --- End Main Content Grid --- */}

            {/* Items Section */}
            <div className="space-y-2.5">
              <h3 className="text-base font-semibold text-gray-700 mb-2">Items *</h3>
              {isEditing ? (
                 <div className="space-y-3.5 border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                   {editableBillData.items?.map((item, index) => (
                     <div key={index} className="flex gap-3 items-center">
                       <input id={`itemNameEdit-${index}`} aria-label={`Item Name ${index+1}`} type="text" placeholder="Item name" value={item.itemName || ''} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} className={`${inputClass} flex-grow py-2`} required disabled={isLoading}/>
                       <input id={`itemCostEdit-${index}`} aria-label={`Item Cost ${index+1}`} type="number" placeholder="Cost" value={item.cost ?? ''} onChange={(e) => handleItemChange(index, 'cost', e.target.value)} className={`${inputClass} w-32 py-2`} min="0" step="0.01" required disabled={isLoading}/>
                       <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1.5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:bg-red-100 rounded-full transition-colors duration-150" disabled={isLoading || editableBillData.items.length <= 1} aria-label={`Remove item ${index + 1}`}> <FaMinus className="h-4 w-4" /> </button>
                     </div>
                   ))}
                   <button type="button" onClick={handleAddItem} disabled={isLoading} className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-semibold mt-3 pt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"> <FaPlus className="mr-1.5 h-4 w-4" /> Add Item </button>
                 </div>
               ) : ( // View Mode for Items
                 <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm min-h-[80px]`}>
                   {editableBillData.items && editableBillData.items.length > 0 ? (
                     <div className="space-y-3 divide-y divide-gray-100">
                       <div className="grid grid-cols-2 gap-4 pb-2 font-semibold text-sm text-gray-500"> <div className="text-left pl-2">Item Name</div> <div className="text-right pr-2">Cost</div> </div>
                       {editableBillData.items.map((item, index) => (
                         <div key={index} className="grid grid-cols-2 gap-4 pt-3 text-sm">
                           <div className="text-left text-gray-700 break-words pl-2"> {item.itemName || '(No Name)'} </div>
                           <div className="text-right font-medium text-gray-800 pr-2"> ₹{typeof item.cost === 'number' ? item.cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} </div>
                         </div>
                       ))}
                     </div>
                   ) : ( <p className="italic text-gray-500 text-center py-4">No items listed.</p> )}
                 </div>
               )}
            </div>
            {/* Hidden submit allows Enter key submission when editing */}
            {isEditing && <button type="submit" className="hidden"></button>}
          </form>
        </div> {/* End Modal Body */}

        {/* Modal Footer */}
         <div className="flex flex-wrap justify-between items-center px-6 py-4 border-t border-gray-200 bg-white space-y-3 sm:space-y-0 sm:space-x-3 flex-shrink-0">
           {/* Left Side Buttons (View Mode) */}
           {!isEditing && (
             <div className="flex flex-wrap gap-3"> {/* Use gap for spacing */}
                 <button onClick={handleDelete} disabled={isLoading} className={`${baseButtonClass} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-md hover:shadow-lg`}> <FaTrash className="mr-2 h-4 w-4" /> Delete </button>
                 <button onClick={handleClaimWarrantyClick} disabled={isLoading} className={`${baseButtonClass} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg`}> <FaShieldAlt className="mr-2 h-4 w-4" /> Claim Warranty </button>
             </div>
            )}
            <div className="flex-grow sm:min-w-[20px]"></div> {/* Flexible Spacer */}

            {/* Right Side Buttons (Edit/Save/Cancel) */}
            <div className="flex space-x-4 flex-shrink-0">
                 {isEditing ? (
                   <>
                     <button type="button" onClick={handleEditToggle} disabled={isLoading} className={`${baseButtonClass} bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400 shadow-md hover:shadow-lg`}> <FaUndo className="mr-2 h-4 w-4" /> Cancel </button>
                     <button type="button" onClick={handleSubmit} disabled={isLoading || !isDirty} className={`${baseButtonClass} ${isDirty && !isLoading ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg cursor-pointer' : 'bg-gray-300 text-gray-500 focus:ring-gray-300 cursor-not-allowed'}`}> {isLoading ? <FaSpinner className="animate-spin mr-2 h-4 w-4" /> : <FaSave className="mr-2 h-4 w-4" />} {isLoading ? 'Saving...' : 'Save Changes'} </button>
                   </>
                 ) : (
                    <button onClick={handleEditToggle} disabled={isLoading} className={`${baseButtonClass} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 shadow-md hover:shadow-lg`}> <FaEdit className="mr-2 h-4 w-4" /> Edit Bill </button>
                 )}
            </div>
        </div> {/* End Modal Footer */}
      </div> {/* End Modal Content Box */}

      {/* Custom Scrollbar CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fdba74; border-radius: 10px; border: 2px solid #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #fdba74 #f1f1f1; }
      `}</style>
    </div> // End Modal Backdrop
  );
};

export default BillDetailModal;