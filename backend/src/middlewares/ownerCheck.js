const Post = require("../models/post");

const ownerCheck = async (req,res,next) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to modify this post" });
        }

        req.post = post;

        next();
    }catch(err){
        next(err);
    }
};

module.exports = {ownerCheck};