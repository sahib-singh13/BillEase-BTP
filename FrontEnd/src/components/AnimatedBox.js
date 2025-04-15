// src/components/AnimatedBox.js
import React from 'react';
import Draggable from 'react-draggable';

// Define some keyframes for floating animation in your global CSS (e.g., src/index.css)
/*
@keyframes float {
  0% { box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6); transform: translatey(0px); }
  50% { box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2); transform: translatey(-20px); }
  100% { box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6); transform: translatey(0px); }
}

@keyframes float-reverse {
  0% { box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6); transform: translatey(0px); }
  50% { box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2); transform: translatey(20px); }
  100% { box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6); transform: translatey(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-reverse {
  animation: float-reverse 7s ease-in-out infinite;
}
*/


// Define variations for styling the boxes
const boxStyles = [
  "bg-gradient-to-br from-orange-300 to-amber-400",
  "bg-gradient-to-tl from-teal-300 to-blue-400",
  "bg-gradient-to-r from-purple-300 to-indigo-400",
  "bg-gradient-to-bl from-green-300 to-cyan-400",
  "bg-gradient-to-tr from-pink-300 to-rose-400",
];

const AnimatedBox = ({ initialPosition, styleVariant, animationClass }) => {
  const boxClass = boxStyles[styleVariant % boxStyles.length]; // Cycle through styles

  return (
    // Draggable wraps the element you want to move
    // `defaultPosition` sets the initial spot (relative to parent)
    // `bounds="parent"` restricts dragging within the parent container
    <Draggable bounds="parent" defaultPosition={initialPosition}>
      <div
        className={`
          absolute cursor-grab active:cursor-grabbing
          w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36
          ${boxClass}
          rounded-2xl md:rounded-3xl
          shadow-lg hover:shadow-2xl
          opacity-30 md:opacity-40 hover:opacity-60
          transition-all duration-300 ease-in-out
          transform hover:scale-110
          ${animationClass || 'animate-float'} // Apply animation class
          z-0 // Ensure it's behind the main content
        `}
      >
        {/* Optional: Add content inside the box if needed */}
        {/* <div className="absolute inset-0 bg-black opacity-10 rounded-3xl"></div> */}
      </div>
    </Draggable>
  );
};

export default AnimatedBox;