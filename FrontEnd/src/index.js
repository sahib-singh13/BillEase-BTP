// src/index.js (Example)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Provider

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("ERROR: REACT_APP_GOOGLE_CLIENT_ID is not defined in your .env file!");
  // Optionally render an error message to the user
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}> {/* Wrap here */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);