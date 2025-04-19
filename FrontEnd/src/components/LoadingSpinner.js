// src/components/LoadingSpinner.jsx
import React from 'react';

// Assuming you added the CSS to index.css or imported a separate CSS file
// No import needed here if using global CSS

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loader-container"> {/* Use the container for centering */}
        <div className="loader"></div>
      </div>
    );
  }

  // Inline loader (adjust container styling as needed where used)
  return (
    <div className="flex justify-center items-center p-4"> {/* Simple inline container */}
        <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;