const express=require("express");
require("dotenv").config();
const dbConnect=require("./config/database");
const contactRoutes=require("./routes/contacts");
const app=express();
var cors = require("cors");
const PORT=process.env.PORT || 5000;

app.use(
    cors({
        origin:"*",
    })
);
//Middleware
app.use(express.json());

app.use("/billease",contactRoutes);

// CORS Configuration
app.listen(PORT, () => {
    console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
  });
  
dbConnect();

app.get("/",(req,res)=>{
    res.send("Welcome to Billease API");
});