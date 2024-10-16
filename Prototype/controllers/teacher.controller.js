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

function teacherResourcePage(req, res) {
    try {
        const userId = req.session.userId;
        const resources = model.getTeacherResources(userId);
        res.render("teacherResources", {resources: resources});
    } catch (err) {
        console.error("Error while rendering teacher resource page: " + err.message);
    }
}

function promoteToTutor(req, res) {
    try {
        const userId = req.body.userId;
        model.promoteToTutor(userId);
        res.redirect("/home");
    } catch (err) {
        console.error("Error while promoting to tutor: " + err.message);
    }
}

function getAnalytics(req, res){
    try {
        const userId = req.session.userId;
        const catName = req.session.subject;

        const filterDate = req.params.daterange;
        const filterCourse = req.query.courseId;
        const filterUser = req.params.userId;


        const leaderboard = model.getLeaderboard(catName, filterDate);
        const postCount = model.getAmountofPosts(catName, filterDate);
        const posts = model.getPosts(catName, filterDate, filterCourse, filterUser);
        console.log(posts);
        res.render("teacherAnalytics", {leaderboard, postCount, posts});
    } catch (err) {
        console.error("Error while rendering teacher analytics page: " + err.message);
    }
}

module.exports = {
    upload,
    deleteResource,
    teacherResourcePage,
    promoteToTutor,
    getAnalytics,
};