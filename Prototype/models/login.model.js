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

module.exports = {
    createUser,
};