const express = require("express");
const {protect,restrict} = require("../middlewares/auth");
const {ownerCheck} = require("../middlewares/ownerCheck");
const commentController = require("../controllers/commentController");

const router = express.Router();

// Public
router.get("/:postId", commentController.getCommentByPost);

// Protected..
router.post("/:postId", protect, commentController.createComment);
router.patch("/:id", protect, commentController.updateComment);
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;