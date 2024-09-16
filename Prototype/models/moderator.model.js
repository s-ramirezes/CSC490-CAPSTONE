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
    const sql = `SELECT u.fName, u.lname FROM conversation c
        JOIN users u
        ON u.userId = 
            CASE 
            WHEN c.userId1 = ? THEN c.userId2
            ELSE c.userId1
            END
        WHERE c.userId1 = ? OR c.userId2 = ?;`;
    return db.get(sql, userId, userId, userId);
}

function storeMessage(convId, messageTxt, userId) {
    console.log(convId, messageTxt, userId);
    const sql = `INSERT INTO messages (convId, description, userId)
        VALUES (?,?,?);`;
    return db.run(sql, [convId, messageTxt, userId]);
}

module.exports = {
    getSubjects,
    getMessages,
    getReceiver,
    storeMessage,

};