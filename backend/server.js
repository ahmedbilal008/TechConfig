const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");


process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

dotenv.config({ path: "backend/config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log("server has started on port 5000");
}) 
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    server.close(()=>{
        process.exit(1);
    })
});
