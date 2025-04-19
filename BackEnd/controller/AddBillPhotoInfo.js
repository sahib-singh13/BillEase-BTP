// controller/AddBillPhotoInfo.js

const Bill = require("../models/BillPhotoInfo"); // Import the Bill model
const cloudinary = require("cloudinary").v2;

// --- Helper Functions ---

// Checks if the file extension is in the list of supported types
function isFileTypeSupported(type, supportedTypes) {
    if (!type) return false;
    return supportedTypes.includes(type.toLowerCase());
}

// Uploads file to Cloudinary using temp file path
async function uploadFileToCloudinary(file, folder, resourceType = "auto", quality) {
    const options = { folder, resource_type: resourceType };
    if (quality) { options.quality = quality; }
    if (!file.tempFilePath) { throw new Error("Temporary file path is missing."); }
    console.log("Uploading to Cloudinary from temp path:", file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


// --- Create Bill Controller (Protected) ---
exports.billUpload = async (req, res) => {
    try {
        console.log("--- Request Received (Protected - billUpload) ---");
        if (!req.user || !req.user.id) {
             console.error("Authentication Error: req.user not found in billUpload.");
             return res.status(401).json({ success: false, message: 'Not authorized. User information missing.' });
        }
        const userId = req.user.id;
        console.log("Authenticated User ID:", userId);
        console.log("Request Body:", req.body); // Log entire body for debugging
        // console.log("Request Files:", req.files); // Uncomment if needed

        // 1. Extract data from request body (including new fields)
        const { billName, shopName, purchaseDate, items, shopPhoneNumber, shopAddress } = req.body;

        // --- Basic Validation ---
        if (!billName || !shopName || !purchaseDate || !items) {
            console.error("Validation Failed: Required text fields missing.");
            return res.status(400).json({ success: false, message: "Missing required fields: billName, shopName, purchaseDate, items." });
        }

        // 2. Parse and Validate Items
        let parsedItems;
        try {
            if (typeof items !== 'string') { throw new Error("Items field must be sent as a JSON string."); }
            parsedItems = JSON.parse(items);
            if (!Array.isArray(parsedItems)) throw new Error("Items must be an array.");
            if (parsedItems.length === 0) throw new Error("Items array cannot be empty.");
            for (const item of parsedItems) {
                if (!item.itemName || typeof item.itemName !== 'string' || item.itemName.trim() === '') throw new Error("Each item must have a non-empty itemName.");
                if (item.cost === undefined || typeof item.cost !== 'number' || item.cost < 0 || isNaN(item.cost)) throw new Error(`Invalid cost for item: ${item.itemName}`);
                item.itemName = item.itemName.trim(); item.cost = Number(item.cost);
            }
        } catch (parseError) {
            console.error("Item Parsing/Validation Error:", parseError);
            return res.status(400).json({ success: false, message: `Invalid items format: ${parseError.message}.` });
        }

         // 3. Validate Purchase Date
         let validPurchaseDate;
         try {
            validPurchaseDate = new Date(purchaseDate);
            if (isNaN(validPurchaseDate.getTime())) throw new Error("Invalid date value");
         } catch(dateError) {
            console.error("Invalid purchaseDate format:", purchaseDate);
            return res.status(400).json({ success: false, message: "Invalid purchaseDate format." });
         }


        // 4. Handle File Upload (Optional)
        let billImageUrl;
        let cloudinaryId;
        const file = req.files && req.files.billPhoto ? req.files.billPhoto : null;

        if (file) {
            console.log("Bill photo received:", file.name);
            const supportedTypes = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
            const fileType = file.name.split('.').pop()?.toLowerCase();

            if (!fileType || !isFileTypeSupported(fileType, supportedTypes)) {
                 return res.status(400).json({ success: false, message: `File format (${fileType || 'unknown'}) not supported.` });
            }
            console.log("Uploading bill photo to Cloudinary...");
            const folderName = `billPhotos/${userId}`;
            try {
                const response = await uploadFileToCloudinary(file, folderName, "auto");
                console.log("Cloudinary upload response:", response);
                billImageUrl = response.secure_url;
                cloudinaryId = response.public_id;
            } catch (uploadError) {
                 console.error("Cloudinary Upload Error:", uploadError);
                  return res.status(500).json({ success: false, message: "Failed to upload bill image. Bill not saved.", error: uploadError.message });
            }
        } else {
            console.log("No bill photo provided.");
        }

        // 5. Create Bill entry in Database
        const billData = {
            user: userId,
            billName: billName.trim(),
            shopName: shopName.trim(),
            purchaseDate: validPurchaseDate,
            items: parsedItems,
            billImageUrl: billImageUrl,
            cloudinaryId: cloudinaryId,
            // --- Add new fields, trim if provided, else default to empty string ---
            shopPhoneNumber: shopPhoneNumber ? String(shopPhoneNumber).trim() : '',
            shopAddress: shopAddress ? String(shopAddress).trim() : '',
        };

        const savedBill = await Bill.create(billData);
        console.log(`Bill saved to database for user ${userId}:`, savedBill._id);

        // 6. Send Success Response
        res.status(201).json({
            success: true,
            message: "Bill uploaded and saved successfully.",
            bill: savedBill,
        });

    } catch (error) {
        console.error("Error in billUpload controller:", error);
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ success: false, message: "Validation Error creating bill.", errors: messages });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while uploading bill.",
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
        });
    }
};


// --- Get User's Bills Controller (Protected - remains the same) ---
exports.getBills = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            console.error("Authentication Error: req.user not found in getBills.");
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const userId = req.user.id;
        console.log(`Fetching bills for user: ${userId}...`);
        const userBills = await Bill.find({ user: userId }).sort({ createdAt: -1 });
        console.log(`Found ${userBills.length} bills for user ${userId}.`);
        res.status(200).json({
            success: true,
            count: userBills.length,
            bills: userBills
        });

    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bills.", error: error.message });
    }
};