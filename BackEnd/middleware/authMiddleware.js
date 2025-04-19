// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Optional: to check if user still exists

exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract token (remove 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Attach user ID to the request object
            // We fetch the user *without* the password
            // This ensures the user exists and attaches minimal needed info (id)
            // Alternatively, you could just attach decoded.id directly if you don't need to check existence on every request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 // Handle case where token is valid but user deleted
                 throw new Error('User not found');
            }

            next(); // Proceed to the next middleware/controller

        } catch (error) {
            console.error('Authentication Error:', error.message);
            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
               return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
            }
            if (error.name === 'TokenExpiredError') {
               return res.status(401).json({ success: false, message: 'Not authorized, token expired' });
            }
             // Handle user not found error from findById
            if (error.message === 'User not found') {
               return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists' });
            }
            // Generic error
            res.status(401).json({ success: false, message: 'Not authorized' });
        }
    }

    // 5. If no token found
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};