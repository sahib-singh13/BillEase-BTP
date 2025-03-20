const ContactInfo = require("../models/ContactInfo");
const {sendAdminEmail,sendCustomerEmail}=require("../utils/emailService");
const {sendUserSMS}=require("../utils/smsService");


exports.AddContactInfo = async (req, res) => {
    try {
        const {name, email, phoneNumber} = req.body;
        if(!name || !email || !phoneNumber) {
            return res.status(400).json({
                status: 400,
                message: "Please fill all the fields",
            });
        }

        // Check whether this email exists or not
        const emailExists = await ContactInfo.findOne({email: email});
        if(emailExists) {
            return res.status(409).json({
                status: 409,
                message: "Contact information already registered, would soon be contacted",
            });
        }

        const contact = await ContactInfo.create({
            name,
            email,
            phoneNumber,
            // createdAt will use the default value from schema
        });

        try {
            await sendAdminEmail(contact);
            
            await sendCustomerEmail(contact);

            await sendUserSMS(contact);

        }catch(notificationError) {
            console.log("Error sending notifications",notificationError);
        }
        
        return res.status(201).json({
            status: 201,
            message: "Thank You! You would soon be connected!"
        });
    } catch(error) {
        console.error("Error adding contact:", error);
        return res.status(500).json({
            status: 500,
            message: "Sorry! Your information can't be added",
        });
    }
};