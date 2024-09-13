"use strict";

const express = require("express");
const app = express();
const path = require('path')
const fs = require("fs");
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/teacher.model");



function upload(req, res) {
    try {
        const fileName = req.file.filename;
        const userId = req.session.userId;
        const catId = req.body.catId;
        const title = req.body.title;
        const url = req.body.url;
        model.uploadResource(userId, catId, title, fileName, url);
        res.redirect("/category/" + catId);
        // const result = model.upload(req.file, req.body);
        // if (result === "success") {
        //     res.redirect("/teacher/upload");
        // } else {
        //     res.redirect("/teacher/upload");
        // }
    } catch (err) {
        console.error("Error while uploading file: " + err.message);
    }
}

function deleteResource(req, res) {
    try {
        const resourceId = req.body.resourceId;
        const catId = req.body.catId;
        const filePath = path.join(__dirname, "../uploads/" + req.body.fileName);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error while deleting file: " + err.message);
            }
        });

        model.deleteResource(resourceId);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while deleting resource: " + err.message);
    }
}


module.exports = {
    upload,
    deleteResource,
};