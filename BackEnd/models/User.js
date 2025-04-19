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
        required: function() { return !this.googleId; }, // Required only if not Google signup
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    googleId: {
         type: String,
         unique: true,
         sparse: true
    },
    // --- NEW PROFILE FIELDS ---
    phoneNumber: {
        type: String,
        trim: true,
        default: ''
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    profilePictureUrl: { // URL from Cloudinary
        type: String,
        trim: true,
        default: ''
    },
    profilePictureCloudinaryId: { // Public ID for deletion
        type: String,
        trim: true,
        default: ''
    }
    // --- END NEW PROFILE FIELDS ---
}, { timestamps: true });

// --- Password Hashing Middleware ---
userSchema.pre('save', async function(next) {
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

// --- Password Comparison Method ---
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;