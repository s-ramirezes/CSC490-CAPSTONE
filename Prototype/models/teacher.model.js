"use strict";
const db = require("../models/db-conn");

function uploadResource(userId, catId, title, fileName, url) {
    const sql = 'INSERT INTO resources (userId, catId, title, fileName, url) VALUES (?, ?, ?, ?, ?)';
    const params = [userId, catId, title, fileName, url];
    return db.run(sql, params);
}

module.exports = {
    uploadResource,
};