"use strict";
const db = require("../models/db-conn");

function getSubjects (){
    const sql = "SELECT * FROM category";
    return db.all(sql);
}

module.exports = {
    getSubjects,
    
};