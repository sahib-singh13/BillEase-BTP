/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserType = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- Updated Button Styling ---
  const buttonBaseClass =
    `group w-full max-w-md py-4 px-6 border-2 border-orange-300 bg-white rounded-xl
     shadow-lg flex items-center space-x-6
     text-orange-800 font-semibold text-lg
     cursor-pointer overflow-hidden
     transition-all duration-300 ease-in-out
     hover:border-orange-500 hover:shadow-xl hover:scale-[1.02] hover:bg-orange-50/50 {/* Subtle bg hover */}
     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50`;
    // Removed hover:scale-[1.03] for less jumpiness
    // Removed pseudo-element hover effect

  const handleclickCustomer = () => { navigate('/customerLogin'); };
  const handleclickRetailer = () => { navigate('/retailerLogin'); };

  return (
    // --- Updated Main Container for Shape Animation ---
    <div className="min-h-screen w-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100 relative"> {/* Base gradient + relative positioning */}

       {/* Shape Animation Container */}
      <div className="shape-container absolute inset-0 z-0 overflow-hidden">
          {/* Generate multiple shapes with different delays/positions */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="shape bg-orange-300/50 rounded-lg" // Semi-transparent orange shapes
              style={{
                '--size': `${Math.random() * 80 + 20}px`, // Random size (20px to 100px)
                '--delay': `${Math.random() * -20}s`,     // Random negative delay to start at different times
                '--duration': `${Math.random() * 15 + 15}s`, // Random duration (15s to 30s)
                '--x-start': `${Math.random() * 100}%`,     // Random horizontal start
                '--y-start': `${Math.random() * 100}%`,     // Random vertical start
                left: `var(--x-start)`,
                top: `var(--y-start)`,
                animation: `moveShape var(--duration) linear var(--delay) infinite`,
              }}
            ></div>
          ))}
      </div>


      {/* Content wrapper - Add z-10 to stay above shapes */}
      <div
        className={`relative z-10 bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl flex flex-col items-center transition-opacity duration-700 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ maxWidth: '700px' }}
      >
        {/* Logo and Text Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <img src="/logo-orange.png" alt="BillEase Logo" className="w-48 h-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-1">
            Welcome to <span className="text-orange-600">BillEase!</span>
          </h1>
          <p className="text-lg text-gray-500">Please select your login type.</p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col items-center space-y-8 w-full">

          {/* Button for Customer */}
          <button
            className={`${buttonBaseClass}`} // Removed hoverEffectClass
            onClick={handleclickCustomer}
          >
             {/* Icon Wrapper - No z-index needed now */}
            <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:border-orange-300 transition-colors duration-300"> {/* Adjusted hover */}
                <img src="/best-employee.png" className="w-10 h-10" alt="" />
            </div>
            {/* Text - No z-index needed, text color doesn't change */}
            <p>Login As Customer</p>
          </button>

          {/* Button for Retailer */}
          <button
            className={`${buttonBaseClass}`} // Removed hoverEffectClass
            onClick={handleclickRetailer}
          >
             {/* Icon Wrapper */}
             <div className="p-2 bg-orange-100 rounded-full border border-orange-200 group-hover:border-orange-300 transition-colors duration-300"> {/* Adjusted hover */}
                <img src="/retailer.png" className="w-10 h-10" alt="" />
            </div>
            {/* Text */}
            <p>Login As Retailer</p>
          </button>
        </div>
      </div>

      {/* Global Styles for Shape Animation */}
      <style jsx global>{`
        @keyframes moveShape {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.6;
          }
          25% {
             opacity: 0.8;
          }
          50% {
             opacity: 0.5;
          }
          75% {
             opacity: 0.9;
          }
          100% {
            /* Move significantly off-screen to reset cleanly */
            transform: translate(
                calc((${Math.random()} - 0.5) * 2 * 150vw), /* Random horizontal end (-150vw to +150vw) */
                calc((${Math.random()} - 0.5) * 2 * 150vh) /* Random vertical end (-150vh to +150vh) */
            ) rotate(calc((${Math.random()} - 0.5) * 720deg)); /* Random rotation */
            opacity: 0.6;
          }
        }

        .shape-container {
          /* pointer-events: none; Optional: if shapes interfere with clicks */
        }

        .shape {
          position: absolute;
          display: block;
          width: var(--size);
          height: var(--size);
          will-change: transform, opacity; /* Performance hint */
        }
      `}</style>
    </div>
  );
};