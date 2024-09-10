"use strict";

const express = require("express");
const app = express();
// const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/moderator.model");

function homePage (req,res) {
    try {
        const subjects = model.getSubjects();
        req.session.subjects = subjects;
        const role= 'moderator';
        res.render ("modHome", {subjects : subjects, role: role});
    } catch (err) {
        console.error("Failed to render modHome page: "+ err.message);
    }
}



module.exports = {
    homePage,
};