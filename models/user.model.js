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
    }
})

userSchema.pre('save', function(){
    const user = this;
    if(user.isModified('password')){
        user.password = bcrypt.hashSync(user.password, 10);
    }
})

userSchema.methods.GENERATEACCESSTOKEN = function(){
    try {
        return jwt.sign(
            {
                _id:this._id,
                email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1h',
            }
        )
    } catch (error) {
        console.log("error in access token",error);
    }
}

const User = mongoose.model("User", userSchema);

export default User;