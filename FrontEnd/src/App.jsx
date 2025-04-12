import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Intro } from './components/Intro';
import { UserType } from './Pages/UserType';
import Footer from './components/Footer';
import CustomerPage from './Pages/CustomerPage';
import Contact from './Pages/Contact';
import RetailerPage from './Pages/RetailerPage';
import Header from './components/Header';
import RegisterPage from './Pages/RegisterPage';
import DashBoard from './Pages/DashBoard';
import CustomerDashboardHeader from './components/CustomerDashboardHeader';
import About from './Pages/About';
import RegisterRetailer from './Pages/RegisterRetailer';
import RetailerDashBoard from './Pages/RetailerDashboard';
import RetailerDashboardHeader from './components/RetailerDashboardHeader';
import CustomerPersonalInformation from './Pages/CustomerPersonalInformation';
import HelpandSupport from './Pages/HelpandSupport';

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const location = useLocation();

    // Splash screen logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Dashboard loading state
    const [isDashboardLoading, setIsDashboardLoading] = useState(false);
    useEffect(() => {
        if (location.pathname === '/customerDashboard' || location.pathname === '/retailerDashboard') {
            setIsDashboardLoading(true);
            setTimeout(() => setIsDashboardLoading(false), 0);
        }
    }, [location.pathname]);

    if (showSplash) {
        return <Intro />;
    }

    const isCustomerDashboard = location.pathname === '/customerDashboard';
    const isRetailerDashboard = location.pathname === '/retailerDashboard';
    const isCustomerPersonalInfo = location.pathname === '/customerPersonalInformation';
    const helpandsupport = location.pathname === '/helpandsupport';

    return (
        <div className="app">
            {isCustomerDashboard && !isDashboardLoading ? (
                <CustomerDashboardHeader />
            ) : isRetailerDashboard && !isDashboardLoading ? (
                <RetailerDashboardHeader />
            ) : isCustomerPersonalInfo ? (
                <CustomerDashboardHeader />
            ) :  helpandsupport ? (
                <CustomerDashboardHeader />
            ) :(
                <Header />
            )}

            <Routes>
                <Route path="/" element={<UserType />} />
                <Route path="/customerLogin" element={<CustomerPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/retailerLogin" element={<RetailerPage />} />
                <Route path="/CustomerRegister" element={<RegisterPage />} />
                <Route path="/customerDashboard" element={<DashBoard />} />
                <Route path="/about" element={<About />} />
                <Route path="/RegisterRetailer" element={<RegisterRetailer />} />
                <Route path="/retailerDashboard" element={<RetailerDashBoard />} />
                <Route path="/customerPersonalInformation" element={<CustomerPersonalInformation />} />
                <Route path="/helpandsupport" element={<HelpandSupport />} />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;