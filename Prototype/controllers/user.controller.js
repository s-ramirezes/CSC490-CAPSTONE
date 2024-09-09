"use strict";

const express = require("express");
const app = express();
// const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/user.model");

function feedPage(req, res) {
    try {
        // const error = null;
        const subjects = model.getSubjects();
        req.session.subjects = subjects;
        const role = 'student';
        // const role = 'teacher';
        // const role = 'moderator';
        // const role = 'tutor';

        res.render("feed", {subjects: subjects, role: role});
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

function accountPage(req, res) {
    try {
        // const error = null;
        // const subjects = model.getSubjects();
        const role = 'student';
        // const role = 'teacher';
        // const role = 'moderator';
        // const role = 'tutor';

        res.render("account", {subjects: req.session.subjects, role: role});
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

module.exports = {
    feedPage,
    accountPage,
};