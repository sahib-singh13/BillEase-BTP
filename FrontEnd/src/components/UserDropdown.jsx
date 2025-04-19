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
        const originalStyle = window.getComputedStyle(document.body).overflow; // Store original style
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalStyle; // Restore original on close
        }
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = originalStyle;
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
    const menuIconClass = "h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3 flex-shrink-0";
    const menuTextClass = "text-gray-700 group-hover:text-orange-600 font-medium transition-colors text-sm";

    // Determine Profile Picture Source
    const profilePictureSrc = user?.profilePictureUrl || null;

    return (
        <>
            {/* Semi-transparent backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-out"
                    onClick={onClose} // Close on backdrop click
                    aria-hidden="true"
                />
            )}

            {/* Dropdown sidebar panel */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 z-50 flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button" // Assuming trigger button has this ID
            >
                {/* Header Section */}
                <div className="p-4 bg-gradient-to-b from-orange-50 to-white border-b border-orange-100 relative flex-shrink-0">
                    <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400"
                        onClick={onClose}
                        aria-label="Close user menu"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                    <div className="flex items-center pt-1">
                        <div className="relative shrink-0 mr-3">
                            {/* Profile Picture or Placeholder */}
                            {profilePictureSrc ? (
                                 <img
                                    src={profilePictureSrc}
                                    alt="User Avatar"
                                    className="h-14 w-14 rounded-full border-2 border-orange-200 object-cover shadow-sm"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { // Hide image on error
                                        e.target.style.visibility = 'hidden';
                                        // Could potentially replace with a placeholder element here too
                                     }}
                                />
                            ) : (
                                <div className="h-14 w-14 rounded-full border-2 border-orange-200 bg-orange-100 flex items-center justify-center shadow-sm">
                                     <FaUserCircle className="h-8 w-8 text-orange-400" />
                                 </div>
                            )}
                        </div>
                        {/* User Name and Email */}
                        <div className="overflow-hidden">
                            <p className="font-semibold text-gray-800 text-base leading-tight truncate" title={user?.name || 'Billease User'}>
                                {user?.name || 'Billease User'}
                            </p>
                            <p className="text-sm text-orange-600 font-medium truncate" title={user?.email || ''}>
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Menu Items Section */}
                <nav className="flex-grow overflow-y-auto divide-y divide-gray-100 pb-4 custom-scrollbar-orange">

                    {/* --- Navigation Links --- */}
                    <NavLink to="/customerPersonalInformation" className={menuItemClass} onClick={onClose} >
                        <FaInfoCircle className={menuIconClass} /> <span className={menuTextClass}>Personal Information</span>
                    </NavLink>
                    <NavLink to="/customerDashboard" className={menuItemClass} onClick={onClose}>
                        <FaFileInvoice className={menuIconClass} /> <span className={menuTextClass}>Manage Bills</span>
                    </NavLink>
                    <NavLink to="/settings-security" className={menuItemClass} onClick={onClose}>
                        <FaLock className={menuIconClass} /> <span className={menuTextClass}>Security Settings</span>
                    </NavLink>
                    <NavLink to="/settings-devices" className={menuItemClass} onClick={onClose}>
                        <FaDesktop className={menuIconClass} /> <span className={menuTextClass}>Manage Devices</span>
                    </NavLink>
                    <NavLink to="/settings-billing" className={menuItemClass} onClick={onClose}>
                        <FaCreditCard className={menuIconClass} /> <span className={menuTextClass}>Billing & Subscription</span>
                    </NavLink>
                    <NavLink to="/settings-payment-history" className={menuItemClass} onClick={onClose}>
                        <FaHistory className={menuIconClass} /> <span className={menuTextClass}>Payment History</span>
                    </NavLink>
                    <NavLink to="/settings-notifications" className={menuItemClass} onClick={onClose}>
                        <FaBell className={menuIconClass} /> <span className={menuTextClass}>Notification Settings</span>
                    </NavLink>
                    <NavLink to="/helpandsupport" className={menuItemClass} onClick={onClose}>
                        <FaQuestionCircle className={menuIconClass} /> <span className={menuTextClass}>Help and Support</span>
                    </NavLink>
                    <NavLink to="/settings-general" className={menuItemClass} onClick={onClose}> {/* Changed path */}
                        <FaCog className={menuIconClass} /> <span className={menuTextClass}>Settings</span>
                    </NavLink>

                    {/* --- Log Out Button --- */}
                    <button
                        onClick={handleLogoutClick}
                        className={`${menuItemClass} text-red-600 hover:bg-red-50`} // Specific styling for logout
                    >
                        <FaSignOutAlt className={`${menuIconClass} text-red-400 group-hover:text-red-600`} />
                        <span className={`${menuTextClass} text-red-600 group-hover:text-red-700 font-semibold`}> Log Out </span>
                    </button>
                    {/* --- End Log Out Button --- */}
                </nav>

                {/* Optional Footer */}
                <div className="p-3 text-xs text-center text-gray-400 border-t border-gray-100 flex-shrink-0">
                    Billease © {new Date().getFullYear()}
                </div>

                {/* Custom Scrollbar CSS */}
                <style jsx global>{`
                    .custom-scrollbar-orange::-webkit-scrollbar { width: 6px; height: 6px; }
                    .custom-scrollbar-orange::-webkit-scrollbar-track { background: #fff7ed; border-radius: 10px; }
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb { background: #fb923c; border-radius: 10px; border: 1px solid #fff7ed; }
                    .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover { background: #f97316; }
                    .custom-scrollbar-orange { scrollbar-width: thin; scrollbar-color: #fb923c #fff7ed; }
                `}</style>
            </div>
        </>
    );
};

export default UserDropdown;