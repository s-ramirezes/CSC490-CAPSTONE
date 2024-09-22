"use strict";
const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login.controller");

router.get("/", loginController.loginPage);
router.get("/signup", loginController.Signup);
router.get("/verify", loginController.verifyUser);
router.get("/logout", loginController.logout);
router.get("/forgotPage", loginController.forgotPage);


router.post("/login", loginController.loginUser);
router.post("/signupinfo", loginController.createUser);
router.post("/forgot", loginController.forgot);
router.post("/resetPassword", loginController.resetPassword);

module.exports = router; 