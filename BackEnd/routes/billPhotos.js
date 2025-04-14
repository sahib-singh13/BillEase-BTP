// routes/billPhotos.js
const express = require("express");
const router = express.Router();
// Assuming your controller is named AddBillPhotoInfo.js
const { billUpload, getBills } = require("../controller/AddBillPhotoInfo"); // Add getBills
const {updateBills,deleteBills}=require("../controller/UpdateBillInfo");
// POST route for uploading
router.post("/billUpload", billUpload);

// GET route for fetching bills
router.get("/getBills", getBills); // Add this route

//Patch route to delete based on the id of bill

router.patch("/updateBills/:id",updateBills);
router.delete("/deleteBills/:id",deleteBills);


module.exports = router;