// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        // --- MODIFICATION START ---
        // Make password required ONLY if googleId is not set
        required: function() {
             // 'this' refers to the document being saved/validated
             return !this.googleId;
        },
        // --- MODIFICATION END ---
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Keep password hidden by default
    },
    googleId: {
         type: String,
         unique: true,
         sparse: true // Important: Allows multiple documents without googleId (null)
    }
}, { timestamps: true });

// --- Password Hashing Middleware ---
// Hash password only if it's modified (or new and present)
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified (or is new and provided)
    // Also, skip hashing if there's no password (e.g., Google signup)
    if (!this.isModified('password') || !this.password) {
         return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Password Comparison Method (Keep as is) ---
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Handle cases where a Google user might somehow try a password login
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;