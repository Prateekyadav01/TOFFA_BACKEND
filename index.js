import { app } from "./app.js";
import { dbConnection } from "./config/database.js";




dbConnection()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((error)=>{
    console.error("Error connecting to database:", error);
    process.exit(1);  
})

