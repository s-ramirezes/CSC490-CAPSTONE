"use strict";
const db = require("../models/db-conn");

function getPosts() {
    const sql = "SELECT * FROM posts";
    return db.all(sql);
}

function getSubjectPosts(catId) {
    const sql = `
        SELECT posts.*, users.email
        FROM posts
        JOIN users ON posts.userId = users.userId
        WHERE posts.catId = ?;
    `;
    return db.all(sql, catId);
}

function getUserPost(userId) {
    const sql = `
        SELECT p.*, c.catAbbr 
        FROM posts p 
        JOIN category c ON p.catId = c.catId 
        WHERE p.userId = ?`;
    return db.all(sql, userId);
}

function getUser(userId) {
    const sql = "SELECT * FROM users WHERE userId = ?";
    return db.get(sql, userId);
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

function createPost(catId, userId, title, description){
    const sql = 'INSERT INTO posts (catId, userId, title, description) VALUES (?, ?, ?, ?)';
    const params = [catId, userId, title, description];
    return db.run(sql, params);
}

function getResourcesforCategory(catId) {
    const sql = "SELECT * FROM resources WHERE catId = ?";
    return db.all(sql, catId);
}

function deletePost(postId){
    const sql = 'DELETE FROM posts where postId = ?';
    const params = [postId];
    return db.run(sql, params);
}

function createReply(userId, catId, postId, description){
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

function deleteReply(replyId){
    const sql = 'DELETE FROM replies where replyId = ?';
    const params = [replyId];
    return db.run(sql, params);
}

module.exports = {
    getPosts,
    getSubjectPosts,
    getUserPost,
    getUser,
    likePost,
    isPostLiked,
    createPost,
    getResourcesforCategory,
    deletePost,
    createReply,
    getRepliesforPost,
    deleteReply,
};