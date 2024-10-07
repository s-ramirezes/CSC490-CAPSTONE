"use strict";
const db = require("../models/db-conn");
const { get } = require("../routes/moderator.route");

function getPosts() {
    const sql = "SELECT * FROM posts";
    return db.all(sql);
}
// edited
function getSubjectPosts(catId) {
    const sql = `
        SELECT posts.*, users.email, users.profilePic, users.fname, users.lname 
        FROM posts
        JOIN users ON posts.userId = users.userId
        WHERE posts.catId = ?;
    `;
    return db.all(sql, catId);
}

function getAllSubjects(){
    const sql = 'SELECT * FROM category';
    return db.all(sql);
}

function getUserPost(userId) {
    const sql = `
        SELECT p.*, c.catAbbr 
        FROM posts p 
        JOIN category c ON p.catId = c.catId 
        WHERE p.userId = ?`;
    return db.all(sql, userId);
}

function searchUser(excludeUserId, email) {
    const sql = "SELECT * FROM users WHERE userId != ? AND verified = 1 AND email LIKE ?";
    const params = [excludeUserId, `${email}%`];
    return db.all(sql, ...params); 
}

function getUser(userId) {
    const sql = "SELECT * FROM users WHERE userId = ?";
    return db.get(sql, userId);
}

function getAllUsers(excludeUserId) {
    const sql = "SELECT * FROM users WHERE userId != ? AND verified = 1";
    return db.all(sql, excludeUserId);
}

function likePost(userId, postId) {
    let likeCheck = `SELECT * FROM likes WHERE userId = ? AND postId = ?`;
    const params = [userId, postId];
    const exists = db.get(likeCheck, ...params);

    if (exists) {
        const dSql = `DELETE FROM likes WHERE userId = ? AND postId = ?`;
        const upSql = `UPDATE posts SET likeCount = likeCount - 1 WHERE postId = ?`;
        db.run(upSql, [postId]);
        return db.run(dSql, params);
    } else {
        const iSql = `INSERT INTO likes (userId, postId) VALUES (?, ?);`;
        const upSql = `UPDATE posts SET likeCount = likeCount + 1 WHERE postId = ?`;
        db.run(upSql, [postId]);
        return db.run(iSql, params);
    }
}

function isPostLiked(userId, postId) {
    const sql = `SELECT * FROM likes WHERE userId = ? AND postId = ?`;
    const params = [userId, postId];
    const like = db.get(sql, ...params);
    return like !== undefined;
}

function createPost(catId, userId, title, description, courseId) {
    const sql = 'INSERT INTO posts (catId, userId, title, description, courseId) VALUES (?, ?, ?, ?, ?)';
    const params = [catId, userId, title, description, courseId];
    return db.run(sql, params);
}

function getResourcesforCategory(catId) {
    const sql = "SELECT * FROM resources WHERE catId = ?";
    return db.all(sql, catId);
}

function deletePost(postId) {
    const sql = 'DELETE FROM posts where postId = ?';
    const params = [postId];
    return db.run(sql, params);
}

function createReply(userId, catId, postId, description) {
    const sql = 'INSERT INTO replies (userId, catId, postId, description) VALUES (?, ?, ?, ?)';
    const params = [userId, catId, postId, description];
    return db.run(sql, params);
}

function getRepliesforPost(postId) {
    const sql = `
        SELECT replies.*, users.email
        FROM replies
        JOIN users ON replies.userId = users.userId
        WHERE replies.postId = ?;
    `;
    return db.all(sql, postId);
}

function deleteReply(replyId) {
    const sql = 'DELETE FROM replies where replyId = ?';
    const params = [replyId];
    return db.run(sql, params);
}

function getConversations(userId) {
    const sql = `
        SELECT 
            c.convId,
            CASE 
                WHEN c.userId1 = ? THEN c.userId2 
                ELSE c.userId1 
            END AS otherUserId,
            COUNT(ms.isRead) AS unreadCount
        FROM conversation c
        LEFT JOIN messages m ON m.convId = c.convId
        LEFT JOIN messageStatus ms ON ms.messageId = m.messageId AND ms.userId = ? AND ms.isRead = 0
        WHERE (c.userId1 = ? OR c.userId2 = ?)
        GROUP BY c.convId;
    `;
    const params = [userId, userId, userId, userId];
    return db.all(sql, ...params);
}
/* check for existing conversation first and ultimately should send back a convId */
function createConv(userId1, userId2) {
    const checkSql = ` SELECT convId FROM conversation WHERE (userId1 = ? AND userId2 = ?) OR (userId1 = ? AND userId2 = ?) `;
    const checkParams = [userId1, userId2, userId2, userId1];
    const existingConv = db.get(checkSql, ...checkParams);

    if (existingConv) {
        return existingConv.convId;
    } else {
        const insertSql = 'INSERT INTO conversation (userId1, userId2) VALUES (?, ?)';
        const insertParams = [userId1, userId2];
        db.run(insertSql, insertParams);
        const newConv = db.get('SELECT last_insert_rowid() AS Id')
        return newConv.Id;
    }
}

function updateProfilePic(fileName, userId) {
    const sql = 'UPDATE users SET profilePic = ? WHERE userId = ?';
    const params = [fileName, userId];
    return db.run(sql, params);
}

function postReview(reviewerId, revieweeId, title, description, rating, recommended){
    const sql = 'INSERT INTO reviews (reviewerId, revieweeId, title, description, rating, recommended) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [reviewerId, revieweeId, title, description, rating, recommended];
    return db.run(sql, params);
}

function getReviews(userId){
    const sql = `
    SELECT * FROM reviews 
    JOIN users ON reviews.reviewerId = users.userId
    WHERE revieweeId = ?`;
    return db.all(sql, userId);
}

function getAverageRating(userId){
    const sql = `
    SELECT AVG(rating) FROM reviews WHERE revieweeId = ?`;
    return db.get(sql, userId);
}

function getCommentCount(postId){
    const sql = `
    SELECT COUNT(*) FROM replies WHERE postId = ?`;
    return db.get(sql, postId);
}

function getCategory(catId){
    const sql = `
    SELECT * FROM category WHERE catId = ?`;
    return db.get(sql, catId);
}

function flagPost(postId){
    const sql = `
    UPDATE posts SET flagged = 1 WHERE postId = ?`;
    return db.run(sql, postId);
}

function editPost(postId, title, courseId, description){
    const sql = 'UPDATE posts set title = ?, courseId = ?, description = ? WHERE postId = ?';
    const params = [title, courseId, description, postId]; 
    return db.run(sql, params);
}

function editReply(replyId, description){
    const sql = 'UPDATE replies set description = ? WHERE replyId = ?';
    const params = [description, replyId]; 
    return db.run(sql, params);
}

// function getUnreadMessages(convId, userId) {
//     const sql = `
//         SELECT m.messageId, m.description, ms.isRead
//         FROM messageStatus ms
//         JOIN messages m ON ms.messageId = m.messageId
//         WHERE m.convId = ? AND ms.isRead = 0 AND ms.userId = ?;
//     `;
//     return db.all(sql, convId, userId);
// }

module.exports = {
    getPosts,
    getSubjectPosts,
    getAllSubjects,
    getUserPost,
    searchUser,
    getUser,
    getAllUsers,
    likePost,
    isPostLiked,
    createPost,
    getResourcesforCategory,
    deletePost,
    createReply,
    getRepliesforPost,
    deleteReply,
    getConversations,
    createConv,
    updateProfilePic,
    postReview,
    getReviews,
    getAverageRating,
    getCommentCount,
    getCategory,
    flagPost,
    editPost,
    editReply,
};