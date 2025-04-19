// models/BillPhotoInfo.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- Item Sub-Schema ---
const itemSchema = new Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    cost: {
        type: Number,
        required: [true, 'Item cost is required'],
        min: [0, 'Cost cannot be negative']
    }
}, { _id: false }); // No separate _id for subdocuments unless needed

// --- Main Bill Schema ---
const billSchema = new Schema({
    // --- User Reference ---
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    billName: {
        type: String,
        required: [true, 'Bill name is required'],
        trim: true
    },
    shopName: {
        type: String,
        required: [true, 'Shop name is required'],
        trim: true
    },
    // --- NEW FIELDS ---
    shopPhoneNumber: {
        type: String,
        trim: true,
        // Optional: Add more specific validation if needed
        // match: [/^\+?[0-9\s\-()]{7,20}$/, 'Please provide a valid phone number'],
        default: '' // Default to empty string if not provided
    },
    shopAddress: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    // --- END NEW FIELDS ---
    purchaseDate: {
        type: Date,
        required: [true, 'Purchase date is required'],
    },
    billImageUrl: {
        type: String,
        trim: true,
    },
    cloudinaryId: {
        type: String,
        trim: true,
    },
    items: {
        type: [itemSchema], // Array of items
        validate: [v => Array.isArray(v) && v.length > 0, 'At least one item is required'] // Ensure items array is not empty
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// --- Create Bill Model ---
const Bill = mongoose.model('Bill', billSchema);

// --- Export ONLY the Bill Model ---
module.exports = Bill;