const twilio=require('twilio');
require('dotenv').config();

const client=twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendUserSMS = async(contactData) => {
    try {
        const message=await client.messages.create({
            body: `Thank you, ${contactData.name}! We've received your contact information and will be in contact with u shortly.

BillEase
(Transforming billing around the world)`,

            from: process.env.TWILIO_PHONE_NUMBER,
            to: contactData.phoneNumber
        });

        console.log('SMS sent with SID:',message.sid);
        return message;
    } catch(error) {
        console.log('Error sending SMS:',error);
        throw error;
    }
    };

    module.exports={sendUserSMS};

