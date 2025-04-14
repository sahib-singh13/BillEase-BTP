// src/pages/About.js
import React, { useState, useEffect } from 'react';
// Optional: Import icons if you want to use them for the lists
import { FaCheckCircle, FaUsers, FaStore, FaSeedling, FaLock, FaMobileAlt, FaChartLine, FaRocket, FaGlobeEurope, FaHandshake } from 'react-icons/fa';

const About = () => {
    // State for fade-in animation
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in shortly after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    // Reusable icon class for lists
    const listItemIconClass = "w-5 h-5 text-orange-500 mr-3 flex-shrink-0";

    return (
        // --- Main Container with Shape Animation ---
        <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 relative">
            {/* Shape Animation Container */}
            <div className="shape-container absolute inset-0 z-0 overflow-hidden">
                {[...Array(12)].map((_, i) => ( // Added a few more shapes
                    <div key={i} className="shape bg-orange-300/40 rounded-lg" style={{ '--size': `${Math.random() * 80 + 20}px`, '--delay': `${Math.random() * -20}s`, '--duration': `${Math.random() * 15 + 15}s`, '--x-start': `${Math.random() * 100}%`, '--y-start': `${Math.random() * 100}%`, left: `var(--x-start)`, top: `var(--y-start)`, animation: `moveShape var(--duration) linear var(--delay) infinite` }}></div>
                ))}
            </div>

            {/* --- Content Wrapper --- */}
            <div className={`relative z-10 bg-white/85 backdrop-blur-lg p-8 md:p-12 lg:p-16 rounded-2xl mx-4 my-8 max-w-6xl w-full shadow-xl overflow-y-auto max-h-[90vh] custom-scrollbar transition-opacity duration-700 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Custom Scrollbar for this container */}
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: #fff7ed; border-radius: 10px; } /* Lighter orange track */
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #fb923c; border-radius: 10px; border: 2px solid #fff7ed; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
                  .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #fb923c #fff7ed; }
                `}</style>

                {/* Page Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-800 tracking-tight">
                    About <span className="text-orange-600">BillEase</span>
                </h1>

                {/* Main Content Area */}
                <div className="space-y-10"> {/* Increased spacing */}
                    {/* Introductory Paragraphs */}
                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Welcome to BillEase – a cutting-edge platform designed to revolutionize how you manage purchase records. We simplify the storage and display of digital bills from local retailers, transitioning from traditional paper receipts to an eco-friendly digital solution. This reduces waste and enhances convenience for everyone.
                        </p>
                        <p>
                            Securely store and access your digital bills anytime, eliminating lost or damaged receipts. Our user-friendly interface ensures seamless navigation, providing real-time access to purchase history, organized bill storage, and easy transaction retrieval. Retailers benefit from streamlined digital receipt issuance, fostering stronger customer bonds and embracing sustainable practices.
                        </p>
                        <p>
                            Data security and privacy are paramount at BillEase. We implement robust measures to protect your information. By bridging the gap between retailers and customers with an innovative, paperless system, BillEase leads the way in modern retail technology, empowering you to stay organized, eco-conscious, and ready for a digital future.
                        </p>
                    </div>

                    {/* Benefits & Features Grid */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-10 pt-4"> {/* Added top padding */}
                        {/* User Benefits Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 p-6 rounded-xl border border-orange-200 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                            <h3 className="text-2xl font-semibold text-orange-700 mb-5 flex items-center">
                                <FaUsers className="mr-3" /> User Benefits
                            </h3>
                            <ul className="space-y-4 text-gray-700 text-base"> {/* Adjusted text size/color */}
                                <li className="flex items-center"><FaSeedling className={listItemIconClass} /> Eco-friendly digital receipts</li>
                                <li className="flex items-center"><FaLock className={listItemIconClass} /> Secure cloud storage & backup</li>
                                <li className="flex items-center"><FaMobileAlt className={listItemIconClass} /> 24/7 Access from any device</li>
                                <li className="flex items-center"><FaChartLine className={listItemIconClass} /> Easy purchase history tracking</li>
                            </ul>
                        </div>

                        {/* Retailer Features Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 p-6 rounded-xl border border-orange-200 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                            <h3 className="text-2xl font-semibold text-orange-700 mb-5 flex items-center">
                                <FaStore className="mr-3" /> Retailer Features
                            </h3>
                            <ul className="space-y-4 text-gray-700 text-base">
                                <li className="flex items-center"><FaRocket className={listItemIconClass} /> Instant, paperless billing</li>
                                <li className="flex items-center"><FaChartLine className={listItemIconClass} /> Valuable customer insights</li>
                                <li className="flex items-center"><FaGlobeEurope className={listItemIconClass} /> Sustainable business practice</li>
                                <li className="flex items-center"><FaHandshake className={listItemIconClass} /> Enhanced customer engagement</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Global Styles for Shape Animation (Same as before) --- */}
            <style jsx global>{`
                @keyframes moveShape {
                  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
                  25% { opacity: 0.8; } 50% { opacity: 0.5; } 75% { opacity: 0.9; }
                  100% { transform: translate( calc((${Math.random()} - 0.5) * 2 * 150vw), calc((${Math.random()} - 0.5) * 2 * 150vh) ) rotate(calc((${Math.random()} - 0.5) * 720deg)); opacity: 0.6; }
                }
                .shape-container { /* pointer-events: none; Optional */ }
                .shape { position: absolute; display: block; width: var(--size); height: var(--size); will-change: transform, opacity; }
            `}</style>
        </div>
    );
};

export default About;