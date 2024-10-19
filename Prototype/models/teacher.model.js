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


function getLeaderboard(catName, filterStartDate, filterEndDate) {
    let sql = `
    SELECT u.userId, u.profilePic, u.fname, u.lname, u.role, COUNT(p.postId) AS postCount
    FROM users u
    JOIN posts p ON u.userId = p.userId
    JOIN category c ON p.catId = c.catId
    WHERE c.catName = ? AND u.role != 'teacher'`;

    const params = [catName];

    if (filterStartDate || filterEndDate) {
        sql += ` AND p.postTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }

    sql += `ORDER BY postCount DESC
    LIMIT 10`;

    return db.all(sql, ...params);
}

function getAmountofPosts(catName, filterStartDate, filterEndDate) {
    let sql = `
    SELECT 
    p.courseId, 
        COUNT(p.postId) AS postCount
    FROM posts p
    JOIN category c ON p.catId = c.catId
    WHERE c.catName = ?`;

    const params = [catName];

    if (filterStartDate || filterEndDate) {
        sql += ` AND p.postTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }

    sql += ` GROUP BY p.courseId`;

    return db.all(sql, ...params);
}

function getPosts(catName, filterStartDate, filterEndDate, filterCourse, filterUser) {
    let sql = `
    SELECT p.*, u.email, u.profilePic, u.fname, u.lname, u.userId
    FROM posts p
    JOIN category c ON p.catId = c.catId
    JOIN users u ON p.userId = u.userId
    WHERE c.catName = ?`;
    
    const params = [catName];

    if (filterStartDate|| filterEndDate) {
        sql += ` AND p.postTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }
    if (filterCourse && filterCourse !== 'All' ) {
        sql += ` AND p.courseId = ?`;
        params.push(filterCourse);
    }
    if (filterUser && filterUser !== 'All') {
        sql += ` AND p.userId = ?`;
        params.push(filterUser);
    }

    return db.all(sql, ...params);
}

function getReviewLeaderboard(catName, filterStartDate, filterEndDate) {
    let sql = `
    SELECT u.userId, u.profilePic, u.fname, u.lname, u.role, COUNT(r.reviewId) AS reviewCount
    FROM users u
    JOIN reviews r ON u.userId = r.revieweeId
    WHERE r.subject = ? AND u.role != 'teacher'`;

    const params = [catName];

    if (filterStartDate || filterEndDate) {
        sql += ` AND r.reviewTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }

    sql += ` ORDER BY reviewCount DESC LIMIT 10`;

    return db.all(sql, ...params);
}

function getAmountofReviews(catName, filterStartDate, filterEndDate) {
    let sql = `
    SELECT 
        r.courseId, 
        COUNT(r.reviewId) AS reviewCount
    FROM reviews r
    WHERE r.subject = ?`;

    const params = [catName];

    if (filterStartDate || filterEndDate) {
        sql += ` AND r.reviewTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }

    sql += ` GROUP BY r.courseId`;

    return db.all(sql, ...params);
}


function getReviews(catName, filterStartDate, filterEndDate, filterCourse, filterUser){
    let sql = `
    SELECT r.*, u.email, u.profilePic, u.fname, u.lname, u.userId
    FROM reviews r
    JOIN users u ON r.revieweeId = u.userId
    WHERE r.subject = ?`;
    
    const params = [catName];

    if (filterStartDate|| filterEndDate) {
        sql += ` AND r.reviewTime BETWEEN ? AND ?`;
        params.push(filterStartDate, filterEndDate);
    }
    if (filterCourse && filterCourse !== 'All' ) {
        sql += ` AND r.courseId = ?`;
        params.push(filterCourse);
    }
    if (filterUser && filterUser !== 'All') {
        sql += ` AND r.revieweeId = ?`;
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
    getReviewLeaderboard,
    getAmountofReviews,
    getReviews
};