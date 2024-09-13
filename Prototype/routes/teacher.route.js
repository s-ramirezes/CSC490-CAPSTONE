"use strict";
const express = require("express");
const multer = require("multer");
const router = express.Router();

const teacherController = require("../controllers/teacher.controller");


module.exports = function (fileUpload) {
    

    router.post("/upload", fileUpload.single("file"), teacherController.upload);
    router.post("/deleteResource", teacherController.deleteResource);


    return router; 
}