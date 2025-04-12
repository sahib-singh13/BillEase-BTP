const express = require("express");
const router = express.Router();

// Correct the path if controller is in ../controllers/ not ../controller/
const { billUpload } = require("../controller/AddBillPhotoInfo");

//api router
router.post("/billUpload", billUpload);
// Add this line at the end:
module.exports = router;