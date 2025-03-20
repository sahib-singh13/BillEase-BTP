const express=require("express");
const router=express.Router();
const {AddContactInfo}=require("../controller/AddContactInfo");

router.post("/addContact",AddContactInfo);

module.exports=router;
