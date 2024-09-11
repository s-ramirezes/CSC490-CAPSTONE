"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/feed", userController.feedPage);
router.get("/account", userController.accountPage);
router.get("/category/:catAbbr", userController.feedPage);
router.post("/like", userController.likePost);

router.post("/post", userController.post);


module.exports = router; 