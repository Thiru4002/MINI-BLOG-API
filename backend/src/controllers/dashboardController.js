const User = require("../models/user");
const Post = require("../models/post");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    const posts = await Post.find({ author: userId }).sort("-createdAt");

    res.status(200).json({
      status: "success",
      data: {
        user,
        totalPosts: posts.length,
        posts,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {getDashboard};