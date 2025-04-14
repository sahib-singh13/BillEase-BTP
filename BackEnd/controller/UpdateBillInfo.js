const { Bill } = require("../models/BillPhotoInfo"); // Adjust path if needed
const cloudinary = require("cloudinary").v2; // Assuming Cloudinary SDK is configured
const mongoose = require('mongoose'); // Needed for ObjectId validation



// Checks if the file extension is in the list of supported types
function isFileTypeSupported(type, supportedTypes) {
    if (!type) return false; // Handle cases where extension extraction failed
    return supportedTypes.includes(type.toLowerCase());
}

// Uploads file to Cloudinary using temp file path
async function uploadFileToCloudinary(file, folder, resourceType = "auto", quality) {
    const options = {
        folder,
        resource_type: resourceType, // Let Cloudinary auto-detect or set based on mimetype
        overwrite: true,             // Overwrite if file with same public_id exists (optional)
    };
    if (quality) {
        options.quality = quality; // e.g., for image compression
    }
    // Ensure file and tempFilePath exist (depends on express-fileupload config)
    if (!file || !file.tempFilePath) {
        throw new Error("File or temporary file path is missing for Cloudinary upload.");
    }
    console.log("Uploading to Cloudinary from temp path:", file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Helper function to delete from Cloudinary
async function deleteFileFromCloudinary(publicId) {
    // Prevent errors if no ID is passed
    if (!publicId) {
        console.log("No Cloudinary public_id provided for deletion.");
        return { result: 'no_id' }; // Indicate no ID was given
    }
    try {
        console.log(`Attempting to delete Cloudinary file with public_id: ${publicId}`);
        // Specify resource_type if known, otherwise Cloudinary might guess wrong
        // For mixed types, you might need more complex logic or broader deletion attempts
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" }); // Adjust if you store non-images
        console.log("Cloudinary deletion result:", result);
        // result object contains { result: 'ok' } on success, or { result: 'not found' } etc.
        return result;
    } catch (error) {
        console.error(`Error deleting file ${publicId} from Cloudinary:`, error);
        // Don't stop the main update process, just log the error
        return { result: 'error', error: error }; // Indicate error
    }
}

// --- UPDATE BILL Controller ---
exports.updateBills= async (req, res) => {
    const { id: billId } = req.params; // Get bill ID from URL parameter
    const updatePayload = req.body;    // Get the potential updates from body
    const file = req.files ? req.files.billPhoto : null; // Check for a new file

    console.log(`--- Bill Update Request --- ID: ${billId}`);
    console.log(`Payload (Body):`, updatePayload);
    console.log(`New File:`, file ? file.name : 'No');

    // 1. Validate ID Format
    if (!mongoose.Types.ObjectId.isValid(billId)) {
        console.error("Validation Error: Invalid Bill ID format.");
        return res.status(400).json({ success: false, message: "Invalid Bill ID format provided." });
    }

    try {
        // 2. Find the existing bill - needed for old Cloudinary ID & checking existence
        const existingBill = await Bill.findById(billId);
        if (!existingBill) { // Corrected variable name
            console.error(`Error: Bill with ID ${billId} not found.`);
            return res.status(404).json({
                success: false,
                message: "Bill not found." // Corrected message
            });
        }
        console.log(`Found existing bill to update. Old Cloudinary ID: ${existingBill.cloudinaryId || 'None'}`);

        // 3. Prepare update data object
        const updateData = {};
        // Store old Cloudinary ID before potentially overwriting it in updateData
        let oldCloudinaryId = existingBill.cloudinaryId;

        // Process text fields if they are present in the request body
        if (updatePayload.billName !== undefined && updatePayload.billName !== null) {
            updateData.billName = String(updatePayload.billName).trim();
        }
        if (updatePayload.shopName !== undefined && updatePayload.shopName !== null) {
            updateData.shopName = String(updatePayload.shopName).trim();
        }
        if (updatePayload.purchaseDate !== undefined && updatePayload.purchaseDate !== null) {
             if (!updatePayload.purchaseDate) { // Handle empty string case
                 return res.status(400).json({ success: false, message: "Purchase date cannot be empty if provided." });
             }
             try {
                const parsedDate = new Date(updatePayload.purchaseDate);
                if (isNaN(parsedDate.getTime())) { // Check if date conversion resulted in a valid date
                    throw new Error("Invalid date value");
                }
                updateData.purchaseDate = parsedDate;
            } catch (e) {
                 console.error("Error parsing purchaseDate:", e);
                 return res.status(400).json({ success: false, message: "Invalid purchaseDate format provided. Use YYYY-MM-DD." });
            }
        }
        // Process items field if present
        if (updatePayload.items !== undefined && updatePayload.items !== null) {
            try {
                 // Ensure items is a string before parsing (as it comes from form-data)
                 if (typeof updatePayload.items !== 'string' || updatePayload.items.trim() === '') {
                    throw new Error("Items field must be a non-empty JSON string.");
                 }
                const parsedItems = JSON.parse(updatePayload.items);
                if (!Array.isArray(parsedItems)) {
                    throw new Error("Parsed items is not an array.");
                 }
                // Validate and format each item
                 updateData.items = parsedItems.map((item, index) => {
                    const cost = parseFloat(item.cost);
                    if (!item.itemName || typeof item.itemName !== 'string' || item.itemName.trim() === '') {
                        throw new Error(`Item name is required and must be a non-empty string for item at index ${index}.`);
                    }
                    if (isNaN(cost) || cost < 0) {
                        throw new Error(`Invalid or negative cost provided for item "${item.itemName}" at index ${index}.`);
                    }
                    return {
                        itemName: item.itemName.trim(),
                        cost: cost
                    };
                 });
                 console.log("Formatted items for update:", updateData.items);
            } catch (e) {
                console.error("Item Parsing/Validation Error during update:", e);
                return res.status(400).json({
                    success: false,
                    message: `Invalid format or content for items: ${e.message}. Must be JSON array string with valid items.`,
                });
            }
        }

        // 4. Handle New File Upload (if provided)
        if (file) {
            console.log("Processing new file for update:", file.name);
            const supportedTypes = ["jpg", "jpeg", "png", "gif", "webp", "pdf"]; // Define supported types
            const fileExtension = file.name.split('.').pop(); // Get extension
            if (!isFileTypeSupported(fileExtension, supportedTypes)) {
                console.error(`Unsupported file type: ${fileExtension}`);
                return res.status(400).json({
                    success: false,
                    message: `Unsupported file type: ${fileExtension}. Supported: ${supportedTypes.join(', ')}`
                });
            }

            try {
                const folderName = "billease_uploads"; // Define your Cloudinary folder
                const response = await uploadFileToCloudinary(file, folderName); // Upload
                console.log("New file uploaded. Cloudinary response:", response);

                updateData.billImageUrl = response.secure_url; // Add new URL to update data
                updateData.cloudinaryId = response.public_id;   // Add new ID to update data (corrected case)

            } catch (uploadError) {
               console.error("Cloudinary upload failed during update:", uploadError); // Log error
               // Return 500 error if upload fails
               return res.status(500).json({ // Corrected response format
                success: false,
                message: "Failed to upload new bill image."
               });
            }
        }

        // 5. Check if any actual data changes were provided
        if (Object.keys(updateData).length === 0) { // Check if updateData is still empty (no file OR text changes)
            console.log("No fields to update.");
            // Return success, indicating no change was needed, and send back original bill
            return res.status(200).json({
                success: true,
                message: "No changes provided.",
                bill: existingBill // Corrected variable name
            });
        }

        // 6. Perform database update
        console.log("Updating Bill in DB with:", updateData);
        const updatedBill = await Bill.findByIdAndUpdate(
            billId,
            { $set: updateData }, // Use $set to apply partial updates
            { new: true, runValidators: true } // Return updated doc, run schema validations
        );

        // Check if update returned a document
        if (!updatedBill) {
             console.error(`Bill ${billId} not found during final update operation.`);
             return res.status(404).json({ success: false, message: "Bill could not be updated as it was not found." });
        }
        console.log("Bill updated successfully in DB.");

        // 7. Delete old Cloudinary image ONLY if a new file was successfully uploaded
        // Check if 'file' exists (meaning new upload happened) AND if there was an 'oldCloudinaryId'
        if (file && oldCloudinaryId) {
            console.log(`New image uploaded, deleting old Cloudinary image: ${oldCloudinaryId}`);
            // Call deletion helper (corrected variable name)
            await deleteFileFromCloudinary(oldCloudinaryId);
            // Note: We proceed even if deletion fails, logging handled within helper
        }

        // 8. Send Success Response
        res.status(200).json({
            success: true,
            message: "Bill Updated Successfully",
            bill: updatedBill // Send the latest version
        });

    } catch (error) {
       
        console.error("Error during bill update:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation failed during update.", errors: error.errors });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while updating bill.",
            // Avoid sending detailed error message in production
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
        });
    }
};


