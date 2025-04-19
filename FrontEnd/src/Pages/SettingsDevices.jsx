// src/Pages/SettingsDevices.jsx
import React from 'react';
import { FaDesktop, FaMobileAlt, FaSignOutAlt } from 'react-icons/fa';

const SettingsDevices = () => {
    // Placeholder data - replace with actual data later
    const devices = [
        { id: 1, type: 'Desktop', browser: 'Chrome', os: 'Windows 11', location: 'Anytown, USA', lastActive: 'Now', current: true },
        { id: 2, type: 'Mobile', browser: 'Safari', os: 'iOS 16.5', location: 'Otherville, USA', lastActive: '2 days ago', current: false },
    ];

    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-3xl"> {/* Wider container */}
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaDesktop className="mr-3" /> Manage Devices
                    </h1>

                    <p className="text-center text-gray-500 mb-6">
                        Review devices currently logged into your account. You can sign out devices you don't recognize or no longer use.
                    </p>

                    <div className="space-y-4">
                        {devices.map((device) => (
                            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                <div className="flex items-center">
                                    {device.type === 'Desktop' ? (
                                        <FaDesktop className="h-8 w-8 text-orange-500 mr-4" />
                                    ) : (
                                        <FaMobileAlt className="h-8 w-8 text-orange-500 mr-4" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {device.os} - {device.browser}
                                            {device.current && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current device</span>}
                                        </p>
                                        <p className="text-sm text-gray-500">{device.location} • Last active: {device.lastActive}</p>
                                    </div>
                                </div>
                                {!device.current && (
                                    <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center opacity-50 cursor-not-allowed" title="Functionality coming soon" disabled>
                                        <FaSignOutAlt className="mr-1" /> Sign Out
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                     <p className="text-center text-gray-400 text-xs mt-6 italic">
                        Device management functionality coming soon.
                     </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsDevices;