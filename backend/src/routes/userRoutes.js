const express = require('express');
const {register,login,forgotPassword,resetPassword} = require('../controllers/authController');
const {updateUser} = require('../controllers/userController');
const adminController = require("../controllers/adminController");
const {protect,restrict} = require("../middlewares/auth");
const {ownerCheck} = require("../middlewares/ownerCheck");

const router = express.Router();

//public routes..
router.post("/register",register);
router.post("/login",login);
router.patch("/forgotPassword",forgotPassword);
router.patch("/resetPassword/:token",resetPassword);

//user update there profile..
router.patch("/:id",protect,ownerCheck,updateUser);

//admin only routes..
router.get("/",protect,restrict("admin"),adminController.getAllUsers);
router.get("/:id",protect,restrict("admin"),adminController.getSingleUser);
router.delete("/:id",protect,restrict("admin"),adminController.deleteUser);

module.exports = router;