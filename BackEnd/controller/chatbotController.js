// controller/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// --- Configuration ---
const apiKey = process.env.GEMINI_API_KEY;

// --- Initialize Google Generative AI Client ---
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not defined!");
}
// Ensure apiKey is passed if it exists, otherwise client creation might fail later
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// --- Select the Model ---
// Use the specific model ID provided by the user
const modelName = "gemini-2.0-flash"; // <--- USE THE REQUESTED MODEL ID
let model;
if (genAI) {
    try {
        model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Initialized Gemini model: ${modelName}`);
    } catch (initError) {
         console.error(`Failed to initialize model "${modelName}":`, initError.message);
         // Keep 'model' as undefined, handle it in the request handler
    }
} else {
     console.error("Cannot initialize Gemini model: API Key missing.");
}


exports.handleChatQuery = async (req, res) => {
    const { message } = req.body; // User's message

    // --- Pre-checks ---
    if (!message) {
        return res.status(400).json({ success: false, message: "No message provided." });
    }
    if (!apiKey || !model || !genAI) { // Check if client or model failed initialization
         console.error("Chatbot service not properly configured (API Key or Model Init Failed).");
         return res.status(500).json({ success: false, message: "Chatbot service is not configured correctly." });
    }

    // --- Construct the Prompt ---
    const prompt = `You are a helpful assistant for BillEase, a bill management application. A user asked: "${message}". Please answer concisely and relevantly to bill management if possible, otherwise answer generally.`;
    console.log(`Sending prompt to ${modelName}:`, prompt);

    try {
        // --- Generate Content using the Gemini API ---
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const botReply = response.text(); // Extract the text response

        console.log(`Received reply from ${modelName}:`, botReply);

        // --- Send response back to frontend ---
        res.status(200).json({
            success: true,
            reply: botReply || "Sorry, I couldn't generate a response for that." // Provide fallback
        });

    } catch (error) {
        console.error(`Gemini API Error (${modelName}):`, error.message || error);
        // Provide a more user-friendly error message
        let userErrorMessage = "Sorry, I encountered an error processing your request. Please try again later.";
        if (error.message) {
             if (error.message.includes('API key not valid')) {
                 userErrorMessage = "Chatbot configuration error (API Key). Please contact support.";
             } else if (error.message.includes('quota')) {
                  userErrorMessage = "Chatbot service is temporarily busy. Please try again shortly.";
             } else if (error.message.includes('not found for API version') || error.message.includes('model is not found')) {
                 // This might still happen if the SDK internally can't map the name correctly
                 userErrorMessage = `Chatbot model "${modelName}" configuration error or model not available. Please contact support.`;
             } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
                 userErrorMessage = "Chatbot service is currently overloaded. Please try again in a moment.";
             } else if (error.message.includes('permission denied')) {
                 userErrorMessage = "Chatbot service access denied. Please check API key permissions.";
             }
             // Capture potential fetch errors specifically if they aren't caught above
             else if (error.message.toLowerCase().includes('fetch failed')) {
                userErrorMessage = "Network error connecting to the chatbot service. Please check the server's connection.";
             }
        }

        res.status(500).json({
            success: false,
            message: userErrorMessage // Send user-friendly error
        });
    }
};

// Make sure other controller functions (register, login, updateProfile etc.) are still present if they are in the same file
// e.g., const User = require('../models/User'); etc.