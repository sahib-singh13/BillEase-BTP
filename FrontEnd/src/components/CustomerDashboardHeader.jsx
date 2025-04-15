import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Import the user icon
import UserDropdown from './UserDropdown'; // Assuming this component exists and is styled appropriately

const CustomerDashboardHeader = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Close dropdown if clicking outside of it
    useEffect(() => {
        const closeUserDropdown = (e) => {
            // Check if the click is outside the dropdown ref and not on the toggle button itself (optional, good practice)
            // The button check might be redundant if the button is inside the ref, but good defensively
             if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(e.target)
             ) {
                 setIsUserDropdownOpen(false);
             }
        };

        document.addEventListener('mousedown', closeUserDropdown);
        return () => {
            document.removeEventListener('mousedown', closeUserDropdown);
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    return (
        // Header: Subtle shadow, sticky positioning, white background for cleanliness
        <header className="shadow-md sticky z-50 top-0 bg-white">
            {/* Navigation Container: Standard padding, centered content */}
            <nav className="border-gray-200 px-4 lg:px-6 py-3"> {/* Slightly adjusted padding */}
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    {/* Logo and Brand Name */}
                    <Link to="/" className="flex items-center group"> {/* Added group for potential hover effects */}
                        <img
                            src="/logo-orange.png" // Ensure this path is correct relative to your public folder
                            className="mr-3 h-14 sm:h-16 transition-transform duration-200 ease-in-out group-hover:scale-105" // Slightly smaller base height, added hover effect
                            alt="Billease Logo"
                        />
                        {/* Adjusted heading style */}
                        <h1 className="text-orange-500 font-bold text-xl sm:text-2xl tracking-wide transition-colors duration-200 group-hover:text-orange-600">
                            BILLEASE
                        </h1>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="desktop-menu" // Changed id for clarity
                    >
                        {/* Use items-center to vertically align icon button with text links */}
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-6 xl:space-x-8 lg:mt-0 items-center">
                            <li>
                                <NavLink
                                    to="/customerDashboard"
                                    // Consistent styling for nav links
                                    className={({ isActive }) =>
                                        `block py-2 px-3 lg:p-0 transition-colors duration-200 ease-in-out rounded-md lg:rounded-none ${
                                            isActive
                                                ? 'text-orange-600 font-semibold bg-orange-50 lg:bg-transparent' // Active state: orange text, subtle bg on mobile
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100 lg:hover:bg-transparent' // Default state: gray text, hover orange text, subtle bg hover on mobile
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/contact"
                                    // Apply the same styling logic
                                     className={({ isActive }) =>
                                        `block py-2 px-3 lg:p-0 transition-colors duration-200 ease-in-out rounded-md lg:rounded-none ${
                                            isActive
                                                ? 'text-orange-600 font-semibold bg-orange-50 lg:bg-transparent'
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100 lg:hover:bg-transparent'
                                        }`
                                    }
                                >
                                    Contact Us
                                </NavLink>
                            </li>

                            {/* User Icon Dropdown Trigger */}
                            {/* Use the ref on the parent li for easier click-outside detection */}
                            <li className="relative ml-2 lg:ml-4" ref={userDropdownRef}>
                                <button
                                    onClick={toggleUserDropdown}
                                    // Style the button for better interaction: padding, rounding, focus state
                                    className="p-2 rounded-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 transition-all duration-200 ease-in-out flex items-center"
                                    aria-label="User menu"
                                    aria-expanded={isUserDropdownOpen}
                                    aria-haspopup="true" // Indicate it triggers a popup menu
                                >
                                    <FaUser className="h-5 w-5" />
                                </button>

                                {/* User Dropdown Component */}
                                {/* Render the dropdown conditionally. Ensure UserDropdown handles its own absolute positioning and styling */}
                                <UserDropdown
                                    isOpen={isUserDropdownOpen}
                                    onClose={() => setIsUserDropdownOpen(false)} // Pass close handler
                                />
                            </li>
                        </ul>
                    </div>
                     {/* Add a Mobile Menu Button here if needed */}
                     {/* Example:
                     <div className="lg:hidden">
                         <button // Add onClick handler to toggle mobile menu state
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                            aria-label="Open main menu"
                          >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-8 6h8" />
                            </svg>
                         </button>
                     </div>
                     */}
                     {/* The mobile menu itself would typically be rendered conditionally below the header or overlayed */}
                </div>
            </nav>
        </header>
    );
};

export default CustomerDashboardHeader;