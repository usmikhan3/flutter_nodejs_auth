const userController = require("../controllers/user.controller")

const express = require("express");

const router = express.Router();

router.post("/register",userController.register);

router.post("/login",userController.login);
router.post("/otplogin",userController.otpLogin);
router.post("/verifyOTP",userController.verifyOTP);

router.get("/user-profile",userController.userProfile);




module.exports = router;