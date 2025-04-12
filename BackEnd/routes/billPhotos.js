// routes/billPhotos.js
const express = require("express");
const router = express.Router();
// Assuming your controller is named AddBillPhotoInfo.js
const { billUpload, getBills } = require("../controller/AddBillPhotoInfo"); // Add getBills

// POST route for uploading
router.post("/billUpload", billUpload);

// GET route for fetching bills
router.get("/getBills", getBills); // Add this route

module.exports = router;