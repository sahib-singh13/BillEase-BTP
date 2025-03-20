import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell, FaCog, FaCreditCard, FaDesktop, FaFileInvoice, FaHistory, FaInfoCircle, FaLock, FaQuestionCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const UserDropdown = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-500 ease-out border-l border-orange-50 z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 bg-gradient-to-b from-orange-50 to-orange-25 border-b border-orange-100 relative">
                    <button
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                    <div className="flex items-center">
                        <div className="relative shrink-0">
                            <img
                                src="/user.jpg"
                                alt="User Avatar"
                                className="h-14 w-14 rounded-full mr-3 border-2 border-orange-200 object-cover"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-lg leading-tight">John Doe</p>
                            <p className="text-sm text-orange-600 font-medium">john.doe@example.com</p>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Bills Registered:</span>
                        <span className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full font-semibold">5</span>
                    </div>
                </div>

                <div className="divide-y divide-orange-50 overflow-y-auto h-full">
                    <NavLink
                        to="/customerPersonalInformation" // Update the link to the new page
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaInfoCircle className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Personal Information
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaFileInvoice className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Manage Bills
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaLock className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            2-Step Verification
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaDesktop className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Manage Authorized Devices
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaCreditCard className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Billing and Subscription
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaHistory className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Manage Payment History
                        </span>
                    </NavLink>

                    <NavLink
                        to="/notifications/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaBell className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Manage Notification Settings
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaQuestionCircle className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Help and Support
                        </span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                        onClick={onClose}
                    >
                        <FaCog className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Settings
                        </span>
                    </NavLink>

                    <NavLink
                        to="/customerLogin"
                        className="w-full flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                    >
                        <FaSignOutAlt className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3" />
                        <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                            Log Out
                        </span>
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default UserDropdown;