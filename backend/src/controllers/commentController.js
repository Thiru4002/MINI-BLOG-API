const Post = require("../models/post");
const Comment = require("../models/comment");


//crete comment..
const createComment = async (req,res,next) => {
    try{


        const {content} = req.body;

        if(!content){
            return res.status(400).json({message:"Comment content is requered"});
        }

        const post = await Post.findById(req.params.postId);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        const comment = await Comment.create({
            content,
            author:req.user.id,
            post:req.params.postId,
        });

        res.status(201).json({
            message:"comment added sucessfull",
            comment,
        });
    }catch(err){
        next(err);
    }
};

//getCOmmentById..

const getCommentByPost = async (req,res,next) => {

    try{
        const {postId} = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit

        const comments = await Comment.find({post:postId})
            .skip(skip)
            .limit(limit)
            .populate("author","username email")
            .sort({createdAt: -1});

        const total = await Comment.countDocuments({post:postId});

        res.status(200).json({
            success: true,
            count: comments.length,
            total,
            page,
            totalPage:Math.ceil(total/limit),
            comments,
        });
    }catch(err){
        next(err);
    }
};

const updateComment = async (req,res,next) => {
    try{
        let comment = await Comment.findById(req.params.id);

        if(!comment){
            return res.status(404).json({message:"comment is not found"});
        }

        if(comment.author.toString()!==req.user.id && req.user.role !=="admin"){
            return res.status(403).json({message:"Not authorized"});
        }

        comment.content = req.body.content || comment.content;
        await comment.save();

        res.status(200).json({
            message:"comment updated successfully",
            comment,
        });
    }catch(err){
        next(err);
    }
};

const deleteComment = async (req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.id);

        if(!comment){
            return res.status(404).json({message:"comment not found"});
        }

        if(comment.author.toString()!==req.user.id && req.user.role !== "admin"){
            return res.status(403).json({message:"Not authorized"});
        }

        await comment.deleteOne();

        res.status(200).json({
            message:"comment deleted successfully",
            comment
        });
    }catch(err){
        next(err);
    }
};

module.exports = {
    createComment,
    getCommentByPost,
    updateComment,
    deleteComment,
};