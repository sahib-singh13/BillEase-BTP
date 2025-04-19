// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this component exists

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For specific login/register actions
    const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false); // Tracks initial check

    // Initial Authentication Check Effect
    useEffect(() => {
        const checkAuth = async () => {
            // No loading set here, handled by parent splash/loader logic
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                setToken(storedToken);
                // Set Authorization header for subsequent requests in this session
                // Note: The api.js interceptor already does this, but setting it here
                // immediately can be useful if initial calls happen before interceptor runs.
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                try {
                    // You CAN add a /me call here to verify token and get user data on load
                    // const response = await api.get('/auth/me');
                    // setUser(response.data.user);
                    // setIsAuthenticated(true);

                    // Simplified: Trust token initially, backend verifies on protected routes
                    setIsAuthenticated(true);

                } catch (error) {
                    console.error("Initial auth check failed (token verification):", error);
                    localStorage.removeItem('authToken');
                    delete api.defaults.headers.common['Authorization']; // Clear header
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setIsAuthCheckComplete(true); // Initial check is done
        };
        checkAuth();
    }, []); // Run only once on mount

    // Email/Password Login
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                localStorage.setItem('authToken', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Set header
                setToken(newToken);
                setUser(userData);
                setIsAuthenticated(true);
                toast.success('Login Successful!');
                setIsLoading(false);
                return true;
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
            toast.error(message);
            // Ensure clean state on failure
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            setToken(null); setUser(null); setIsAuthenticated(false);
            setIsLoading(false);
            return false;
        }
    };

    // Email/Password Registration
     const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', { name, email, password });
             if (response.data.success) {
                 const { token: newToken, user: userData } = response.data;
                 localStorage.setItem('authToken', newToken);
                 api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Set header
                 setToken(newToken);
                 setUser(userData);
                 setIsAuthenticated(true);
                 toast.success('Registration Successful!');
                 setIsLoading(false);
                 return true;
             } else {
                 throw new Error(response.data.message || 'Registration failed');
             }
        } catch (error) {
             console.error("Registration error:", error);
             const message = error.response?.data?.message || error.message || 'Registration failed.';
             toast.error(message);
             // Ensure clean state on failure
             localStorage.removeItem('authToken');
             delete api.defaults.headers.common['Authorization'];
             setToken(null); setUser(null); setIsAuthenticated(false);
             setIsLoading(false);
             return false;
        }
     };

    // Google Authentication Handler (Calls Backend)
    const handleGoogleAuth = async (credentialResponse) => {
        setIsLoading(true); // Use isLoading for Google backend call as well
        try {
            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential,
            });

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                localStorage.setItem('authToken', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Set header
                setToken(newToken);
                setUser(userData);
                setIsAuthenticated(true);
                toast.success(response.data.message || 'Google Login Successful!');
                setIsLoading(false);
                return true;
            } else {
                throw new Error(response.data.message || 'Google authentication failed on server.');
            }
        } catch (error) {
            console.error("Google Auth backend error:", error);
            const message = error.response?.data?.message || error.message || 'Google authentication failed.';
            toast.error(message);
            // Ensure clean state on failure
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            setToken(null); setUser(null); setIsAuthenticated(false);
            setIsLoading(false);
            return false;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization']; // Clear header
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out.');
    };

    // Show loader only during initial check
    if (!isAuthCheckComplete) {
       return <LoadingSpinner fullPage={true} />;
    }

    // Provide context value
    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout, handleGoogleAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};