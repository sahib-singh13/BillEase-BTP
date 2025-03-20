import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const RetailerUserDropdown = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl origin-top-right transform transition-all duration-300 ease-out border border-orange-50"
            style={{
                transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
                opacity: isOpen ? 1 : 0,
                boxShadow: '0 10px 30px -10px rgba(255, 107, 0, 0.15)'
            }}
        >
            {/* User Header Section */}
            <div className="p-4 bg-gradient-to-b from-orange-50 to-orange-25 rounded-t-lg border-b border-orange-100">
                <div className="flex items-center">
                    <div className="relative shrink-0">
                        <img
                            src="/user.jpg"
                            alt="User Avatar"
                            className="h-14 w-14 rounded-full mr-3 border-2 border-orange-200 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm"/>
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

            {/* Dropdown Menu Items */}
            <div className="divide-y divide-orange-50">
                <NavLink
                    to="/settings"
                    className="flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                    onClick={onClose}
                >
                    <FaCog className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3"/>
                    <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                        Settings
                    </span>
                </NavLink>
                
                <button
                    className="w-full flex items-center p-3.5 hover:bg-orange-50 transition-colors duration-200 group"
                    onClick={onClose}
                >
                    <FaSignOutAlt className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors mr-3"/>
                    <span className="text-gray-700 group-hover:text-orange-600 font-medium transition-colors">
                        Log Out
                    </span>
                </button>
            </div>
        </div>
    );
};

export default RetailerUserDropdown;