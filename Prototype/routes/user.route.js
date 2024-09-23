"use strict";
const express = require("express");
const router = express.Router();
const multer = require("multer");


const userController = require("../controllers/user.controller");

module.exports = function (imageUpload) {
    router.get("/feed", userController.feedPage);
    router.get("/home", userController.homePage);
    router.get("/account/:userId", userController.accountPage);
    router.get("/category/:catId", userController.feedPage);
    router.get("/download/:fileName", userController.downloadResource);
    router.get("/getMessagePage", userController.getMessagePage);
    router.get("/message", userController.messagePage);

    router.post("/updateProfilePic", imageUpload.single("file"), userController.updateProfilePic);
    router.post("/like", userController.likePost);
    router.post("/post", userController.post);
    router.post("/deletePost", userController.deletePost);
    router.post("/reply", userController.reply);
    router.post("/deleteReply", userController.deleteReply);
    router.post("/createConv", userController.createConv);
    
    return router; 
}