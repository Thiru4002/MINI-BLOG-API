const User = require('../models/user');
const {generateToken} = require("../utils/token");
const crypto = require("crypto");

const register = async (req,res,next) => {
    try{


        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message:"All field are required"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already existing"});
        }

        const newUser = await User.create({username,email,password});

        const token = generateToken(newUser._id);

        res.status(201).json({
            message:"User created successfully",
            token,
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                role:newUser.role,
            },
        });
    }catch(err){
        next(err);
    }
};

const login = async (req,res,next) => {
    try{
        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message:"Email or password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentails"});
        }

        const token = generateToken(user._id);


        res.status(200).json({
            message:"Login success",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
            },
        });
    }catch(err){
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
  try {
    // 1️⃣ Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // 2️⃣ Generate the reset token (✅ use the instance, not the model)
    const resetToken = user.createPasswordResetToken();

    // 3️⃣ Save hashed token & expiry in DB (✅ use validateBeforeSave, not bulkSave)
    await user.save({ validateBeforeSave: false });

    // 4️⃣ Create reset URL (✅ make route path clear)
    const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;

    // 5️⃣ Send email (for now, log it)
    console.log("Password reset link:", resetURL);

    res.status(200).json({
      status: "success",
      message: "Reset token generated and sent to email (check console)",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({
      status: "fail",
      message: "Error sending reset token, please try again later",
    });
  }
};

const resetPassword = async (req,res,next) =>{
    try{
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");
        //find the user by this token..
        const user = await User.findOne({
            passwordResetToken:hashedToken,
            passwordResetExpires:{$gt:Date.now()},
        });

        //if no user or token expired..
        if(!user){
            return res.status(400).json({message:"token invalid or expired"});
        }

        //set a new password..
        user.password = req.body.password;

        //clear reset fields
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        //save the updated user..
        await user.save();

        return res.status(200).json({
            status:"success",
            message:"password reset successfully",
        });
    }catch(err){
        console.error("password reset failed",err);
        return res.status(500).json({
            message:"server error during password reset"
        });
    }
};

module.exports = {register,login,forgotPassword,resetPassword};