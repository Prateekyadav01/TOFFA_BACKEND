import mongoose from "mongoose";



export const dbConnection = async(req,res)=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/testing")
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB")
    }
}