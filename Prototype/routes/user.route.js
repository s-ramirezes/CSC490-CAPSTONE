"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/feed", userController.feedPage);
router.get("/account", userController.accountPage);


module.exports = router; 