// src/Pages/SettingsSecurity.jsx
import React from 'react';
import { FaLock, FaShieldAlt, FaKey } from 'react-icons/fa';

const SettingsSecurity = () => {
    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaLock className="mr-3" /> Security Settings
                    </h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="text-center text-gray-500">
                            Manage your account security settings here. More options coming soon!
                        </p>

                        {/* Placeholder for Change Password */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h2 className="font-semibold mb-2 flex items-center"><FaKey className="mr-2 text-orange-500"/> Change Password</h2>
                            <p className="text-sm text-gray-600 mb-3">Update your password regularly to keep your account secure.</p>
                            <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out opacity-50 cursor-not-allowed" disabled>
                                Change Password (Coming Soon)
                            </button>
                        </div>

                        {/* Placeholder for Two-Factor Authentication */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                             <h2 className="font-semibold mb-2 flex items-center"><FaShieldAlt className="mr-2 text-orange-500"/> Two-Factor Authentication (2FA)</h2>
                            <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account.</p>
                            <button className="text-sm bg-gray-400 text-white font-medium py-2 px-4 rounded-md cursor-not-allowed" disabled>
                                Enable 2FA (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSecurity;