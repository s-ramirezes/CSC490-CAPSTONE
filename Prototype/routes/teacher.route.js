"use strict";
const express = require("express");
const multer = require("multer");
const router = express.Router();

const teacherController = require("../controllers/teacher.controller");

const { isTeacher } = require("./setSessionData");

module.exports = function (fileUpload) {

    router.post("/upload", isTeacher, fileUpload.single("file"), teacherController.upload);
    router.post("/deleteResource", isTeacher, teacherController.deleteResource);
    router.post("/promoteToTutor", isTeacher, teacherController.promoteToTutor);
    router.post("/addCertification", isTeacher, teacherController.addCertification);
    router.post("/demoteToStudent", isTeacher, teacherController.demoteToStudent);

    router.get("/resources", isTeacher, teacherController.teacherResourcePage);
    router.get("/analytics", isTeacher, teacherController.getAnalytics);

    return router; 
}