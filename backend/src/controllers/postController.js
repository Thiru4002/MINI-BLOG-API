const Post = require("../models/post");

//creat Post..

const createPost = async (req,res,next) => {
    try{
        const {title,content,tags} = req.body;

        if(!title || !content || !tags){
            return res.status(400).json({message:"Title or Content are required"});
        }

        const post = await Post.create({
            title,
            content,
            tags,
            author:req.user.id,
        });

        res.status(201).json({
            message:"Post created successfully",
            post,
        });
    }catch(err){
        next(err);
    }
};

//get all post..

const getAllPost = async (req,res,next) => {
    try{
        let queryObj = {};
        
        // search by title
        if(req.query.search){
            queryObj.title = {$regex:req.query.search,$options: "i"}
        }


        // search by content
        if(req.query.content){
            queryObj.content = {$regex:req.query.content,$options: "i"};
        }

        // filter by tags (comma-separated list in query)
        if(req.query.tags){
            const tagsArray = req.query.tags.split(",");
            queryObj.tags = {$in:tagsArray};
        }
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1)*limit;

        const posts = await Post.find(queryObj).skip(skip).limit(limit).populate("author","username email");
        
        const total = await Post.countDocuments(queryObj);

        res.status(200).json({
            success:true,
            count:posts.length,
            total,
            page,
            totalPage:Math.ceil(total/limit),
            posts,
        });
    }catch(err){
        next(err);
    }
};

//get single post..

const getSinglePost = async (req,res,next) => {
    try{
        

        const post = await Post.findById(req.params.id).populate("author","username email");


        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        res.status(200).json({
            success:true,
            data:post
        });
    }catch(err){
        next(err);
    }
};

//update post..

const updatePost = async (req,res,next) => {
    try{
        const {title,content,tags} = req.body;

        let post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.tags = req.body.tags || post.tags;

        await post.save();

        res.status(200).json({
            message:"Post updated success",
            data:post,
        });
    }catch(err){
        next(err);
    }
};

//delete post..

const deletePost = async (req,res,next) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message:"Post is not found"});
        }

        await post.deleteOne();

        res.status(200).json({
            message:"Post delete success",
            data:post
        });
    }catch(err){
        next(err);
    }
};

//like a post..

const likePost = async (req,res,next) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        //prevent dupicate likes..
        if(post.likes.includes(userId)){
            return res.status(400).json({message:"You alredy liked this post"});
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({
            message:"Post liked",
            likesCount:post.likes.length
        });
    }catch(err){
        next(err);
    }
};

//unlike..
const unlike = async (req,res,next) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        //check the user like it before..
        if(!post.likes.includes(userId)){
            return res.status(400).json({message:"You have not liked before this post"});
        }

        post.likes = post.likes.filter((like)=>like.toString()!==userId);
        await post.save();
        
        res.status(200).json({
            message:"Post unliked",
            likeCount:post.likes.length
        });
    }catch(err){
        next(err);
    }
};

module.exports = {
    createPost,
    getAllPost,
    getSinglePost,
    updatePost,
    deletePost,
    likePost,
    unlike,
};