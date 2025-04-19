// controller/UpdateBillInfo.js

const Bill = require("../models/BillPhotoInfo"); // Import the Bill model
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose'); // Needed for ObjectId validation

// --- Helper Functions (Copied for Standalone Use) ---

// Checks if the file extension is in the list of supported types
function isFileTypeSupported(type, supportedTypes) {
    if (!type) return false;
    return supportedTypes.includes(type.toLowerCase());
}

// Uploads file to Cloudinary using temp file path
async function uploadFileToCloudinary(file, folder, resourceType = "auto", quality) {
    const options = {
        folder,
        resource_type: resourceType,
        overwrite: true, // Good practice for updates if public_id isn't changing intentionally
    };
    if (quality) {
        options.quality = quality;
    }
    if (!file || !file.tempFilePath) {
        throw new Error("File or temporary file path is missing for Cloudinary upload.");
    }
    console.log("Uploading to Cloudinary from temp path:", file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Helper function to delete from Cloudinary
async function deleteFileFromCloudinary(publicId) {
    if (!publicId) {
        console.log("No Cloudinary public_id provided for deletion.");
        return { result: 'no_id' }; // Indicate no ID was given
    }
    try {
        console.log(`Attempting to delete Cloudinary file with public_id: ${publicId}`);
        // Adjust resource_type if you store different types (e.g., "raw" for PDFs if not auto-detected)
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" }); // Try auto first
        // If auto fails for specific types, you might retry with a specific type:
        // if (result.result === 'not found') {
        //     result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        // }
        console.log("Cloudinary deletion result:", result);
        return result;
    } catch (error) {
        console.error(`Error deleting file ${publicId} from Cloudinary:`, error);
        // Log error but don't necessarily stop the main process
        return { result: 'error', error: error };
    }
}

exports.updateBills = async (req, res) => {
    const { id: billId } = req.params;
    const updatePayload = req.body;
    const file = req.files && req.files.billPhoto ? req.files.billPhoto : null;

    if (!req.user || !req.user.id) {
        console.error("Authentication Error: req.user not found in updateBills.");
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const userId = req.user.id;

    console.log(`--- Bill Update Request --- ID: ${billId}, User: ${userId}`);
    // Avoid logging entire payload if it might contain sensitive info in future
    // console.log(`Payload (Body):`, updatePayload);
    console.log(`New File:`, file ? file.name : 'No');

    if (!mongoose.Types.ObjectId.isValid(billId)) {
        console.error("Validation Error: Invalid Bill ID format.");
        return res.status(400).json({ success: false, message: "Invalid Bill ID format provided." });
    }

    try {
        // 2. Find the existing bill AND verify ownership
        const existingBill = await Bill.findOne({ _id: billId, user: userId });
        if (!existingBill) {
            console.error(`Error: Bill ${billId} not found OR does not belong to user ${userId}.`);
            return res.status(404).json({ success: false, message: "Bill not found or you do not have permission." });
        }
        console.log(`Found bill owned by user ${userId} to update.`);

        // 3. Prepare update data object - include only fields present in payload
        const updateData = {};
        let oldCloudinaryId = existingBill.cloudinaryId;

        // Process standard fields if present
        if (updatePayload.billName !== undefined) {
            updateData.billName = String(updatePayload.billName).trim();
            if (!updateData.billName) return res.status(400).json({ success: false, message: "Bill name cannot be empty." });
        }
        if (updatePayload.shopName !== undefined) {
            updateData.shopName = String(updatePayload.shopName).trim();
            if (!updateData.shopName) return res.status(400).json({ success: false, message: "Shop name cannot be empty." });
        }
        if (updatePayload.purchaseDate !== undefined) {
             if (!updatePayload.purchaseDate) return res.status(400).json({ success: false, message: "Purchase date cannot be empty." });
             try {
                 const parsedDate = new Date(updatePayload.purchaseDate);
                 if (isNaN(parsedDate.getTime())) throw new Error("Invalid date value");
                 updateData.purchaseDate = parsedDate;
             } catch (e) { return res.status(400).json({ success: false, message: "Invalid purchaseDate format." }); }
        }
        if (updatePayload.items !== undefined) {
            try {
                if (typeof updatePayload.items !== 'string' || updatePayload.items.trim() === '') throw new Error("Items must be non-empty JSON string.");
                const parsedItems = JSON.parse(updatePayload.items);
                if (!Array.isArray(parsedItems) || parsedItems.length === 0) throw new Error("Items must be non-empty array.");
                updateData.items = parsedItems.map((item, index) => {
                     const cost = parseFloat(item.cost);
                     if (!item.itemName || typeof item.itemName !== 'string' || item.itemName.trim() === '') throw new Error(`Item name required at index ${index}.`);
                     if (isNaN(cost) || cost < 0) throw new Error(`Invalid cost for item "${item.itemName}" at index ${index}.`);
                     return { itemName: item.itemName.trim(), cost: cost };
                });
            } catch (e) {
                console.error("Item Parsing/Validation Error during update:", e);
                return res.status(400).json({ success: false, message: `Invalid items: ${e.message}` });
            }
        }

        // --- Process NEW fields if present ---
        if (updatePayload.shopPhoneNumber !== undefined) {
            // Allow setting to empty string, trim otherwise
            updateData.shopPhoneNumber = String(updatePayload.shopPhoneNumber).trim();
            // Optional: Add validation for phone number format here if needed
        }
        if (updatePayload.shopAddress !== undefined) {
             // Allow setting to empty string, trim otherwise
            updateData.shopAddress = String(updatePayload.shopAddress).trim();
        }
        // --- End NEW fields ---

        // 4. Handle New File Upload
        if (file) {
            console.log("Processing new file for update:", file.name);
            const supportedTypes = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!isFileTypeSupported(fileExtension, supportedTypes)) {
                return res.status(400).json({ success: false, message: `Unsupported file type: ${fileExtension}.` });
            }
            try {
                const folderName = `billPhotos/${userId}`;
                const response = await uploadFileToCloudinary(file, folderName, "auto");
                console.log("New file uploaded. Cloudinary response:", response);
                updateData.billImageUrl = response.secure_url;
                updateData.cloudinaryId = response.public_id;
            } catch (uploadError) {
                console.error("Cloudinary upload failed during update:", uploadError);
                return res.status(500).json({ success: false, message: "Failed to upload new bill image." });
            }
        }

        // 5. Check if any actual data changes were provided
        if (Object.keys(updateData).length === 0 && !file) {
            console.log("No fields to update.");
            return res.status(200).json({ success: true, message: "No changes provided.", bill: existingBill });
        }

        // 6. Perform database update
        console.log("Updating Bill in DB with:", updateData);
        const updatedBill = await Bill.findByIdAndUpdate(
            billId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedBill) {
             console.error(`Bill ${billId} vanished during update operation for user ${userId}.`);
             return res.status(404).json({ success: false, message: "Bill could not be updated." });
        }
        console.log("Bill updated successfully in DB for user:", userId);

        // 7. Delete old Cloudinary image ONLY if new file was uploaded AND old ID existed
        if (file && oldCloudinaryId) {
            console.log(`New image uploaded, deleting old Cloudinary image: ${oldCloudinaryId}`);
            await deleteFileFromCloudinary(oldCloudinaryId);
        }

        // 8. Send Success Response
        res.status(200).json({ success: true, message: "Bill Updated Successfully", bill: updatedBill });

    } catch (error) {
        console.error(`Error during bill update process for user ${userId}:`, error);
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while updating bill.",
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
        });
    }
};


