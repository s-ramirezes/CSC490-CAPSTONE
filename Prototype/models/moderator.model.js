"use strict";
const db = require("../models/db-conn");

function getSubjects (){
    const sql = "SELECT * FROM category";
    return db.all(sql);
}

function getMessages (convId){
    const sql = `SELECT * FROM messages
        WHERE convId= ?
        ORDER BY messageTime ASC;`;
    return db.all(sql, convId);
}

function getReceiver(userId){

}

module.exports = {
    getSubjects,
    getMessages,
    getReceiver,
};