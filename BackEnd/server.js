// server.js
const express=require("express");
require("dotenv").config();
const dbConnect=require("./config/database");
const cloudinaryConfig = require("./config/cloudinary"); // Renamed for clarity
const fileupload=require("express-fileupload");
const cors = require("cors");


// --- Import Routes ---
const contactRoutes=require("./routes/contacts");
const billPhotoRoutes=require("./routes/billPhotos");
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot'); // Import auth routes

const app=express();
const PORT=process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({ origin: "*" })); // Consider restricting origin in production
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (optional but good practice)

// File Upload Middleware (ensure temp dir exists or is writable)
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/' // Make sure this directory exists and is writable by the server process
    // Consider adding limits: limits: { fileSize: 5 * 1024 * 1024 }, // Example: 5MB limit
}));

// --- API Routes ---
app.use("/billease/auth", authRoutes); // Mount auth routes (added /api/v1 prefix)
app.use("/billease/contacts", contactRoutes); // Mount contact routes (added prefix)
app.use("/billease/bills", billPhotoRoutes);
app.use("/billease/chatbot", chatbotRoutes); // Mount bill routes (added prefix, changed path slightly for clarity)

// --- Root Route ---
app.get("/", (req, res) => {
    res.send("Welcome to Billease API v1");
});

// --- Global Error Handler (Basic Example) ---
// Place this after all routes
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        // Optionally include stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});


// --- Server Startup Function ---
const startServer = async () => {
    try {
        await dbConnect(); // Connect to DB first
        cloudinaryConfig.cloudinaryConnect(); // Configure Cloudinary

        app.listen(PORT, () => {
            console.log(`Server is UP and RUNNING at PORT ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer(); // Call the function to start the server