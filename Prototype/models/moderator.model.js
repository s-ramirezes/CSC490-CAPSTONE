"use strict";
const db = require("../models/db-conn");
const { getUserPost } = require("./user.model");
function getSubjects (){
    const sql = "SELECT * FROM category ORDER BY catAbbr ASC";
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

function getReceiver(userId, convId){
    const sql = `SELECT u.fName, u.lname, u.userId, u.profilePic FROM conversation c
        JOIN users u
        ON u.userId = 
            CASE 
            WHEN c.userId1 = ? THEN c.userId2
            ELSE c.userId1
            END
        WHERE (c.userId1 = ? OR c.userId2 = ?)
        AND convId= ?;`;
    return db.get(sql, userId, userId, userId, convId);
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

function markMessagesAsRead(convId, userId) {
    const sql = `
        UPDATE messageStatus
        SET isRead = 1
        WHERE messageId IN (
            SELECT m.messageId
            FROM messages m
            WHERE m.convId = ?
        ) AND userId = ? AND isRead = 0
    `;
    return db.run(sql, [convId, userId]);
}

function getLastRowId() {
    return db.get("SELECT last_insert_rowid() as id");
}

function  unflagUser(userId) {
    const sql = `UPDATE users
        SET flagged = 0
        WHERE userId= ?;`;
    return db.run(sql, [userId]);
}

function banUser(userId) {
    const sql = `UPDATE users 
        SET flagged = 0, banned= 1
        WHERE userId= ?;`;
    return db.run(sql, [userId]);
}

function  flagUser(userId) {
    const sql = `UPDATE users
        SET flagged = 1
        WHERE userId= ?;`;
    return db.run(sql, [userId]);
}

function getUser(userId){
    const sql = `SELECT * FROM users
    WHERE userId= ?;`;
    return db.get(sql, userId);
}

function getUserPosts(userId){
    const sql = `SELECT * FROM posts
    WHERE userId=?;`;
    return db.all(sql, userId);
}

function getUserReplies(userId){
    const sql = `SELECT * FROM replies
    WHERE userId=?;`;
    return db.all(sql, userId);
}
function getFlaggedPosts (){
    const sql = `SELECT * FROM posts
        WHERE flagged =1; `;
    return db.all(sql);
}
function getAllPosts(){
    const sql = `SELECT * FROM posts;`;
    return db.all(sql);
}
function  unflagPost(postId) {
    const sql = `UPDATE posts
        SET flagged = 0
        WHERE postId= ?;`;
    return db.run(sql, [postId]);
}
function  deletePost(postId) {
    const sql = `DELETE FROM posts
        WHERE postId= ?;`;
    return db.run(sql, [postId]);
}
function getTutors (){
    const sql = `SELECT * FROM users
        WHERE role ='tutor'; `;
    return db.all(sql);
}
function getReviews (){
    const sql = `SELECT * FROM reviews`;
    return db.all(sql);
}
function  addTutor(userId) {
    const sql = `UPDATE users
        SET role = 'tutor'
        WHERE userId= ?;`;
    return db.run(sql, [userId]);
}
function  removeTutor(userId) {
    const sql = `UPDATE users
        SET role = 'student'
        WHERE userId= ?;`;
    return db.run(sql, [userId]);
}
function isModRole(role){
    if (role === 'moderator'){
        return true;
    } else {
        return false;
    }
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
    markMessagesAsRead,
    getLastRowId,
    unflagUser,
    banUser,
    flagUser,
    getUser,
    getUserPosts,
    getUserReplies,
    getFlaggedPosts,
    getAllPosts,
    unflagPost,
    deletePost,
    getTutors,
    getReviews,
    addTutor,
    removeTutor,
    isModRole,
};