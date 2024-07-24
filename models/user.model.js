import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';




const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    DOB:{
        type: String,
        required:[true, "DOb is required"]
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OTP"
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    console.log("------------------------>Password hash")
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordConfirm = async function (password) {
    console.log("------------------------>Password compare");
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.GENERATEACCESSTOKEN = function(){
    try {
        return jwt.sign(
            {
                _id:this._id,
                email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        )
    } catch (error) {
        console.log("error in access token",error);
    }
}

const User = mongoose.model("User", userSchema);

export default User;