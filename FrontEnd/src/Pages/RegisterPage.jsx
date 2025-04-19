// src/Pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Keep FaSpinner for button
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isLoading: isAuthLoading, isAuthenticated, handleGoogleAuth } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/customerDashboard'); // Redirect if already logged in
        }
    }, [isAuthenticated, navigate]);

    // Handler for email/password registration
    const handleEmailPasswordSubmit = async (event) => {
        event.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields."); return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match."); return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long."); return;
        }
        const success = await register(name, email, password); // Call context register
        if (success) {
            navigate('/customerDashboard');
        }
    };

    // Handler for Google sign-up success
    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("Google Sign up Success:", credentialResponse);
        const success = await handleGoogleAuth(credentialResponse); // Call context handler
        if (success) {
             navigate('/customerDashboard');
        }
        // Error handling is done within handleGoogleAuth in context
    };

    // Handler for Google sign-up error
    const handleGoogleError = () => {
        console.error("Google Sign up Failed");
        toast.error("Google sign up failed. Please try again.");
    };

    // --- Reusable Classes ---
    const inputClass = "mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:bg-gray-200";
    const labelClass = "block text-sm font-medium text-gray-700";
    const buttonBaseClass = "w-full flex justify-center items-center py-3 px-6 rounded-lg font-bold transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

    return (
        <div className={`flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`w-full max-w-lg bg-white shadow-xl rounded-xl p-8 sm:p-10 transition-opacity duration-700 ease-in delay-100 ${isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-3xl font-extrabold text-center text-orange-600">Create an Account</h2>
                <p className="text-gray-600 text-center mt-2 text-lg mb-8">
                  Register to get started!
                </p>

                {/* Registration Form */}
                <form className="space-y-6" onSubmit={handleEmailPasswordSubmit}>
                    <div>
                        <label htmlFor="name" className={labelClass}>Full Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} disabled={isAuthLoading}/>
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={isAuthLoading}/>
                    </div>
                    <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <input type="password" id="password" name="password" placeholder="Create a password (min. 6 characters)" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} disabled={isAuthLoading}/>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className={labelClass}>Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Re-enter your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} disabled={isAuthLoading}/>
                    </div>
                    {/* Submit Button */}
                    <button type="submit" disabled={isAuthLoading} className={`${buttonBaseClass} bg-orange-600 text-white text-lg hover:bg-orange-500 focus:ring-orange-400 ${isAuthLoading ? 'opacity-70 cursor-wait' : ''}`}>
                       {isAuthLoading ? ( <> <FaSpinner className="animate-spin mr-2" /> Registering... </> ) : 'Register'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                    <p className="text-center text-sm text-gray-500 mx-4">OR</p>
                </div>

                {/* Google Sign Up Button */}
                 <div className="flex justify-center">
                     <GoogleLogin
                         onSuccess={handleGoogleSuccess}
                         onError={handleGoogleError}
                         useOneTap // Optional
                         theme="outline"
                         size="large"
                         shape="rectangular"
                         width="300px" // Adjust as needed
                         disabled={isAuthLoading} // Disable if email/pass register is loading
                     />
                 </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <NavLink to="/customerLogin" className="text-orange-600 font-medium hover:text-orange-500 transition hover:underline">
                           Login here
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;