// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom'; // Added Link
import { Toaster } from 'react-hot-toast';

// Auth and API
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Components ---
import { Intro } from './components/Intro';
import Footer from './components/Footer';
import Header from './components/Header'; // Generic Header
import CustomerDashboardHeader from './components/CustomerDashboardHeader';
import RetailerDashboardHeader from './components/RetailerDashboardHeader'; // Assuming this exists
import LoadingSpinner from './components/LoadingSpinner'; // Import loader

// --- Pages ---
import { UserType } from './Pages/UserType';
import CustomerPage from './Pages/CustomerPage';
import Contact from './Pages/Contact';
import RetailerPage from './Pages/RetailerPage'; // Assuming this exists
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/DashBoard';
import About from './Pages/About';
import RegisterRetailer from './Pages/RegisterRetailer'; // Assuming this exists
import RetailerDashBoard from './Pages/RetailerDashboard'; // Assuming this exists
import CustomerPersonalInformation from './Pages/CustomerPersonalInformation';
import HelpandSupport from './Pages/HelpandSupport';
// --- Settings Placeholder Pages ---
import SettingsSecurity from './Pages/SettingsSecurity';
import SettingsDevices from './Pages/SettingsDevices';
import SettingsBilling from './Pages/SettingsBilling';
import SettingsPaymentHistory from './Pages/SettingsPaymentHistory';
import SettingsNotifications from './Pages/SettingsNotifications';
import SettingsGeneral from './Pages/SettingsGeneral';
// --- NEW Warranty Pages ---
import WarrantyClaimPage from './Pages/WarrantyClaimPage';
import WarrantySubmitPage from './Pages/WarrantySubmitPage';
// --- Add a NotFoundPage if you have one ---
// import NotFoundPage from './Pages/NotFoundPage';

// Key for session storage to show splash only once
const SPLASH_SHOWN_KEY = 'splashShown';

// Main App Component Structure (Renders content based on splash/route)
const AppContent = () => {
    // Splash Screen State
    const [showSplash, setShowSplash] = useState(() => {
        // Check session storage only once on initial load
        return sessionStorage.getItem(SPLASH_SHOWN_KEY) !== 'true';
    });

    const location = useLocation(); // Hook to get current route location

    // Effect to hide splash screen after delay and set session flag
    useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
            }, 3000); // Splash duration
            return () => clearTimeout(timer); // Cleanup timer if component unmounts
        }
    }, [showSplash]); // Only depends on showSplash state

    // --- Determine Header ---
    const isCustomerRoute = location.pathname.startsWith('/customerDashboard') ||
                             location.pathname.startsWith('/customerPersonalInformation') ||
                             location.pathname.startsWith('/helpandsupport') ||
                             location.pathname.startsWith('/settings') || // Generic settings
                             location.pathname.startsWith('/warranty-'); // Include warranty pages

    const isRetailerRoute = location.pathname.startsWith('/retailerDashboard');
    // Add more conditions for retailer settings if needed

    let CurrentHeader = Header; // Default generic header
    if (isCustomerRoute) {
        CurrentHeader = CustomerDashboardHeader;
    } else if (isRetailerRoute) {
        CurrentHeader = RetailerDashboardHeader;
    }

    // --- Determine Layout Visibility ---
    const hideLayout = showSplash || location.pathname === '/'; // Hide on splash and UserType page

    // --- Conditional Rendering ---
    if (showSplash) {
        return <Intro />; // Render only splash screen component
    }

    // Render main application layout and routes after splash
    return (
        <div className="app flex flex-col min-h-screen bg-gray-50"> {/* Base background */}
            {/* AuthProvider wraps the main application content, including Toaster */}
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 9999 }} />

                {!hideLayout && <CurrentHeader />}
                <main className="flex-grow"> {/* Allow main content to take up remaining space */}
                    <Routes>
                        {/* --- Public Routes --- */}
                        <Route path="/" element={<UserType />} />
                        <Route path="/customerLogin" element={<CustomerPage />} />
                        <Route path="/CustomerRegister" element={<RegisterPage />} />
                        <Route path="/retailerLogin" element={<RetailerPage />} />
                        <Route path="/RegisterRetailer" element={<RegisterRetailer />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />

                        {/* --- Protected Customer Routes --- */}
                        <Route element={<ProtectedRoute />}> {/* Wrapper for protected routes */}
                            <Route path="/customerDashboard" element={<Dashboard />} />
                            <Route path="/customerPersonalInformation" element={<CustomerPersonalInformation />} />
                            <Route path="/helpandsupport" element={<HelpandSupport />} />
                            {/* Settings Placeholder Routes */}
                            <Route path="/settings-security" element={<SettingsSecurity />} />
                            <Route path="/settings-devices" element={<SettingsDevices />} />
                            <Route path="/settings-billing" element={<SettingsBilling />} />
                            <Route path="/settings-payment-history" element={<SettingsPaymentHistory />} />
                            <Route path="/settings-notifications" element={<SettingsNotifications />} />
                            <Route path="/settings-general" element={<SettingsGeneral />} />
                            <Route path="/settings" element={<SettingsGeneral />} />{/* Generic settings path */}
                            {/* --- Warranty Routes --- */}
                            <Route path="/warranty-claim" element={<WarrantyClaimPage />} />
                            <Route path="/warranty-submit" element={<WarrantySubmitPage />} />
                            {/* --- End Warranty Routes --- */}
                        </Route>

                        {/* --- Protected Retailer Routes (Example) --- */}
                        <Route element={<ProtectedRoute />}> {/* Use same or different protector */}
                             <Route path="/retailerDashboard" element={<RetailerDashBoard />} />
                             {/* Add retailer-specific protected routes here */}
                        </Route>

                        {/* --- Catch-all 404 Not Found Route --- */}
                         <Route path="*" element={
                             <div className="text-center py-20 px-4">
                                 <h1 className="text-6xl font-bold text-orange-400">404</h1>
                                 <p className="text-2xl font-medium text-gray-700 mt-4">Page Not Found</p>
                                 <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
                                 <Link to="/" className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-150">
                                     Go Back Home
                                 </Link>
                             </div>
                         } />
                    </Routes>
                </main>
                {!hideLayout && <Footer />}
            </AuthProvider>
        </div>
    );
};

// App component remains a simple wrapper for AppContent
// Ensure BrowserRouter is wrapping this App component in index.js
const App = () => {
    return <AppContent />;
};

export default App;