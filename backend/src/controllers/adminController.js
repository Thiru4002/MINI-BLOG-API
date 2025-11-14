const User = require("../models/user");

//get all users..
const getAllUsers = async (req,res,next) => {
    try{
        let queryObj = {};

        //search by username or email..
        if(req.query.search){
            queryObj.$or = [
                {username:{$regex : req.query.search,$options: "i"}},
                {email:{$regex : req.query.search,$options: "i"}}
            ];
        }

        //filter by role..
        if(req.query.role){
            queryObj.role = req.query.role;
        }

        //pagination..
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit

        const users = await User.find(queryObj)
            .skip(skip)
            .limit(limit)
            .select("-password")
            .sort({createdAt: -1});

        const total = await User.countDocuments(queryObj);

        res.status(200).json({
            success:true,
            count:users.length,
            total,
            page,
            totalPage:Math.ceil(total/limit),
            users
        });
    }catch(err){
        next(err);
    }
};

//get single user..
const getSingleUser = async (req,res,next) => {
    try{
        const {id} = req.params;

        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        res.status(200).json({
            success:true,
            user
        });
    }catch(err){
        next(err);
    }
};

//delete users..
const deleteUser = async (req,res,next) => {
    try{
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //prevent admin from deleting themSelves

        if(user._id.toString()===req.user._id.toString()){
            return res.status(400).json({message:"You cannot delete your own account"});
        }

        await user.deleteOne();

        res.status(200).json({
            success:true,
            message:"User deleted successfully",
            data:user,
        });
    }catch(err){
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    deleteUser
};