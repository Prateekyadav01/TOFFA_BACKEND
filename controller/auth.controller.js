import { OTP } from "../models/otp.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import otpGenrator from "otp-generator";
import { ApiResponse } from "../utils/ApiResponse.js";





const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = user.GENERATEACCESSTOKEN();
    await user.save({ validateBeforeSave: false })

    console.log(accessToken)
    return { accessToken};
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};


export const signup = async (req, res) => {
  try {
    const { firstName, lastName, DOB, email, phoneNumber, password } = req.body;

    if (
      [firstName, lastName, DOB, email, password].some(
        (field) => typeof field === "string" && field.trim() === ""
      )
    ) {
      throw new ApiError(400, "Please fill all the details");
    }

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ApiError(400, "User is already exist");
    }
    const otp = otpGenrator.generate(6);
    console.log(otp);

    const createOtpDb = await OTP.create({
      email,
      otp,
    });

    console.log(createOtpDb);

    // verfiyOtp(email)

    const user = await User.create({
      firstName,
      lastName,
      DOB,
      email,
      phoneNumber,
      password,
      otp: createOtpDb._id
    });

    if (!user) {
      throw new ApiError(500, "Internal server error while creating user");
    }

    return res.status(200).json({
      success: true,
      message: "User signed up successfully",
      user,
    });
  } catch (error) {
    console.log("error in signyp", error);
  }
};




export const login =async(req,res)=>{
  try {

    console.log("login----------api")
    const {email,password} = req.body;
    console.log(req.body);
    if(!email ||!password){
      throw new ApiError(400,"Please provide email and password")
    }
    const user = await User.findOne({email});


    console.log(user);

    if(!user){
      throw new ApiError(404,"User not found")
    }


    const isMatchPassword = await user.isPasswordConfirm(password);
    console.log(isMatchPassword);


    if(isMatchPassword==false){
      throw new ApiError(400,"Invalid credentials")
    }

    console.log("password matched");
    const { accessToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password "
    );

    const options = {
      sameSite: 'lax',
      secure: false,
      path: '/',
    };

    console.log(accessToken)
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    console.log("error in login", error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
  }
}


export const forgotPassword = async (req, res) => {
  try {
    const { email , oldPassword, newPassword } = req.body;

    console.log("forgot password parameter",req.body);
    if (!email) {
      throw new ApiError(400, "Please provide email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    console.log("User for forgot password",user);
    const isMatchPassword = await user.isPasswordConfirm(oldPassword);
    if (!isMatchPassword) {
      throw new ApiError(400, "Old password is incorrect");
    }
    console.log("Matched successfully")
    // const updateUserPassword = await User.findByIdAndUpdate(user._id,{ $set: {password:newPassword}});

    // console.log(updateUserPassword);
    // sendOtp(email, otp);

    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: user
    });
  } catch (error) {
    console.log("error in forgotPassword", error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
  }
}

export const verfiyOtp = async (req, res, email) => {
  try {
    const { otp } = req.body;

    console.log("otp email ----------->",email);
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.otp.otp === otp) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }
  } catch (error) {
    console.log("errror in otp generate", error);
  }
};
