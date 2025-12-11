const express = require('express');
const {register,login,forgotPassword,resetPassword} = require('../controllers/authController');
const {updateUser,getUserProfile} = require('../controllers/userController');
const adminController = require("../controllers/adminController");
const dashboard = require("../controllers/dashboardController");
const {protect,restrict} = require("../middlewares/auth");
const {ownerCheck} = require("../middlewares/ownerCheck");

const router = express.Router();

//public routes..
router.post("/signup",register);
router.post("/login",login);
router.patch("/forgotPassword",forgotPassword);
router.patch("/resetPassword/:token",resetPassword);
router.get("/dashboard",protect,dashboard.getDashboard);

//user update there profile..
router.patch("/update", protect, updateUser);

router.get("/profile/:id", protect,getUserProfile);


//admin only routes..
router.get("/",protect,restrict("admin"),adminController.getAllUsers);
router.get("/:id",protect,restrict("admin"),adminController.getSingleUser);
router.delete("/:id",protect,restrict("admin"),adminController.deleteUser);

module.exports = router;

