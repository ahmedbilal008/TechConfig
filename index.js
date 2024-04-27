// const express = require("express");
// require("dotenv").config();
// const app = express();
// const cors = require("cors");
// const db = require("./database/database");


// app.use(cors());
// app.use(express.json());

// //get all products
// app.get("/api/v1/products",async(req,res)=>{
//     const results= await db.query("select * from Products");
//     console.log(results);
//     res.json({
//         status:"success",
//     });
// })

// const port = process.env.PORT || 3001;

// app.listen(port, ()=>{
//     console.log("server has started on port 5000");
// })