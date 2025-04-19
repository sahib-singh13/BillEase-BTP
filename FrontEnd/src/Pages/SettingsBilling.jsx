// src/Pages/SettingsBilling.jsx
import React from 'react';
import { FaCreditCard, FaReceipt, FaSyncAlt } from 'react-icons/fa';

const SettingsBilling = () => {
    // Placeholder data
    const currentPlan = 'Free Tier';
    const nextBillingDate = 'N/A';
    const paymentMethod = 'None Added';

    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaCreditCard className="mr-3" /> Billing & Subscription
                    </h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="text-center text-gray-500">
                            View your current subscription plan and manage billing details. (Functionality coming soon)
                        </p>

                        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-inner space-y-3">
                            <div>
                                <span className="font-semibold text-gray-600">Current Plan:</span>
                                <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">{currentPlan}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600">Next Billing Date:</span>
                                <span className="ml-2 text-gray-800">{nextBillingDate}</span>
                            </div>
                             <div>
                                <span className="font-semibold text-gray-600">Payment Method:</span>
                                <span className="ml-2 text-gray-800">{paymentMethod}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                             <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out opacity-50 cursor-not-allowed flex items-center justify-center" disabled>
                                <FaSyncAlt className="mr-2"/> Change Plan (Coming Soon)
                             </button>
                             <button className="text-sm bg-gray-400 text-white font-medium py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center" disabled>
                                 <FaReceipt className="mr-2"/> View Invoices (Coming Soon)
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsBilling;