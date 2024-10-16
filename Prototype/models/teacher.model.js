"use strict";
const db = require("../models/db-conn");

function uploadResource(userId, catId, title, fileName, url) {
    const sql = 'INSERT INTO resources (userId, catId, title, fileName, url) VALUES (?, ?, ?, ?, ?)';
    const params = [userId, catId, title, fileName, url];
    return db.run(sql, params);
}

function deleteResource(resourceId) {
    const sql = 'DELETE FROM resources WHERE resourceId = ?';
    const params = [resourceId];
    return db.run(sql, params);
}

function getTeacherResources(userId) {
    const sql = `
    SELECT r.*, c.catAbbr 
    FROM resources r
    JOIN category c ON r.catId = c.catId
    WHERE r.userId = ?`;
    return db.all(sql, userId);
}

function promoteToTutor(userId) {
    const sql = "UPDATE users SET role = 'tutor' WHERE userId = ?";
    return db.run(sql, userId);
}


function getLeaderboard(catName) {
    const sql = `
    SELECT u.userId, u.profilePic, u.fname, u.lname, u.role, COUNT(p.postId) AS postCount
    FROM users u
    JOIN posts p ON u.userId = p.userId
    JOIN category c ON p.catId = c.catId
    WHERE c.catName = ? AND u.role != 'teacher'
    ORDER BY postCount DESC
    LIMIT 10`;
    return db.all(sql, ...[catName]);
}

function getAmountofPosts(catName) {
    const sql = `
    SELECT 
    p.courseId, 
        COUNT(p.postId) AS postCount
    FROM posts p
    JOIN category c ON p.catId = c.catId
    WHERE c.catName = ?
    GROUP BY p.courseId`;
    return db.all(sql, ...[catName]);
}

function getPosts(catName, filterDate, filterCourse, filterUser) {
    let sql = `
    SELECT p.*, u.email, u.profilePic, u.fname, u.lname
    FROM posts p
    JOIN category c ON p.catId = c.catId
    JOIN users u ON p.userId = u.userId
    WHERE c.catName = ?`;
    
    const params = [catName];

    if (filterDate) {
        sql += ` AND p.date = ?`;
        params.push(filterDate);
    }
    if (filterCourse) {
        sql += ` AND p.courseId = ?`;
        params.push(filterCourse);
    }
    if (filterUser) {
        sql += ` AND p.userId = ?`;
        params.push(filterUser);
    }

    return db.all(sql, ...params);
}


module.exports = {
    uploadResource,
    deleteResource,
    getTeacherResources,
    promoteToTutor,
    getLeaderboard,
    getAmountofPosts,
    getPosts,
};