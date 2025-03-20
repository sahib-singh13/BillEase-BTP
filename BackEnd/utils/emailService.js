const nodemailer=require('nodemailer');
require('dotenv').config();

const transporter= nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

//email to yourself admin
const sendAdminEmail= async(contactData) =>{
    try{
          const mailOptions = {
             from: process.env.EMAIL_USER,
             to: process.env.ADMIN_EMAIL,
             subject:'New recieved Query:',
             html: 
             `
               <h2>New Contact Information:</h2>
               <p><strong>Name:</strong>${contactData.name}</p>
               <p><strong>Email:</strong>${contactData.email}</p>
               <p><strong>Phone:</strong>${contactData.phoneNumber}</p>
               <p><strong>Added On:</strong>${contactData.createdAt}</p>
             `
          };

          const info=await transporter.sendMail(mailOptions);
          return info;
    } catch(error) {
       console.log("error sedning admin email",error);
       throw error;
    }
}

const sendCustomerEmail = async (contactData) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contactData.email, // Customer's email
        subject: 'Thank You for Contacting Us',
        html: `
          <h2>Thank You for Reaching Out</h2>
          <p>Dear ${contactData.name},</p>
          <p>We have received your query and will get
           back to you as soon as possible.</p>
          <p>Best regards,<br>BillEase pvt.ltd<br>
          Transforming billing around the world</p>
        `
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Customer email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending customer email:', error);
      throw error;
    }
  };

  module.exports = {sendAdminEmail,sendCustomerEmail };