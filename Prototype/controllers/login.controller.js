"use strict";

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/login.model");

function loginPage(req, res) {
    try {
        res.render("login");
    } catch (err) {
        console.error("Error while rendering login page: " + err.message);
    }
}
function logout(req, res) {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (err) {
        console.error("Error while rendering login page: " + err.message);
    }
}

function Signup(req, res) {
    try {
        const subjects = model.getSubjectNames();
        res.render("signup", {subjects});
    } catch (err) {
        console.error("Error while rendering signup page: " + err.message);
    }
}

function createUser(req, res, next) {
    try {
        const result = model.createUser(req.body.email, req.body.password, req.body.fname, req.body.lname, req.body.role, req.body.subject);
        if (result === "success") {
            res.redirect("/");
        } else if (result === "exists") {
            res.render("signup", { error: "Email already exists" });
        } else {
            res.render("signup", { error: "Failed to create user" });
        }
    } catch (err) {
        console.error("Error while creating user ", err.message);
        next(err);
    }
}

function loginUser(req, res, next) {
    try {
        const result = model.getUser(req.body.email, req.body.password);
        console.log("Login attempt for user:", req.body.email);

        if (result === "success") {
            const user = model.getUserEmail(req.body.email);
            const subjects = model.getSubjects();

            req.session.subjects = subjects;
            req.session.email = user.email;
            req.session.fname = user.fname;
            req.session.lname = user.lname;
            req.session.role = user.role;
            req.session.userId = user.userId;
            req.session.subject = user.subject;

            res.redirect("/home");
        } else if (result === "notFound") {
            res.render("login", { error: "User not found" });
        } else if (result === "notVerified") {
            res.render("login", { error: "Email not verified" });
        } else if (result === "incorrectPass") {
            res.render("login", { error: "Incorrect password" });
        } else if (result === "banned") {
            res.render("login", { error: "User is banned" });
        }
    } catch (err) {
        console.error("Error while logging in user ", err.message);
        next(err);
    }
}

function verifyUser(req, res) {
    try {
        const token = req.query.token;
        const result = model.isVerified(token);

        if (result === "verified") {
            res.render("login", { success: "User verified" });
        } else if (result === "notVerified") {
            res.render("login", { error: "User not verified" });
        } 
    } catch (err) {
        console.error("Error while verifying user ", err.message);
        res.render("login", { error: "Error while verifying" });
    }
}

function forgotPage(req, res) {
    try {
        const token = req.query.token;
        res.render("forgotPage", { token });
    } catch (err) {
        console.error("Error while rendering forgot page: " + err.message);
    }
}

function forgot(req, res){
    try {
        const result = model.sendForgot(req.body.email);
        if (result === "success") {
            res.redirect("/");
        } else if (result === "DNE") {
            res.render("login", { error: "Email does not exist" });
        } else {
            res.render("login", { error: "Failed to send email" });
        }
    } catch (err) {
        console.error("Error while sending email ", err.message);
        next(err);
    }
}

function resetPassword(req, res) {
    try {
        const token = req.body.token;
        const password = req.body.password;

        const result = model.resetPassword(password, token);

        if (result === "success") {
            res.render("login", { success: "Password reset successfully" });
        } else {
            res.render("login", { error: "Invalid token or failed to reset password" });
        }
    } catch (err) {
        console.error("Error while resetting password:", err.message);
        res.redirect("/", { error: "Error while resetting password" });
    }
}

module.exports = {
    loginPage,
    logout,
    Signup,
    createUser,
    loginUser,
    verifyUser,
    forgotPage,
    forgot,
    resetPassword,
};
