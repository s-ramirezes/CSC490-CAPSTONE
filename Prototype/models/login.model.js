"use strict";
const db = require("../models/db-conn");
const bcrypt = require("bcryptjs");


function createUser(email, password, fname, lname, role) {
    let sqlCheck = `SELECT * FROM Users WHERE email = ?`;
    const paramsCheck = [email];
    const userExists = db.get(sqlCheck, ...paramsCheck);

    if (userExists) {
        return 'exists';
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);


    var sql = `INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)`;
    const params = [email, hash, fname, lname, role];
    try {
        db.run(sql, params);
        return 'success'

    } catch (error) {
        console.error(error);
        return 'error';
    }
}

function getUser(email, password) {
    let sqlCheck = `SELECT * FROM Users WHERE email = ?`;
    const paramsCheck = [email];
    const userFound = db.get(sqlCheck, ...paramsCheck);

    if (!userFound) {
        return 'notFound';
    }

    const passwordCheck = bcrypt.compareSync(password, userFound.password);

    console.log("Checking user:", email);
    console.log("Password check result:", passwordCheck);


    if (passwordCheck) {
        return 'success';
    } else {
        return 'incorrectPass';
    }

}

module.exports = {
    createUser,
    getUser
};