exports.deleteBills = async (req, res) => {
    const { id: billId } = req.params; // Get bill ID from URL parameter e.g., /bills/12345

    console.log(`--- Bill Delete Request Received --- ID: ${billId}`);

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(billId)) {
        console.error("Validation Error: Invalid Bill ID format provided.");
        return res.status(400).json({ success: false, message: "Invalid Bill ID format." });
    }

    try {
        // 2. Find the bill *before* deleting to get its Cloudinary ID
        // Using findByIdAndDelete atomically finds and deletes, returning the doc if found
        const billToDelete = await Bill.findByIdAndDelete(billId);

        if (!billToDelete) {
            // If findByIdAndDelete returns null, the document wasn't found
            console.log(`Bill ${billId} not found for deletion (may have been already deleted).`);
            // It's conventional to return success even if not found, as the goal (non-existence) is achieved
            return res.status(200).json({ success: true, message: "Bill not found or already deleted." });
            // Or return 404 if you prefer:
            // return res.status(404).json({ success: false, message: "Bill not found." });
        }

        console.log(`Bill ${billId} deleted successfully from database.`);
        const cloudinaryIdToDelete = billToDelete.cloudinaryId; // Get the ID from the deleted document

        // 3. Delete the associated image from Cloudinary (if it had one)
        if (cloudinaryIdToDelete) {
            console.log(`Attempting to delete associated Cloudinary image: ${cloudinaryIdToDelete}`);
            await deleteFileFromCloudinary(cloudinaryIdToDelete);
            // We proceed even if Cloudinary deletion fails, logging handled within helper
        } else {
            console.log(`No Cloudinary ID associated with deleted bill ${billId}.`);
        }

        // 4. Send success response
        res.status(200).json({ success: true, message: "Bill deleted successfully." });

    } catch (error) {
        // 5. Catchall Error Handler
        console.error("Error during bill deletion:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting bill.",
            // Avoid sending detailed internal error messages in production
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
        });
    }
};