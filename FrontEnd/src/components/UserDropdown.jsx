// src/components/UserDropdown.jsx

import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaBell, FaCog, FaCreditCard, FaDesktop, FaFileInvoice, FaHistory,
    FaInfoCircle, FaLock, FaQuestionCircle, FaSignOutAlt, FaTimes, FaUserCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const UserDropdown = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth(); // Get logout function and user from context
    const navigate = useNavigate(); // Hook for navigation

    // Effect to handle body scroll lock when the dropdown is open
    useEffect(() => {
        if (isOpen) {
            // Prevent scrolling on the body
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scrolling
            document.body.style.overflow = 'auto';
        }
        // Cleanup function to restore scroll when component unmounts or isOpen changes to false
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Function to handle the logout action
    const handleLogoutClick = () => {
        logout(); // Call the logout function from AuthContext
        onClose(); // Close the dropdown visually
        navigate('/customerLogin'); // Redirect user to the login page
    };

    // Reusable CSS classes for menu items for consistency
    const menuItemClass = "flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group w-full text-left";
    const menuIconClass = "h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3 flex-shrink-0"; // Added flex-shrink-0
    const menuTextClass = "text-gray-700 group-hover:text-orange-600 font-medium transition-colors text-sm"; // Set text size

    return (
        <>
            {/* Semi-transparent backdrop overlay, shown when dropdown is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-out" // Added transition
                    onClick={onClose} // Allows closing the dropdown by clicking outside
                    aria-hidden="true" // Indicate it's decorative for screen readers
                />
            )}

            {/* The actual dropdown sidebar panel */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 z-50 flex flex-col ${ // Main container is flex column
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="menu" // Semantic role
                aria-orientation="vertical"
                aria-labelledby="user-menu-button" // Assuming your trigger button has id="user-menu-button"
            >
                {/* Header Section of the Dropdown */}
                <div className="p-4 bg-gradient-to-b from-orange-50 to-white border-b border-orange-100 relative flex-shrink-0"> {/* Use white at bottom for smoother transition */}
                    <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                        onClick={onClose}
                        aria-label="Close user menu" // Accessibility label
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                    <div className="flex items-center pt-1"> {/* Added padding top */}
                        <div className="relative shrink-0 mr-3"> {/* Added margin-right */}
                            {/* Conditionally render user picture or default icon */}
                            {user?.picture ? (
                                 <img
                                    src={user.picture} // Use picture from Google if available
                                    alt="User Avatar"
                                    className="h-14 w-14 rounded-full border-2 border-orange-200 object-cover shadow-sm"
                                    referrerPolicy="no-referrer" // Good practice for external images
                                />
                            ) : (
                                // Default icon placeholder
                                <div className="h-14 w-14 rounded-full border-2 border-orange-200 bg-orange-100 flex items-center justify-center shadow-sm">
                                     <FaUserCircle className="h-8 w-8 text-orange-400" />
                                 </div>
                            )}
                        </div>
                        {/* User Name and Email */}
                        <div className="overflow-hidden"> {/* Prevent text overflow */}
                            <p
                                className="font-semibold text-gray-800 text-base leading-tight truncate" // Adjusted size/leading
                                title={user?.name || 'Billease User'} // Tooltip for long names
                            >
                                {user?.name || 'Billease User'} {/* Display name from context */}
                            </p>
                            <p
                                className="text-sm text-orange-600 font-medium truncate"
                                title={user?.email || ''} // Tooltip for long emails
                            >
                                {user?.email || ''} {/* Display email from context */}
                            </p>
                        </div>
                    </div>
                    {/* Placeholder for Bill Count - requires data source */}
                    {/* <div className="mt-3 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Bills Registered:</span>
                        <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">?</span>
                    </div> */}
                </div>

                {/* Scrollable Menu Items Section */}
                {/* Added flex-grow to make this section fill remaining space */}
                {/* Added pb-4 for padding at the bottom */}
                <nav className="flex-grow overflow-y-auto divide-y divide-gray-100 pb-4 custom-scrollbar-orange"> {/* Added custom scrollbar class */}

                    {/* --- Navigation Links --- */}
                    <NavLink to="/customerPersonalInformation" className={menuItemClass} onClick={onClose} >
                        <FaInfoCircle className={menuIconClass} /> <span className={menuTextClass}>Personal Information</span>
                    </NavLink>

                    {/* Example: Link to Dashboard could be here if needed */}
                    {/* <NavLink to="/customerDashboard" className={menuItemClass} onClick={onClose}>
                        <FaFileInvoice className={menuIconClass} /> <span className={menuTextClass}>Manage Bills</span>
                    </NavLink> */}

                    <NavLink to="/settings/security" className={menuItemClass} onClick={onClose}>
                        <FaLock className={menuIconClass} /> <span className={menuTextClass}>Security Settings</span>
                    </NavLink>

                    <NavLink to="/settings/devices" className={menuItemClass} onClick={onClose}>
                        <FaDesktop className={menuIconClass} /> <span className={menuTextClass}>Manage Devices</span>
                    </NavLink>

                    <NavLink to="/settings/billing" className={menuItemClass} onClick={onClose}>
                        <FaCreditCard className={menuIconClass} /> <span className={menuTextClass}>Billing & Subscription</span>
                    </NavLink>

                    <NavLink to="/settings/payment-history" className={menuItemClass} onClick={onClose}>
                        <FaHistory className={menuIconClass} /> <span className={menuTextClass}>Payment History</span>
                    </NavLink>

                    <NavLink to="/settings/notifications" className={menuItemClass} onClick={onClose}>
                        <FaBell className={menuIconClass} /> <span className={menuTextClass}>Notification Settings</span>
                    </NavLink>

                    <NavLink to="/helpandsupport" className={menuItemClass} onClick={onClose}>
                        <FaQuestionCircle className={menuIconClass} /> <span className={menuTextClass}>Help and Support</span>
                    </NavLink>

                    <NavLink to="/settings" className={menuItemClass} onClick={onClose}>
                        <FaCog className={menuIconClass} /> <span className={menuTextClass}>Settings</span>
                    </NavLink>

                    {/* --- Log Out Button --- */}
                    {/* Uses button element for semantic correctness */}
                    <button
                        onClick={handleLogoutClick}
                        className={`${menuItemClass} text-red-600 hover:bg-red-50`} // Specific hover/text color for logout
                    >
                        <FaSignOutAlt className={`${menuIconClass} text-red-400 group-hover:text-red-600`} /> {/* Icon color matches text */}
                        <span className={`${menuTextClass} text-red-600 group-hover:text-red-700`}> Log Out </span>
                    </button>
                    {/* --- End Log Out Button --- */}
                </nav>

                {/* Optional Footer inside the dropdown */}
                {/* <div className="p-3 text-xs text-center text-gray-400 border-t border-gray-100 flex-shrink-0">
                    Billease © {new Date().getFullYear()}
                </div> */}

                {/* Custom Scrollbar CSS (Scoped if possible, or global) */}
                <style jsx global>{`
                    .custom-scrollbar-orange::-webkit-scrollbar { width: 6px; height: 6px; }
                    .custom-scrollbar-orange::-webkit-scrollbar-track { background: #fff7ed; border-radius: 10px; } /* Very light orange */
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb { background: #fb923c; border-radius: 10px; border: 1px solid #fff7ed; } /* Orange-400 */
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover { background: #f97316; } /* Orange-500 */
                    .custom-scrollbar-orange { scrollbar-width: thin; scrollbar-color: #fb923c #fff7ed; }
                `}</style>
            </div>
        </>
    );
};

export default UserDropdown;