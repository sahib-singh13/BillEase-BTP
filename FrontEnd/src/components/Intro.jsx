import React from 'react';
import './bounce.css';

export const Intro = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Background Image */}
      <img
        src="/background.jpg"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        alt="Background"
      />
      <style>
     {`@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');`}
      </style>
      {/* Content */}
      <div className="flex flex-col justify-center items-center w-screen h-screen relative z-10">
        {/* Logo */}
        <div className="mt-8 animation-bounce">
          <img src="/LogoNew.png" alt="Logo" />
        </div>

        {/* Heading Text */}
        <div
          className="text-white font-bold text-5xl mb-12 animation-slide-in-left"
          style={{
            fontFamily: "'Open Sans', serif",
            fontWeight: 400,
          }}
        >
       Redefining Billing, One Invoice at a Time!
        </div>

        {/* Loader */}
        <div className="lds-default mb-8">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
