// src/Pages/CustomerPersonalInformation.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaCamera, FaSave, FaSpinner, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // To get user data and update function
import api from '../services/api'; // To make API calls

const CustomerPersonalInformation = () => {
    const { user, isLoading: isAuthLoading, updateUserContext } = useAuth(); // Get user and context update function
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for this specific form
    const [error, setError] = useState(null);
    const [isDirty, setIsDirty] = useState(false); // Track if form data changed

    // Form state - initialize with context data or empty strings
    const [formData, setFormData] = useState({
        name: '',
        email: '', // Email usually not editable, display only
        phoneNumber: '',
        address: '',
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null); // Holds the selected file object
    const [profilePicturePreview, setProfilePicturePreview] = useState(null); // Holds the preview URL
    const fileInputRef = useRef(null); // Ref to access file input

    // Effect to populate form when user data is available from context
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '', // Display email
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
            });
            setProfilePicturePreview(user.profilePictureUrl || null); // Set initial preview from user data
            setIsDirty(false); // Reset dirty state when user data loads
            setProfilePictureFile(null); // Clear any previously selected file state
        }
    }, [user]); // Rerun when user object changes in context

    // Handle changes in text inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true); // Mark form as dirty
    };

    // Handle file selection for profile picture
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Basic validation (type and size)
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type. Please select a JPG, PNG, WEBP, or GIF image.");
                return;
            }
            const maxSize = 5 * 1024 * 1024; // 5MB limit (adjust as needed)
            if (file.size > maxSize) {
                 toast.error(`File size exceeds the limit of ${maxSize / 1024 / 1024}MB.`);
                 return;
            }

            setProfilePictureFile(file); // Store the file object
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result); // Set preview state
            };
            reader.readAsDataURL(file);
            setIsDirty(true); // Mark form as dirty
        }
    };

    // Trigger file input click
    const handleEditPictureClick = () => {
        fileInputRef.current?.click();
    };

    // Handle form submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError(null);

        // Only submit if something actually changed
        if (!isDirty) {
             toast("No changes to save.", { icon: 'ℹ️' });
             return;
        }

        // Basic validation (optional, backend handles more)
        if (!formData.name.trim()) {
            toast.error("Name cannot be empty."); return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Updating profile...');

        const dataToSend = new FormData();
        // Append fields only if they changed from the original user state
        // Or simply append all relevant fields (backend handles logic) - simpler approach:
        dataToSend.append('name', formData.name);
        dataToSend.append('phoneNumber', formData.phoneNumber);
        dataToSend.append('address', formData.address);
        // Append file only if a new one was selected
        if (profilePictureFile) {
            dataToSend.append('profilePicture', profilePictureFile);
        }

        try {
            // Use the api service to make the PATCH request
            const response = await api.patch('/auth/profile', dataToSend);

            if (response.data.success) {
                toast.success('Profile updated successfully!', { id: toastId });
                updateUserContext(response.data.user); // Update the user in AuthContext
                setIsDirty(false); // Reset dirty state on success
                setProfilePictureFile(null); // Clear file state after successful upload
                // Preview will be updated by the useEffect watching 'user'
            } else {
                // Handle potential backend failure response
                throw new Error(response.data?.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Profile Update Error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile.';
            setError(errorMessage); // Set local error state for display if needed
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state from AuthContext (for initial load) + form submitting state
    const isLoading = isAuthLoading || isSubmitting;

    return (
        <div className="bg-gradient-to-br from-orange-50 via-gray-50 to-blue-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl"> {/* Adjusted max-width */}
                {/* Form Card */}
                <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-orange-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-orange-600 text-center">
                        Personal Information
                    </h1>

                    {/* Display error message */}
                    {error && (
                       <div className="mb-6 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {error}
                       </div>
                    )}

                    <form onSubmit={handleUpdateProfile} noValidate>
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                {/* Display current picture or placeholder */}
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Profile"
                                        className="h-32 w-32 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-orange-100 border-4 border-orange-100 flex items-center justify-center shadow-md">
                                        <FaUserCircle className="h-20 w-20 text-orange-300" />
                                    </div>
                                )}
                                {/* Edit Button Overlay */}
                                <button
                                    type="button"
                                    onClick={handleEditPictureClick}
                                    disabled={isLoading}
                                    className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                    aria-label="Change profile picture"
                                >
                                    <FaCamera className="h-8 w-8" />
                                </button>
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/webp, image/gif"
                                    disabled={isLoading}
                                />
                            </div>
                             <p className="text-xs text-gray-500 mt-2">Click image to change (Max 5MB)</p>
                        </div>

                        {/* Text Fields */}
                        <div className="grid grid-cols-1 gap-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name"> Name * </label>
                                <input
                                    className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out disabled:bg-gray-100"
                                    id="name" name="name" type="text" placeholder="Your full name"
                                    value={formData.name} onChange={handleChange} required disabled={isLoading}
                                />
                            </div>
                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email"> Email </label>
                                <input
                                    className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2.5 px-4 text-gray-500 bg-gray-100 cursor-not-allowed leading-tight focus:outline-none"
                                    id="email" name="email" type="email" placeholder="Your email address"
                                    value={formData.email} readOnly disabled // Make it read-only
                                />
                                 <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber"> Phone </label>
                                <input
                                    className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out disabled:bg-gray-100"
                                    id="phoneNumber" name="phoneNumber" type="tel" placeholder="Your phone number (optional)"
                                    value={formData.phoneNumber} onChange={handleChange} disabled={isLoading}
                                />
                            </div>
                            {/* Address */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address"> Address </label>
                                <textarea // Use textarea for address
                                    className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 ease-in-out disabled:bg-gray-100 min-h-[80px]" // Min height
                                    id="address" name="address" placeholder="Your address (optional)"
                                    value={formData.address} onChange={handleChange} disabled={isLoading} rows={3}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center mt-10">
                            <button
                                className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out inline-flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${isDirty ? '' : 'opacity-60 cursor-not-allowed'}`}
                                type="submit"
                                disabled={isLoading || !isDirty} // Disable if loading or no changes
                            >
                                {isLoading ? (
                                    <> <FaSpinner className="animate-spin mr-2" /> Updating... </>
                                ) : (
                                    <> <FaSave className="mr-2" /> Update Information </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerPersonalInformation;