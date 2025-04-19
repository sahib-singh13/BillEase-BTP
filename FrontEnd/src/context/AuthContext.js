// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Configured Axios instance
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner'; // Ensure this component exists

// Create the context
const AuthContext = createContext();

// Context Provider Component
export const AuthProvider = ({ children }) => {
    // --- State ---
    const [user, setUser] = useState(null); // Holds logged-in user data ({ _id, name, email, ... })
    const [token, setToken] = useState(localStorage.getItem('authToken')); // Holds JWT token
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status
    const [isLoading, setIsLoading] = useState(false); // Loading state for specific async actions (login, register, profile update)
    const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false); // Tracks if the initial authentication check has finished

    // --- Effect for Initial Authentication Check ---
    // Runs once on component mount to check for existing token and fetch user data
    useEffect(() => {
        const checkAuth = async () => {
            console.log("Auth Check: Starting...");
            const storedToken = localStorage.getItem('authToken');

            if (storedToken) {
                console.log("Auth Check: Token found in storage.");
                setToken(storedToken);
                // Set Authorization header for subsequent API calls in this session
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                try {
                    // Verify token by fetching user data from the '/auth/me' endpoint
                    console.log("Auth Check: Verifying token with /auth/me...");
                    const response = await api.get('/auth/me');

                    if (response.data.success) {
                        console.log("Auth Check: Token valid, user data received:", response.data.user);
                        setUser(response.data.user); // Store fetched user data
                        setIsAuthenticated(true); // Set authenticated status
                    } else {
                         // This case might occur if /me returns success:false but status 200
                        console.warn("Auth Check: /me request succeeded but returned success:false.");
                        throw new Error(response.data.message || "Failed to verify token.");
                    }
                } catch (error) {
                    // Handle errors during token verification (e.g., 401 Unauthorized, network error)
                    console.error("Auth Check: Token verification failed:", error.response?.data?.message || error.message);
                    // Clear invalid token and user state
                    localStorage.removeItem('authToken');
                    delete api.defaults.headers.common['Authorization'];
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                console.log("Auth Check: No token found in storage.");
                // Ensure auth header is not set if no token
                delete api.defaults.headers.common['Authorization'];
            }
            // Mark the initial authentication check as complete
            console.log("Auth Check: Finished.");
            setIsAuthCheckComplete(true);
        };

        checkAuth();
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Authentication Functions ---

    // Email/Password Login
    const login = async (email, password) => {
        setIsLoading(true); // Set loading state for the login action
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                // Store token, set axios header, update state
                localStorage.setItem('authToken', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                setToken(newToken);
                setUser(userData); // Store user details received from backend
                setIsAuthenticated(true);
                toast.success('Login Successful!');
                setIsLoading(false);
                return true; // Indicate success
            } else {
                // Handle cases where backend returns 2xx status but success: false
                throw new Error(response.data.message || 'Login failed: Unknown reason.');
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
            toast.error(message);
            // Clean up state on failure
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            setToken(null); setUser(null); setIsAuthenticated(false);
            setIsLoading(false);
            return false; // Indicate failure
        }
    };

    // Email/Password Registration
     const register = async (name, email, password) => {
        setIsLoading(true); // Set loading state for the registration action
        try {
            const response = await api.post('/auth/register', { name, email, password });
             if (response.data.success) {
                 const { token: newToken, user: userData } = response.data;
                 // Store token, set axios header, update state (user is now logged in)
                 localStorage.setItem('authToken', newToken);
                 api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                 setToken(newToken);
                 setUser(userData); // Store user details received from backend
                 setIsAuthenticated(true);
                 toast.success('Registration Successful! Logged in.');
                 setIsLoading(false);
                 return true; // Indicate success
             } else {
                 // Handle cases where backend returns 2xx status but success: false
                 throw new Error(response.data.message || 'Registration failed: Unknown reason.');
             }
        } catch (error) {
             console.error("Registration error:", error);
             const message = error.response?.data?.message || error.message || 'Registration failed.';
             toast.error(message);
             // Clean up state on failure
             localStorage.removeItem('authToken');
             delete api.defaults.headers.common['Authorization'];
             setToken(null); setUser(null); setIsAuthenticated(false);
             setIsLoading(false);
             return false; // Indicate failure
        }
     };

    // Google Authentication Handler (communicates with backend)
    const handleGoogleAuth = async (credentialResponse) => {
        // Use general isLoading state as this involves an async action
        setIsLoading(true);
        try {
            // Send the Google credential (ID token) to our backend for verification
            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential,
            });

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                // Store token, set axios header, update state
                localStorage.setItem('authToken', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                setToken(newToken);
                setUser(userData); // Store user details received from backend
                setIsAuthenticated(true);
                toast.success(response.data.message || 'Google Sign-In Successful!');
                setIsLoading(false);
                return true; // Indicate success
            } else {
                 // Handle cases where backend returns 2xx status but success: false
                throw new Error(response.data.message || 'Google authentication failed on server.');
            }
        } catch (error) {
            console.error("Google Auth backend error:", error);
            const message = error.response?.data?.message || error.message || 'Google authentication failed.';
            toast.error(message);
            // Clean up state on failure
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            setToken(null); setUser(null); setIsAuthenticated(false);
            setIsLoading(false);
            return false; // Indicate failure
        }
    };

    // Logout Function
    const logout = () => {
        // Clear token, user data, and auth header
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out.');
        // Navigation is typically handled by the component calling logout
    };

    // --- Function to Update User Data in Context ---
    // This is called by components (like Profile page) after a successful update API call
    const updateUserContext = (updatedUserData) => {
        setUser(prevUser => {
             // Ensure we don't accidentally overwrite crucial fields like _id if not present in updatedUserData
            const newUser = {
                ...(prevUser || {}), // Keep existing data, handle case where prevUser might be null initially
                ...updatedUserData // Overwrite with fields from updatedUserData
            };
             console.log("AuthContext user state updated:", newUser);
            return newUser;
        });
    };

    // --- Render Logic ---

    // Show full-page loading spinner ONLY during the initial auth check
    if (!isAuthCheckComplete) {
       return <LoadingSpinner fullPage={true} />;
    }

    // Provide the context value to children once initial check is done
    // isLoading in the value now refers to login/register/update actions
    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            isLoading, // State indicating if login/register/update is in progress
            login,
            register,
            logout,
            handleGoogleAuth,
            updateUserContext // Provide the update function
         }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the context
export const useAuth = () => {
    return useContext(AuthContext);
};