"use strict";
const express = require("express");
const router = express.Router();
const multer = require("multer");

const { setSessionData, isLoggedIn } = require("./setSessionData");

const userController = require("../controllers/user.controller");

module.exports = function (imageUpload) {
    router.get("/feed", userController.feedPage);
    router.get("/home", userController.homePage);
    router.get("/account/:userId", userController.accountPage);
    router.get("/category/:catId", userController.feedPage);
    router.get("/download/:fileName", userController.downloadResource);
    router.get("/getMessagePage", userController.getMessagePage);
    router.get("/message", userController.messagePage);
    router.get("/filterPosts", userController.filterPosts);

    router.post("/updateProfilePic", imageUpload.single("file"), userController.updateProfilePic);
    router.post("/like", userController.likePost);
    router.post("/post", userController.post);
    router.post("/deleteUserPost", userController.deletePost);
    router.post("/reply", userController.reply);
    router.post("/deleteReply", userController.deleteReply);
    router.post("/createConv", userController.createConv);
    router.post("/reviewPage", userController.reviewPage);
    router.post("/makeReview", userController.makeReview);
    router.post("/searchUser", userController.searchUser);
    router.post("/flagPost", userController.flagPost);
    router.post("/editPost", userController.editPost);
    router.post("/editReply", userController.editReply);
    router.post("/searchSubject", userController.searchSubject);
    router.post("/updateBio", userController.updateBio);

    return router; 
}