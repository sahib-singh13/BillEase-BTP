// routes/billPhotos.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const { billUpload, getBills } = require("../controller/AddBillPhotoInfo");
const { updateBills, deleteBills } = require("../controller/UpdateBillInfo");

// --- APPLY 'protect' MIDDLEWARE TO ALL BILL ROUTES ---
router.post("/billUpload", protect, billUpload);
router.get("/getBills", protect, getBills);
router.patch("/updateBills/:id", protect, updateBills);
router.delete("/deleteBills/:id", protect, deleteBills);

module.exports = router;