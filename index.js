import { app } from "./app.js";
import { dbConnection } from "./config/database.js";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})


dbConnection()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);  
    });
}).catch((error)=>{
    console.error("Error connecting to database:", error);
    process.exit(1);  
})

