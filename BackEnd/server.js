
const express=require("express");
require("dotenv").config();
const dbConnect=require("./config/database");
const cloudinaryConfig = require("./config/cloudinary");
const fileupload=require("express-fileupload");
const cors = require("cors");



const contactRoutes=require("./routes/contacts");
const billPhotoRoutes=require("./routes/billPhotos");
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot'); 
const app=express();
const PORT=process.env.PORT || 5000;


app.use(cors({ origin: "*" })); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/' 
}));


app.use("/billease/auth", authRoutes);
app.use("/billease/contacts", contactRoutes); 
app.use("/billease/bills", billPhotoRoutes);
app.use("/billease/chatbot", chatbotRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to Billease API v1");
});



app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});



const startServer = async () => {
    try {
        await dbConnect(); 
        cloudinaryConfig.cloudinaryConnect(); 

        app.listen(PORT, () => {
            console.log(`Server is UP and RUNNING at PORT ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer(); 