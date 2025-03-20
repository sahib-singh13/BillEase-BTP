import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const CustomerPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/customerDashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-extrabold text-center text-orange-600">Welcome Back!</h2>
                <p className="text-gray-600 text-center mt-2 text-lg">Login to access your account</p>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-orange-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-orange-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <p className="px-4 text-sm text-gray-500">or</p>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <NavLink
                            to="/CustomerRegister"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-orange-600 font-medium underline'
                                    : 'text-orange-600 font-medium hover:text-orange-500 transition'
                            }
                        >
                            Register here
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;