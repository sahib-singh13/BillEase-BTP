// controller/authController.js

// --- Single set of imports at the top ---
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // <-- Corrected dotenv syntax
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Helper to Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token expires in 30 days
    });
};

// --- Register User ---
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
        }
        if (password.length < 6) {
             return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // 3. Create user (password hashing happens via mongoose middleware)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
        });

        // 4. Generate token and send response
        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token: token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// --- Login User ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (user && (await user.comparePassword(password))) {
             const token = generateToken(user._id);
             res.status(200).json({
                 success: true,
                 message: 'Login successful',
                 token: token,
                 user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                 }
             });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
         console.error("Login Error:", error);
         res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// --- Get Me ---
exports.getMe = async (req, res) => {
   try {
       const user = await User.findById(req.user.id);
       if (!user) {
           return res.status(404).json({ success: false, message: 'User not found' });
       }
       res.status(200).json({ success: true, user });
   } catch (error) {
       console.error("GetMe Error:", error);
       res.status(500).json({ success: false, message: 'Server error fetching profile' });
   }
};

// --- Google Auth Handler ---
exports.googleAuth = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ success: false, message: 'Missing Google credential token.' });
    }

    try {
        // 1. Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // 2. Extract user info
        const { sub: googleId, email, name, picture } = payload;
        if (!email) {
             return res.status(400).json({ success: false, message: 'Email not provided by Google.' });
        }

        // 3. Find or Create User
        let user = await User.findOne({ googleId: googleId });

        if (!user) {
            user = await User.findOne({ email: email });
            if (user) {
                // Link existing email user to Google ID
                user.googleId = googleId;
                await user.save();
                console.log(`Linked Google ID ${googleId} to existing user ${email}`);
            } else {
                // Create new user via Google
                console.log(`Creating new user via Google: ${email}`);
                // IMPORTANT: Ensure your User model handles potentially missing passwords for Google users
                // (e.g., make 'password' not required if 'googleId' exists, or generate random)
                user = await User.create({
                    googleId: googleId,
                    email: email,
                    name: name || 'Google User',
                    // password: password is handled by pre-save hook or model logic
                });
                 if (!user) {
                    throw new Error("Failed to create user account via Google.");
                }
            }
        }

        // 4. Generate OUR application's JWT token
        const appToken = generateToken(user._id);

        // 5. Send Success Response
        res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            token: appToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        if (error.message.includes("Invalid token signature") || error.message.includes("Token used too late")) {
             return res.status(401).json({ success: false, message: 'Invalid or expired Google token.' });
        }
        // Handle potential user creation errors
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        res.status(500).json({ success: false, message: 'Server error during Google authentication.' });
    }
};