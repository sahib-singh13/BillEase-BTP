const mongoose = require('mongoose');
require('dotenv').config(); 
const Schema = mongoose.Schema;

// --- User Schema ---
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
    },
    password: { 
        type: String,
        required: true
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);


// --- Item Sub-Schema ---
const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    cost: {
        type: Number,
        required: true,
        min: [0, 'Cost cannot be negative']
    }
}, { _id: false });


// --- Main Bill Schema ---
const billSchema = new Schema({
    
    billName: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    billImageUrl: { 
        type: String,
        trim: true,
    },
    cloudinaryId: { 
        type: String,
    },
    items: [itemSchema]
}, {
    timestamps: true // Adds createdAt and updatedAt
});


// --- Create Bill Model ---
const Bill = mongoose.model('Bill', billSchema);


// --- Export Models ---
// Export both models so they can be used elsewhere
module.exports = { Bill, User };