"use strict";

const db = require("../models/db-conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secretkey = "secretkey";

function createUser(email, password, fname, lname, role) {
    let sqlCheck = "SELECT * FROM Users WHERE email = ?";
    const paramsCheck = [email];
    const userExists = db.get(sqlCheck, ...paramsCheck);

    if (userExists) {
        return "exists";
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const sql = "INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)";
    const params = [email, hash, fname, lname, role];
    try {
        db.run(sql, params);

        // Email verification
        const token = jwt.sign({ email: email }, secretkey, { expiresIn: "1d" });
        const url = `http://localhost:8000/verify?token=${token}`;


        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                //add an email
                user: "spartanaid991@gmail.com",
                pass: "zycizijlowoqwodc",
            },
        });

        transporter.sendMail({
            to: email,
            subject: "Spartan-Aid email verification",
            html: `Click the link to verify: <a href="${url}">${url}</a>`,
        });
        

        return "success";
    } catch (error) {
        console.error(error);
        return "error";
    }
}

//for email verification/login
function getUser(email, password) {
    let sqlCheck = "SELECT * FROM Users WHERE email = ?";
    const paramsCheck = [email];
    const userFound = db.get(sqlCheck, ...paramsCheck);

    if (!userFound) {
        return "notFound";
    }

    if (userFound.verified == 0) {
        console.log("Email not verified");
        return "notVerified";
    }

    const passwordCheck = bcrypt.compareSync(password, userFound.password);

    console.log("Checking user:", email);
    console.log("Password check result:", passwordCheck);

    if (passwordCheck) {
        return "success";
    } else {
        return "incorrectPass";
    }
}

function isVerified(token) {
    try {
        const decode = jwt.verify(token, secretkey);
        const email = decode.email;

        db.run("UPDATE users SET verified = 1 WHERE email = ?", [email]);

        return "verified";
    } catch (err) {
        console.error("Error during token verification:", err.message);
        return "notVerified";
    }
}

//for session auth
function getUserEmail(email) {
    let sql = `SELECT * FROM Users WHERE email = ?`;
    const params = [email];
    return db.get(sql, ...params);
}

module.exports = {
    createUser,
    getUser,
    getUserEmail,
    isVerified
};
