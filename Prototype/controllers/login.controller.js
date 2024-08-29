"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/login.model");

function loginPage(req, res) {
    try {
        // const error = null;
        res.render("login");
    } catch (err) {
        // console.error("Error while rendering login page: " + err.message);
    }
}

module.exports = {
    loginPage,
};