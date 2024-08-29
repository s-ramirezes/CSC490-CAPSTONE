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
        res.render("feed");
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}


module.exports = {
    feedPage,
    
};