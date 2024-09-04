"use strict";
const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login.controller");

router.get("/", loginController.loginPage);
router.get("/signup", loginController.Signup);

router.post("/signupinfo", loginController.createUser)

module.exports = router; 