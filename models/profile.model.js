import mongoose from "mongoose";



const profileSchema =  new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    giftYouWant: {
        type: [String],
        required: true
    }
})