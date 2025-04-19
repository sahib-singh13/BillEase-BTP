// utils/cloudinaryUtils.js (Example - create if it doesn't exist)
const cloudinary = require("cloudinary").v2;

// Ensure Cloudinary is configured (likely done in config/cloudinary.js)

// --- Helper Functions ---

// Checks if the file extension is supported
exports.isFileTypeSupported = (type, supportedTypes) => {
    if (!type) return false;
    return supportedTypes.includes(type.toLowerCase());
}

// Uploads file to Cloudinary
exports.uploadFileToCloudinary = async (file, folder, resourceType = "auto", quality) => {
    const options = {
        folder,
        resource_type: resourceType,
        overwrite: true, // Overwrite existing file with the same name (public_id) if necessary
    };
    if (quality) { options.quality = quality; }
    if (!file || !file.tempFilePath) {
        throw new Error("File or temporary file path is missing for Cloudinary upload.");
    }
    console.log(`Uploading to Cloudinary folder '${folder}' from temp path:`, file.tempFilePath);
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log("Cloudinary Upload Success:", result.public_id);
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload file to Cloudinary."); // Re-throw for controller handling
    }
}

// Deletes file from Cloudinary
exports.deleteFileFromCloudinary = async (publicId, resourceType = "image") => { // Default to image
    if (!publicId) {
        console.log("No Cloudinary public_id provided for deletion.");
        return { result: 'no_id' };
    }
    try {
        console.log(`Attempting to delete Cloudinary file: ${publicId}, type: ${resourceType}`);
        // Try deleting with specified resource type
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("Cloudinary deletion result:", result);
         // If not found, try 'raw' for non-image/video files (like PDFs if needed, though profiles are images)
         // if (result.result === 'not found' && resourceType !== 'raw') {
         //    console.log(`Retrying deletion as 'raw' for ${publicId}`);
         //    return await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
         // }
        return result;
    } catch (error) {
        console.error(`Error deleting file ${publicId} (type: ${resourceType}) from Cloudinary:`, error);
        // Log error but don't necessarily stop the update process
        return { result: 'error', error: error };
    }
}