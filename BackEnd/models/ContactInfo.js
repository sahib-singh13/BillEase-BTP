const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"]
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please provide a valid phone number"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model("ContactInfo",contactInfoSchema);