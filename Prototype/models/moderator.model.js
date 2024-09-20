"use strict";
const db = require("../models/db-conn");
function getSubjects (){
    const sql = "SELECT * FROM category";
    return db.all(sql);
}

function getMessages (convId){
    const sql = `SELECT messageId AS id, description, userId, messageTime, 'message' AS source, NULL AS name, NULL AS location, NULL AS startDate, NULL AS endDate, NULL AS startTime, NULL AS endTime
        FROM messages
        WHERE convId = ?
        UNION ALL
        SELECT calendarId AS id, NULL AS description, userId, messageTime, 'calendar' AS source, name, location, startDate, endDate, startTime, endTime
        FROM calendar
        WHERE convId = ?
        ORDER BY messageTime ASC;`;
    return db.all(sql, convId, convId);
}

function getReceiver(userId){
    const sql = `SELECT u.fName, u.lname, u.userId FROM conversation c
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

function storeCalendar(convId, userId, name, location, 
    startDate, endDate, startTime, endTime) {
    console.log(convId, userId, name, location, startDate, endDate, startTime, endTime);
    const sql = `INSERT INTO calendar (convId, userId, 
        name, location, startDate, endDate, startTime, 
        endTime)
        VALUES (?,?,?,?,?,?,?,?);`;
    return db.run(sql, [convId, userId, name, location, startDate, endDate, startTime, endTime]);
}

function getFlaggedUsers (){
    const sql = `SELECT * FROM users
        WHERE flagged =1; `;
    return db.all(sql);
}

function getAllUsers(){
    const sql = `SELECT * FROM users;`;
    return db.all(sql);
}

function addMessageStatus(messageId, userId) {
    const sql = `INSERT INTO messageStatus (messageId, userId)
        VALUES (?,?);`;
    return db.run(sql, [messageId, userId]);
}

function getLastRowId() {
    return db.get("SELECT last_insert_rowid() as id");
}

module.exports = {
    getSubjects,
    getMessages,
    getReceiver,
    storeMessage,
    storeCalendar,
    getFlaggedUsers,
    getAllUsers,

    addMessageStatus,
    getLastRowId,
};