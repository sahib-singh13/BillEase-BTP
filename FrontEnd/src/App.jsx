// src/App.jsx (Updated for One-Time Splash)
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth and API
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components and Pages
import { Intro } from './components/Intro'; // Keep Intro import
import { UserType } from './Pages/UserType';
import Footer from './components/Footer';
import CustomerPage from './Pages/CustomerPage';
import Contact from './Pages/Contact';
import RetailerPage from './Pages/RetailerPage';
import Header from './components/Header';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/DashBoard';
import CustomerDashboardHeader from './components/CustomerDashboardHeader';
import About from './Pages/About';
import RegisterRetailer from './Pages/RegisterRetailer';
import RetailerDashBoard from './Pages/RetailerDashboard';
import RetailerDashboardHeader from './components/RetailerDashboardHeader';
import CustomerPersonalInformation from './Pages/CustomerPersonalInformation';
import HelpandSupport from './Pages/HelpandSupport';

// Key for session storage
const SPLASH_SHOWN_KEY = 'splashShown';

// Main App Component Structure
const AppContent = () => {
    // State to control splash visibility, initialized based on session storage
    const [showSplash, setShowSplash] = useState(() => {
        return sessionStorage.getItem(SPLASH_SHOWN_KEY) !== 'true';
    });

    const location = useLocation();

    // Effect to hide splash after delay AND set session storage flag
    useEffect(() => {
        // Only run this logic if the splash is currently supposed to be shown
        if (showSplash) {
            const timer = setTimeout(() => {
                setShowSplash(false); // Hide the splash component visually
                sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true'); // Mark as shown for this session
            }, 3000); // Your splash duration

            // Clear the timer if the component unmounts before the timeout finishes
            return () => clearTimeout(timer);
        }
        // No cleanup needed if splash isn't shown initially
    }, [showSplash]); // Rerun effect if showSplash changes (primarily for the initial true -> false transition)


    // --- Header Logic (No change needed) ---
    const isCustomerDashboard = location.pathname.startsWith('/customerDashboard');
    const isRetailerDashboard = location.pathname.startsWith('/retailerDashboard');
    const isCustomerInfo = location.pathname.startsWith('/customerPersonalInformation');
    const isHelpSupport = location.pathname.startsWith('/helpandsupport');

    let CurrentHeader = Header;
    if (isCustomerDashboard || isCustomerInfo || isHelpSupport) {
        CurrentHeader = CustomerDashboardHeader;
    } else if (isRetailerDashboard) {
        CurrentHeader = RetailerDashboardHeader;
    }

    // Adjust hideLayout logic - still hide on splash, and optionally on '/'
    const hideLayout = showSplash || location.pathname === '/';

    // --- Conditional Rendering ---
    if (showSplash) {
        return <Intro />; // Show splash screen if state is true
    }

    // Render main app content AFTER splash is done
    return (
        <div className="app flex flex-col min-h-screen">
             {/* AuthProvider now wraps the main content */}
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false} /> {/* Keep Toaster inside AuthProvider */}
                {!hideLayout && <CurrentHeader />}
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<UserType />} />
                        <Route path="/customerLogin" element={<CustomerPage />} />
                        <Route path="/CustomerRegister" element={<RegisterPage />} />
                        <Route path="/retailerLogin" element={<RetailerPage />} />
                        <Route path="/RegisterRetailer" element={<RegisterRetailer />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />

                        {/* Protected Customer Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/customerDashboard" element={<Dashboard />} />
                            <Route path="/customerPersonalInformation" element={<CustomerPersonalInformation />} />
                            <Route path="/helpandsupport" element={<HelpandSupport />} />
                        </Route>

                        {/* Protected Retailer Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/retailerDashboard" element={<RetailerDashBoard />} />
                        </Route>
                    </Routes>
                </main>
                {!hideLayout && <Footer />}
            </AuthProvider>
        </div>
    );
};

// App component is now just a simple wrapper (doesn't need state)
const App = () => {
    return <AppContent />;
};

export default App;