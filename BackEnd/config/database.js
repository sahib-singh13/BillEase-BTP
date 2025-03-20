const mongoose=require("mongoose");

require("dotenv");

const dbConnect= ()=>{

     mongoose
     .connect(process.env.DATABASE_URL,{
     })
     .then(()=>{
         console.log("Connected to database");
     })

     .catch((err)=>{
       console.log(`DB connection issues`);
       process.exit(1);
     });
};

module.exports=dbConnect;
