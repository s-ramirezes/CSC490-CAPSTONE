"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/feed", userController.feedPage);
router.get("/account", userController.accountPage);
router.get("/category/:catId", userController.feedPage);
router.get("/download/:fileName", userController.downloadResource);

router.post("/like", userController.likePost);
router.post("/post", userController.post);
router.post("/deletePost", userController.deletePost);

module.exports = router; 