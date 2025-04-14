// src/pages/CustomerPage.js (or wherever your component is)
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaSpinner } from 'react-icons/fa'; // Icons

const CustomerPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please enter both email and password.'); // Replace with toast if available
            return;
        }
        setIsSubmitting(true);
        console.log("Login attempt with:", { email, password });
        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/customerDashboard');
            // On failure: alert('Login failed.');
        }, 1500);
    };

    // --- Reusable Classes ---
    const inputBaseClass = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-sm placeholder-gray-400 hover:bg-gray-50/50 disabled:bg-gray-100 bg-white";
    const iconWrapperClass = "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400";

    return (
        // --- Main Container with Circle Animation ---
        <div className="min-h-screen w-full overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 relative">
            {/* Circle Animation Container */}
            <div className="circle-container absolute inset-0 z-0 overflow-hidden">
                {[...Array(35)].map((_, i) => ( // << INCREASED QUANTITY to 35
                    <div key={i} className="circle bg-orange-300/20"
                         style={{
                            '--size': `${Math.random() * 70 + 15}px`,
                            '--delay': `${Math.random() * -15}s`,     // Slightly less negative delay spread
                            '--duration': `${Math.random() * 6 + 6}s`, // << FASTER DURATION (6s-12s)
                            '--x-start': `${Math.random() * 100}%`,
                            '--y-start': `${Math.random() * 100}%`,
                            left: `var(--x-start)`,
                            top: `var(--y-start)`,
                            animation: `appearFadeCircle var(--duration) ease-in-out var(--delay) infinite`,
                         }}>
                    </div>
                ))}
            </div>

             {/* --- Login Card Wrapper --- */}
             <div className={`relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-100 transition-opacity duration-700 ease-in ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                 {/* Header */}
                 <div className="text-center mb-8">
                     <img src="/logo-orange.png" alt="BillEase Logo" className="w-24 h-auto mx-auto mb-4" />
                     <h2 className="text-3xl font-bold text-orange-600 tracking-tight">Welcome Back!</h2>
                     <p className="text-gray-500 mt-2 text-md">Login to manage your bills.</p>
                 </div>

                 {/* Login Form */}
                 <form className="space-y-6" onSubmit={handleSubmit}>
                     {/* Email Input */}
                     <div className="relative">
                         <label htmlFor="email-login" className="sr-only">Email Address</label>
                         <div className={iconWrapperClass}> <FaEnvelope /> </div>
                         <input id="email-login" type="email" name="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputBaseClass} pl-12`} disabled={isSubmitting} />
                     </div>
                     {/* Password Input */}
                     <div className="relative">
                          <label htmlFor="password-login" className="sr-only">Password</label>
                         <div className={iconWrapperClass}> <FaLock /> </div>
                         <input id="password-login" type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputBaseClass} pl-12`} disabled={isSubmitting} />
                     </div>
                     {/* Submit Button */}
                     <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center items-center py-3 px-6 rounded-lg text-white font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
                         {isSubmitting ? ( <> <FaSpinner className="animate-spin mr-2" /> Logging In... </> ) : ( <> <FaSignInAlt className="mr-2" /> Login </> )}
                     </button>
                 </form>

                 {/* Divider */}
                 <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                     <p className="text-center text-sm text-gray-500 mx-4">OR</p>
                 </div>

                 {/* Registration Link */}
                 <div className="text-center">
                     <p className="text-sm text-gray-600">
                         Don't have an account?{' '}
                         <NavLink to="/CustomerRegister" className="font-medium text-orange-600 hover:text-orange-500 hover:underline transition duration-150 ease-in-out flex items-center justify-center sm:inline-flex">
                             <FaUserPlus className="mr-1 inline" /> Register here
                         </NavLink>
                     </p>
                 </div>
             </div>


            {/* --- Global Styles for Simplified Circle Animation --- */}
            <style jsx global>{`
                @keyframes appearFadeCircle {
                  0%, 100% {
                    transform: scale(0.3);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.1); /* Grow slightly larger */
                    opacity: 0.4;      /* Adjust max opacity */
                  }
                 /* It implicitly fades/shrinks back to 100% state */
                }

                .circle-container {
                   /* pointer-events: none; /* Uncomment if circles interfere with clicks */
                }

                .circle {
                  position: absolute;
                  display: block;
                  border-radius: 50%; /* Make it a circle */
                  width: var(--size);
                  height: var(--size);
                  will-change: transform, opacity;
                }
            `}</style>
        </div>
    );
};

export default CustomerPage;