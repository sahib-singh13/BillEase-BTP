// src/Pages/SettingsPaymentHistory.jsx
import React from 'react';
import { FaHistory, FaDownload } from 'react-icons/fa';

const SettingsPaymentHistory = () => {
    // Placeholder data - replace with actual data later
    const payments = [
        // { id: 'inv-123', date: '2023-10-01', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
        // { id: 'inv-101', date: '2023-09-01', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
    ];

    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-3xl"> {/* Wider container */}
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaHistory className="mr-3" /> Payment History
                    </h1>

                    <p className="text-center text-gray-500 mb-6">
                        Review your past payments and download invoices. (Functionality coming soon)
                    </p>

                    <div className="overflow-x-auto">
                         {payments.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.plan}</td>
                                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-orange-600 hover:text-orange-800 opacity-50 cursor-not-allowed" disabled title="Coming Soon"><FaDownload /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         ) : (
                            <p className="text-center text-gray-500 py-10 italic">No payment history available yet.</p>
                         )}
                    </div>
                     <p className="text-center text-gray-400 text-xs mt-6 italic">
                        Payment history display and invoice download functionality coming soon.
                     </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPaymentHistory;