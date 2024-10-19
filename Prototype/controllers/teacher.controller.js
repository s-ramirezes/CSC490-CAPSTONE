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
        res.redirect(req.get('referer'));
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
        res.redirect(req.get('referer'));
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

function getAnalytics(req, res) {
    try {
        const userId = req.session.userId;
        const catName = req.session.subject;

        const filterStartDate = req.query.startDate;
        const filterEndDate = req.query.endDate;
        const filterCourse = req.query.courseId;
        const filterUser = req.query.userId;

        // for reviews
        const reviewLeaderboard = model.getReviewLeaderboard(catName, filterStartDate, filterEndDate);
        const reviewCount = model.getAmountofReviews(catName, filterStartDate, filterEndDate);
        const reviews = model.getReviews(catName, filterStartDate, filterEndDate, filterCourse, filterUser);

        // for posts
        const leaderboard = model.getLeaderboard(catName, filterStartDate, filterEndDate);
        const postCount = model.getAmountofPosts(catName, filterStartDate, filterEndDate);
        const posts = model.getPosts(catName, filterStartDate, filterEndDate, filterCourse, filterUser);

        res.render("teacherAnalytics", { leaderboard, postCount, posts, reviewLeaderboard, reviewCount, reviews });
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