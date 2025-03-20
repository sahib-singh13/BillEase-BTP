/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const UserType = () => {
  const navigate = useNavigate();
  const buttonClass =
    `w-96 h-16 border rounded flex items-center px-4 space-x-16 bg-orange-200 text-xl font-semibold border-orange-400 transition-colors duration-200 hover:bg-orange-600 hover:text-white cursor-pointer`;
 
  const handleclickCustomer = () => {
    navigate('/customerLogin');
  };

  const handleclickRetailer = () => {
    navigate('/retailerLogin');
  };

  return (
    <div>
      <div className="w-screen h-screen overflow-x-hidden flex flex-col items-center justify-around">
        {/* Logo and Text Section */}
        <div className="flex flex-row items-center mb-10">
          {/* Logo */}
          <div>
            <img src="/logo-orange.png" alt="BillEase Logo" className="w-80 h-64" />
          </div>
          {/* Text */}
          <div className="italic text-5xl text-orange-400 font-bold">
            Welcome to BillEase!
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col items-start justify-start mb-40 space-y-16 ml-16">
          {/* Button for Customer */}
          <div className={buttonClass} onClick={handleclickCustomer}>
            <img src="/best-employee.png" className="w-12 h-12" alt="Customer" />
            <p className="text-center">Login As Customer</p>
          </div>

          {/* Button for Retailer */}
          <div className={buttonClass} onClick={handleclickRetailer}>
            <img src="/retailer.png" className="w-12 h-12" alt="Retailer" />
            <p className="text-center">Login As Retailer</p>
          </div>
        </div>
      </div>
    </div>
  );
};
