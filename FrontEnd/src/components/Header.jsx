// src/components/Header.js
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
    // State for fade-in animation
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      // Trigger fade-in shortly after component mounts
      const timer = setTimeout(() => setIsLoaded(true), 50); // Adjust delay if needed
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    return (
        // Removed border-b, added gradient, softer shadow, animation class
        <header className={`shadow-md sticky z-50 top-0 bg-gradient-to-r from-white to-orange-50 transition-opacity duration-500 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <nav className="px-4 lg:px-6 py-3"> {/* Adjusted padding */}
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse"> {/* Added spacing */}
                        <img
                            src="/logo-orange.png"
                            className="h-12" // Slightly smaller logo
                            alt="BillEase Logo"
                        />
                        <span className="self-center text-2xl font-bold whitespace-nowrap text-orange-600 tracking-tight"> {/* Styled text */}
                            BillEase
                        </span>
                    </Link>
                    {/* Mobile menu button would go here if needed */}
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2" // Keep ID if used for mobile
                    >
                        {/* Updated NavLink styling */}
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-10 lg:mt-0"> {/* Increased spacing */}
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 duration-200 transition-colors rounded-md ${isActive ? "text-orange-600 font-semibold bg-orange-100/60" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"} lg:bg-transparent lg:hover:bg-transparent lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 duration-200 transition-colors rounded-md ${isActive ? "text-orange-600 font-semibold bg-orange-100/60" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"} lg:bg-transparent lg:hover:bg-transparent lg:p-0`
                                    }
                                >
                                    Contact Us
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        `block py-2 px-3 duration-200 transition-colors rounded-md ${isActive ? "text-orange-600 font-semibold bg-orange-100/60" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"} lg:bg-transparent lg:hover:bg-transparent lg:p-0`
                                    }
                                >
                                    About Us
                                </NavLink>
                            </li>
                            <li>
                                <a // Changed to 'a' for external link
                                    href="https://github.com/sahib-singh13"
                                    target="_blank" // Open in new tab
                                    rel="noopener noreferrer" // Security best practice
                                    className="block py-2 px-3 duration-200 transition-colors rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 lg:bg-transparent lg:hover:bg-transparent lg:p-0"
                                >
                                    Github
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}