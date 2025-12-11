const express = require("express");
const {protect,restrict} = require("../middlewares/auth");
const {ownerCheck} = require("../middlewares/ownerCheck");
const postController = require("../controllers/postController");

const router = express.Router();

//public routes..
router.get("/",postController.getAllPost);
router.get("/:id",postController.getSinglePost);

//procted routes..
router.post("/",protect,postController.createPost);
router.patch("/:id",protect,ownerCheck,postController.updatePost);
router.delete('/:id',protect,ownerCheck,postController.deletePost);
router.post('/like/:id',protect,postController.likePost);
router.post('/unlike/:id',protect,postController.unlike);

module.exports = router;