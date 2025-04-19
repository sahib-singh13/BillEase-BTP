// src/Pages/WarrantyClaimPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaInfoCircle, FaStore, FaCalendarAlt, FaListAlt, FaBuilding, FaArrowRight, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user details
import LoadingSpinner from '../components/LoadingSpinner'; // Import loader

const WarrantyClaimPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: contextUser } = useAuth(); // Get logged-in user details from context

    // State from navigation OR initialize empty/null
    // Use a separate state to avoid potential issues if location.state becomes null
    const [billData, setBillData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedItemIndex, setSelectedItemIndex] = useState(null); // Index of the selected item
    const [companyName, setCompanyName] = useState('');             // Company name input
    const [selectedItemDetails, setSelectedItemDetails] = useState(null); // Full details of the selected item
    const [isLoadingPage, setIsLoadingPage] = useState(true); // Loading state for initial data check

    // Effect to process data from location state and context
    useEffect(() => {
        const stateData = location.state || {};
        const bill = stateData.billData;
        const userFromState = stateData.currentUser || contextUser; // Prioritize state user, fallback to context

        // Validate essential data
        if (!bill?._id || !Array.isArray(bill.items) || !userFromState?.email) {
            toast.error("Required data missing. Redirecting...");
            navigate('/customerDashboard', { replace: true });
        } else {
            setBillData(bill);
            setCurrentUser(userFromState);
            setIsLoadingPage(false); // Data is ready
        }
        // Clean up selected item if bill changes
        setSelectedItemIndex(null);
        setCompanyName('');
    }, [location.state, contextUser, navigate]); // Re-run if location state or context user changes

    // Update the selected item details whenever the index changes
    useEffect(() => {
        if (selectedItemIndex !== null && billData?.items?.[selectedItemIndex]) {
            setSelectedItemDetails(billData.items[selectedItemIndex]);
        } else {
            setSelectedItemDetails(null);
        }
    }, [selectedItemIndex, billData]);

    // Handler for clicking on an item button
    const handleItemSelection = (index) => {
        setSelectedItemIndex(index === selectedItemIndex ? null : index); // Toggle selection logic
    };

    // Handler for proceeding to the next step (submit page)
    const handleProceed = () => {
        // Re-validate before proceeding
        if (selectedItemIndex === null || selectedItemDetails === null) {
            toast.error("Please select an item to claim warranty for."); return;
        }
        if (!companyName.trim()) {
             toast.error("Please enter the company/brand name of the product."); return;
        }
        if (!currentUser) {
            toast.error("User information not available. Cannot proceed."); return;
        }

        // Navigate to the final submission page, passing all necessary data
        navigate('/warranty-submit', {
            replace: true, // Optional: replace current history entry
            state: {
                billData: billData,
                selectedItem: selectedItemDetails,
                companyName: companyName.trim(),
                currentUser: currentUser
            }
        });
    };

    // Show loader while validating initial data
    if (isLoadingPage) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500"><LoadingSpinner fullPage={true} /> Loading claim details...</div>;
    }
    // BillData should be valid here due to the effect redirecting if not

    // --- Styling Classes ---
    const cardClass = "bg-white shadow-lg rounded-lg p-6 border border-gray-200";
    const labelClass = "block text-xs sm:text-sm font-semibold text-gray-500 mb-1";
    const valueClass = "text-gray-800 text-sm sm:text-base break-words"; // Allow breaking words
    const itemButtonClass = (isSelected) => `
        w-full text-left p-3 border rounded-md transition-all duration-200 ease-in-out
        flex justify-between items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400
        ${isSelected
            ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300 shadow-inner'
            : 'bg-gray-50 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
        }
    `;
    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-sm";
    const proceedButtonClass = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out inline-flex items-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-blue-500">
                    {/* Page Header */}
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-blue-600 text-center flex items-center justify-center">
                        <FaShieldAlt className="mr-3" /> Initiate Warranty Claim
                    </h1>

                    {/* Section 1: Bill Details Display */}
                    <section aria-labelledby="bill-info-heading" className={`${cardClass} mb-8`}>
                        <h2 id="bill-info-heading" className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Bill Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div><span className={labelClass}><FaInfoCircle className="inline mr-1.5 text-blue-400"/>Bill Name:</span> <span className={valueClass}>{billData.billName}</span></div>
                            <div><span className={labelClass}><FaStore className="inline mr-1.5 text-blue-400"/>Shop Name:</span> <span className={valueClass}>{billData.shopName}</span></div>
                            <div><span className={labelClass}><FaCalendarAlt className="inline mr-1.5 text-blue-400"/>Purchase Date:</span> <span className={valueClass}>{new Date(billData.purchaseDate).toLocaleDateString()}</span></div>
                            {billData.shopPhoneNumber && <div><span className={labelClass}><FaPhone className="inline mr-1.5 text-blue-400"/>Shop Phone:</span> <span className={valueClass}>{billData.shopPhoneNumber}</span></div>}
                            {billData.shopAddress && <div className="md:col-span-2"><span className={labelClass}><FaMapMarkerAlt className="inline mr-1.5 text-blue-400"/>Shop Address:</span> <span className={valueClass}>{billData.shopAddress}</span></div>}
                        </div>
                         {billData.billImageUrl && (
                             <div className="mt-5 pt-4 border-t">
                                 <p className={labelClass}>Bill Image Preview:</p>
                                 {billData.billImageUrl.toLowerCase().endsWith('.pdf') ? (
                                      <a href={billData.billImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-flex items-center"> View Bill PDF </a>
                                 ) : ( <img src={billData.billImageUrl} alt="Bill Scan" className="max-h-48 rounded border shadow-sm mt-1 object-contain"/> )}
                             </div>
                         )}
                    </section>

                    {/* Section 2: Select Item */}
                    <section aria-labelledby="item-select-heading" className={`${cardClass} mb-8`}>
                        <h2 id="item-select-heading" className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                            <FaListAlt className="mr-2 text-blue-500"/> Select Item for Warranty Claim <span className="text-red-500 ml-1">*</span>
                        </h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar-orange">
                            {billData.items?.length > 0 ? billData.items.map((item, index) => (
                                <button key={index} type="button" onClick={() => handleItemSelection(index)} className={itemButtonClass(selectedItemIndex === index)} aria-pressed={selectedItemIndex === index} >
                                    <div className="flex-grow pr-2"> {/* Added padding right */}
                                        <span className="font-medium text-gray-800 group-hover:text-orange-700">{item.itemName}</span>
                                        <span className="block text-xs text-gray-500">Cost: ₹{item.cost?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${selectedItemIndex === index ? 'bg-orange-500 border-orange-600' : 'border-gray-400'}`}>
                                        {selectedItemIndex === index && <span className="text-white text-xs font-bold">✓</span>}
                                    </div>
                                </button>
                            )) : ( <p className="text-gray-500 italic text-center py-4">No items found on this bill.</p> )}
                        </div>
                         {selectedItemIndex === null && <p className="text-xs text-red-600 mt-2">Please select an item from the list above.</p>}
                    </section>

                    {/* Section 3: Enter Company Name */}
                    <section aria-labelledby="company-heading" className={`${cardClass} mb-8`}>
                         <h2 id="company-heading" className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                            <FaBuilding className="mr-2 text-blue-500"/> Product Company/Brand <span className="text-red-500 ml-1">*</span>
                         </h2>
                         <label htmlFor="companyName" className={`${labelClass} mb-2`}>Enter the name of the company or brand (e.g., Sony, HP, Whirlpool):</label>
                         <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company or Brand Name" className={inputClass} required aria-required="true" />
                         {!companyName.trim() && <p className="text-xs text-red-600 mt-2">Company name is required.</p>}
                    </section>

                    {/* Proceed Button */}
                    <div className="text-center mt-10">
                         <button onClick={handleProceed} disabled={selectedItemIndex === null || !companyName.trim()} className={proceedButtonClass} >
                            Proceed to Confirmation <FaArrowRight className="ml-2" />
                         </button>
                    </div>

                </div>
                 {/* Scrollbar Style */}
                 <style jsx global>{` /* ... custom scrollbar styles ... */ `}</style>
            </div>
        </div>
    );
};

export default WarrantyClaimPage;