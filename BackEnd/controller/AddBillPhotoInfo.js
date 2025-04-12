
const { Bill } = require("../models/BillPhotoInfo"); 
const cloudinary = require("cloudinary").v2;

// --- Helper Functions (ensure these are defined or imported) ---

// Checks if the file extension is in the list of supported types
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// Uploads file to Cloudinary using temp file path
async function uploadFileToCloudinary(file, folder, resourceType = "auto", quality) {
    const options = {
        folder,
        resource_type: resourceType,
    };

    if (quality) {
        options.quality = quality; 
    }

    console.log("Temporary file path ->", file.tempFilePath);
    if (!file.tempFilePath) {
        throw new Error("Temporary file path is missing. Check file upload middleware configuration.");
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}



exports.billUpload = async (req, res) => {
    try {
        // --- ADDED DEBUG LOGS ---
        console.log("--- Request Received ---");
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);
        console.log("------------------------");
        // --- END DEBUG LOGS ---

        // 1. Extract data from request body
        const { billName, shopName, purchaseDate, items } = req.body;

        // --- Basic Validation ---
        // Check if the fields exist in req.body AFTER logging it
        if (!billName || !shopName || !purchaseDate || !items) {
            console.error("Validation Failed: One or more required text fields missing in req.body");
            return res.status(400).json({
                success: false,
                message: "Missing required fields (billName, shopName, purchaseDate, items). Check server logs for req.body content.",
            });
        }

        // 2. Parse items (assuming it's sent as a JSON string)
        let parsedItems;
        try {
            parsedItems = JSON.parse(items);
            if (!Array.isArray(parsedItems)) throw new Error("Items must be an array.");
            // Optional: Add deeper validation for item structure here if needed
        } catch (parseError) {
            console.error("Item Parsing Error:", parseError);
            return res.status(400).json({
                success: false,
                message: "Invalid format for items. Please provide a valid JSON array string.",
            });
        }

        // 3. Handle File Upload (Optional)
        let billImageUrl;
        let cloudinaryId;
        const file = req.files ? req.files.billPhoto : null; // Match the key used in frontend FormData

        if (file) {
            console.log("Bill photo received:", file.name);

            // Validation (Image Specific)
            const supportedTypes = ["jpg", "jpeg", "png", "gif", "webp"]; // Add more if needed
            const fileType = file.name.split('.').pop()?.toLowerCase();

            if (!fileType || !isFileTypeSupported(fileType, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: `File format (${fileType || 'unknown'}) not supported. Please upload: ${supportedTypes.join(', ')}`,
                });
            }

            // Upload to Cloudinary
            console.log("Uploading bill photo to Cloudinary...");
            const folderName = "billPhotos"; // Generic folder name since no user context
            try {
                const response = await uploadFileToCloudinary(file, folderName);
                console.log("Cloudinary response:", response);
                billImageUrl = response.secure_url;
                cloudinaryId = response.public_id;
            } catch (uploadError) {
                 console.error("Cloudinary Upload Error:", uploadError);
                 console.warn("Proceeding without uploaded image due to Cloudinary error.");
                 billImageUrl = undefined;
                 cloudinaryId = undefined;
            }

        } else {
            console.log("No bill photo provided.");
        }

        // 4. Create Bill entry in Database
        const billData = {
            // user field removed
            billName,
            shopName,
            purchaseDate: new Date(purchaseDate), // Ensure it's stored as a Date object
            items: parsedItems, // Use the parsed array
            billImageUrl: billImageUrl, // Will be undefined if no file or upload failed
            cloudinaryId: cloudinaryId,   // Will be undefined if no file or upload failed
        };

        const savedBill = await Bill.create(billData);
        console.log("Bill saved to database:", savedBill._id);

        // 5. Send Success Response
        res.status(201).json({ // 201 Created status
            success: true,
            message: "Bill uploaded and saved successfully.",
            bill: savedBill, // Send back the created bill document
        });

    } catch (error) {
        console.error("Error in billUpload controller:", error);

        if (error.name === 'ValidationError') {
             return res.status(400).json({
                 success: false,
                 message: "Validation Error",
                 errors: error.errors
             });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error while uploading bill.",
            error: error.message // Avoid sending detailed error in production
        });
    }
};



exports.getBills = async (req, res) => {
    try {
        console.log("Fetching all bills...");
        // Fetch all bills, sort by newest first (based on createdAt timestamp)
        const allBills = await Bill.find({}).sort({ createdAt: -1 });

        console.log(`Found ${allBills.length} bills.`);
        res.status(200).json(allBills); // Send the array of bills

    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bills.",
            error: error.message
        });
    }
};