const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is required"],
        trim: true,
    },
    content:{
        type:String,
        required:[true,"content is required"],
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    tags:[
        {
            type:String,
        },
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
},{timestamps:true});

const Post = mongoose.model("Post",postSchema);

module.exports = Post;