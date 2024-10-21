"use strict";

const db = require("../models/db-conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secretkey = "secretkey";

function createUser(email, password, fname, lname, role, subject) {
  let sqlCheck = "SELECT * FROM Users WHERE email = ?";
  const paramsCheck = [email];
  const userExists = db.get(sqlCheck, ...paramsCheck);

  if (userExists) {
    return "exists";
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const sql =
    "INSERT INTO users (email, password, fname, lname, role, subject) VALUES (?, ?, ?, ?, ?, ?)";

  /* add here the check for the teacher and if not in file then chnage the role to student */
  if (role === "teacher") {
    const isTeacher = "SELECT * FROM teachers WHERE email = ?";
    const teacherExists = db.get(isTeacher, ...[email]);

    if (!teacherExists) {
      role = "student";
    }
  }

  const params = [email, hash, fname, lname, role, subject];
  try {
    db.run(sql, params);

    // Email verification
    const token = jwt.sign({ email: email }, secretkey, { expiresIn: "1d" });
    const url = `http://localhost:8000/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "spartanaid991@gmail.com",
        pass: "zycizijlowoqwodc",
      },
    });

    transporter.sendMail({
      to: email,
      subject: "Spartan-Aid email verification",
      html: `Click the link to verify: <a href="${url}">${url}</a><br><br>This link expires in 1 day.`,
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

  if(userFound.banned){
    return 'banned';
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

function getSubjects() {
    const sql = "SELECT * FROM category ORDER BY catAbbr ASC";
    return db.all(sql);
}

function getSubjectNames() {
  const sql = "SELECT catName FROM category";
  return db.all(sql);
}

function sendForgot(email) {
  let sqlCheck = "SELECT * FROM Users WHERE email = ?";
  const paramsCheck = [email];
  const userExists = db.get(sqlCheck, ...paramsCheck);

  if (!userExists) {
    return "DNE";
  }
  try {
    const token = jwt.sign({ email: email }, secretkey, { expiresIn: "10m" });
    const url = `http://localhost:8000/forgotPage?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "spartanaid991@gmail.com",
        pass: "zycizijlowoqwodc",
      },
    });

    transporter.sendMail({
      to: email,
      subject: "Spartan-Aid password reset",
      html: `Click the link to reset your password: <a href="${url}">${url}</a><br><br>This link expires in 5 minutes.`,
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

function resetPassword(password, token) {
  try {
    const decode = jwt.verify(token, secretkey);
    const email = decode.email;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.run("UPDATE users SET password = ? WHERE email = ?", [hash, email]);

    return "success";
  } catch (err) {
    console.error("Error during token verification:", err.message);
    return "error";
  }
}

module.exports = {
  createUser,
  getUser,
  getUserEmail,
  isVerified,
  getSubjects,
  getSubjectNames,
  sendForgot,
  resetPassword,
};
