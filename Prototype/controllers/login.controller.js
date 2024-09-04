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

function Signup(req, res) {
    try {
        // const error = null;
        res.render("signup");
    } catch (err) {
        // console.error("Error while rendering login page: " + err.message);
    }
}

function createUser(req, res, next) {
    try {
        const result = model.createUser(req.body.email, req.body.password, req.body.fname, req.body.lname, req.body.role);
        if (result === 'success') {
            res.redirect('/');
        } else if (result === 'exists') {
            res.render('signup', { error: 'Email already exists' });
        } else {
            res.render('signup', { error: 'Failed to create user' });
        }
    } catch (err) {
        console.error("Error while creating user ", err.message);
        next(err);
    }
}

module.exports = {
    loginPage,
    Signup,
    createUser
};