// src/Pages/SettingsNotifications.jsx
import React from 'react';
import { FaBell, FaEnvelope, FaSms } from 'react-icons/fa';

const SettingsNotifications = () => {

    // Placeholder function for toggle switch
    const ToggleSwitch = ({ label, enabled }) => (
        <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-gray-700">{label}</span>
             {/* Basic visual toggle - replace with actual switch component later */}
            <button
                type="button"
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${enabled ? 'bg-orange-500' : 'bg-gray-300'
                    } opacity-50 cursor-not-allowed`}
                disabled
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );


    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaBell className="mr-3" /> Notification Settings
                    </h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="text-center text-gray-500">
                            Choose how you receive notifications from Billease. (Functionality coming soon)
                        </p>

                        {/* Placeholder Notification Toggles */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 divide-y divide-gray-200">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">General Notifications</h3>
                            <ToggleSwitch label="Receive Email Notifications" enabled={true} />
                            <ToggleSwitch label="Receive SMS Notifications" enabled={false} />
                            <ToggleSwitch label="Receive In-App Notifications" enabled={true} />
                        </div>

                         <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 divide-y divide-gray-200">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Bill Reminders</h3>
                            <ToggleSwitch label="Email Reminder for Due Bills" enabled={true} />
                            <ToggleSwitch label="SMS Reminder for Due Bills" enabled={false} />
                        </div>

                         <p className="text-center text-gray-400 text-xs mt-6 italic">
                            Notification preferences saving functionality coming soon.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsNotifications;