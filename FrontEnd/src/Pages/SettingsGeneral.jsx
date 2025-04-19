// src/Pages/SettingsGeneral.jsx
import React from 'react';
import { FaCog, FaLanguage, FaPalette } from 'react-icons/fa';

const SettingsGeneral = () => {
    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center flex items-center justify-center">
                        <FaCog className="mr-3" /> General Settings
                    </h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="text-center text-gray-500">
                            Manage general application preferences. (Functionality coming soon)
                        </p>

                        {/* Placeholder for Language */}
                         <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h2 className="font-semibold mb-2 flex items-center"><FaLanguage className="mr-2 text-orange-500"/> Language</h2>
                            <p className="text-sm text-gray-600 mb-3">Select your preferred language.</p>
                            {/* Basic Select Placeholder */}
                            <select className="w-full p-2 border border-gray-300 rounded-md text-sm cursor-not-allowed opacity-50 bg-gray-200" disabled>
                                <option>English (United States)</option>
                                {/* Add other language options later */}
                            </select>
                         </div>

                          {/* Placeholder for Theme */}
                          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h2 className="font-semibold mb-2 flex items-center"><FaPalette className="mr-2 text-orange-500"/> Theme</h2>
                            <p className="text-sm text-gray-600 mb-3">Choose your preferred interface theme.</p>
                             {/* Basic Radio Placeholders */}
                             <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                                    <input type="radio" name="theme" value="light" checked disabled className="text-orange-500 focus:ring-orange-500"/>
                                    <span className="text-sm">Light</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                                     <input type="radio" name="theme" value="dark" disabled className="text-orange-500 focus:ring-orange-500"/>
                                    <span className="text-sm">Dark</span>
                                </label>
                                 <label className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                                     <input type="radio" name="theme" value="system" disabled className="text-orange-500 focus:ring-orange-500"/>
                                    <span className="text-sm">System</span>
                                </label>
                             </div>
                         </div>
                          <p className="text-center text-gray-400 text-xs mt-6 italic">
                            General settings functionality coming soon.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsGeneral;