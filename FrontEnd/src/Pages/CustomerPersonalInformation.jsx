import React from 'react';

const CustomerPersonalInformation = () => {
    return (
        // Add a background color to the page area and ensure minimum height
        <div className="bg-gray-100 min-h-screen py-8">
            {/* Center the content and apply padding */}
            <div className="container mx-auto px-4">
                {/* Form Card */}
                <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
                    <h1 className="text-3xl font-bold mb-6 text-orange-500 text-center">
                        Personal Information
                    </h1>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out"
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out"
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <input
                                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out"
                                id="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="mb-6"> {/* Increased bottom margin before button */}
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                Address
                            </label>
                            <input
                                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out"
                                id="address"
                                type="text"
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                                type="button" // Use type="submit" if this should submit the form
                            >
                                Update Information
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerPersonalInformation;