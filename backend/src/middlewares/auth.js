const jwt = require('jsonwebtoken');

const User = require("../models/user");

const protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(403).json({message:"not to otherized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const currentUser = await User.findById(decoded.id);

        if(!currentUser){
            return res.status(400).json({message:"user no longer exists"});
        }

        req.user = currentUser;

        next();
    }catch(err){
        next(err);
    }
};

const restrict = (...role)=>{
    return (req,res,next) =>{
        if(!role.includes(req.user.role)){
            return res.status(403).json({message:"you don't have permissio to do that"});
        }
        next();
    }
};

module.exports = {
    protect,
    restrict
};