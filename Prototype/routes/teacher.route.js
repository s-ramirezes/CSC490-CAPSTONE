"use strict";
const express = require("express");
const multer = require("multer");
const router = express.Router();

const teacherController = require("../controllers/teacher.controller");

const { setSessionData, isLoggedIn } = require("./setSessionData");

module.exports = function (fileUpload) {
    

    router.post("/upload", fileUpload.single("file"), teacherController.upload);
    router.post("/deleteResource", teacherController.deleteResource);
    router.post("/promoteToTutor", teacherController.promoteToTutor);

    router.get("/resources", teacherController.teacherResourcePage);
    router.get("/analytics", teacherController.getAnalytics);



    return router; 
}