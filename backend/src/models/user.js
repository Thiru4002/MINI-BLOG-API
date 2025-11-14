const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:[true,"provide a user name"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"provide a email"],
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Provide a password"],
        minlength:6,
        trim:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
},{timestamps:true});

userSchema.pre('save',async function (next) {
    if(!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

//method to create password reset token..

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

   //hash it and store in db.. 

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //set token expiration time..

    this.passwordResetExpires = Date.now()+10*60*1000;

    return resetToken;
};

const User = mongoose.model("User",userSchema);

module.exports = User;