// --- DELETE BILL Controller (Protected - remains the same) ---
exports.deleteBills = async (req, res) => {
    const { id: billId } = req.params;
    if (!req.user || !req.user.id) {
        console.error("Authentication Error: req.user not found in deleteBills.");
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const userId = req.user.id;
    console.log(`--- Bill Delete Request --- ID: ${billId}, User: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(billId)) {
        return res.status(400).json({ success: false, message: "Invalid Bill ID format." });
    }

    try {
        const billToDelete = await Bill.findOneAndDelete({ _id: billId, user: userId });
        if (!billToDelete) {
            console.log(`Bill ${billId} not found or user ${userId} does not have permission.`);
            return res.status(404).json({ success: false, message: "Bill not found or you don't have permission." });
        }
        console.log(`Bill ${billId} deleted successfully from database for user ${userId}.`);
        const cloudinaryIdToDelete = billToDelete.cloudinaryId;
        if (cloudinaryIdToDelete) {
            console.log(`Attempting to delete associated Cloudinary image: ${cloudinaryIdToDelete}`);
            await deleteFileFromCloudinary(cloudinaryIdToDelete);
        } else {
            console.log(`No Cloudinary ID associated with deleted bill ${billId}.`);
        }
        res.status(200).json({ success: true, message: "Bill deleted successfully." });
    } catch (error) {
        console.error(`Error during bill deletion for user ${userId}:`, error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
             error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
        });
    }
};