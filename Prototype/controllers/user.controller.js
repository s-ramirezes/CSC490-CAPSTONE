"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/user.model");
const { deserialize } = require("v8");
const { get } = require("http");

function homePage(req, res) {
    try {
        if (req.session && req.session.email) {
            const userId = req.session.userId;
            const ids = model.getConversations(userId);
            const convUsers = ids.map(id => {
                const otherUser = model.getUser(id.otherUserId);
                return {
                    convId: id.convId,
                    otherUser,
                    unreadCount: id.unreadCount
                };
            });
            res.render("home", { convUsers: convUsers });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.error("Error while rendering home page: " + err.message);
    }
}

function feedPage(req, res) {
    try {
        const userId = req.session.userId;
        const posts = model.getSubjectPosts(req.params.catId);
        const category = model.getCategory(req.params.catId);
        const resources = model.getResourcesforCategory(req.params.catId);
        const likedPosts = posts.map(post => {
            const liked = model.isPostLiked(userId, post.postId);
            const replies = model.getRepliesforPost(post.postId);
            let commentCount = model.getCommentCount(post.postId);
            commentCount = commentCount["COUNT(*)"];
            return { ...post, liked, replies, commentCount};
        });
        const ids = model.getConversations(userId);
        const convUsers = ids.map(id => {
            const otherUser = model.getUser(id.otherUserId);
            return {
                convId: id.convId,
                otherUser,
                unreadCount: id.unreadCount
            };
        });
        res.render("feed", {
            posts: likedPosts,
            catId: req.params.catId,
            category: category,
            resources: resources,
            convUsers: convUsers,
            catName: category.catName
        });
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

function reviewPage(req, res) {
    try {
        const revieweeId = req.body.userId2;
        const convId = req.body.convId;
        res.render("reviewPage", {
            revieweeId: revieweeId,
            convId: convId,
        });
    } catch (err) {
        console.error("Error while rendering review page: " + err);
    }
}

function makeReview(req, res) {
    try {
        const reviewerId = req.session.userId;
        const revieweeId = req.body.revieweeId;
        const title = req.body.title;
        const description = req.body.description;
        const rating = req.body.rating;
        const recommended = req.body.recommended;
        const review = model.postReview(reviewerId, revieweeId, title, description, rating, recommended);
        const convId = req.body.convId;
        res.redirect("/modMessages?convId=" + convId);
    } catch (err) {
        console.error("Error while posting review: " + err);
    }
}

function messagePage(req, res) {
    try {
        const userId = req.session.userId;
        const users = model.getAllUsers(userId);
        const subjects = model.getAllSubjects();

        const ids = model.getConversations(userId);
        const convUsers = ids.map(id => {
            const otherUser = model.getUser(id.otherUserId);
            return {
                convId: id.convId,
                otherUser,
                unreadCount: id.unreadCount
            };
        });

        res.render("message", { users: users, subjects: subjects, convUsers: convUsers});
    } catch (err) {
        console.error("Error while rendering message page: " + err.message);
    }
}

function searchUser(req, res){
    try{
        const userId = req.session.userId;
        const email = req.body.email;
        const users = model.searchUser(userId, email);
        const subjects = model.getAllSubjects();
        const ids = model.getConversations(userId);
        const convUsers = ids.map(id => {
            const otherUser = model.getUser(id.otherUserId);
            return {
                convId: id.convId,
                otherUser,
                unreadCount: id.unreadCount
            };
        });
        res.render("message", { users: users, subjects: subjects, convUsers: convUsers});
    } catch(err){
        console.error("Error while rendering message page: " + err.message);
    }
}

function accountPage(req, res) {
    try {
        const userId = req.params.userId;
        const user = model.getUser(userId);
        const userPosts = model.getUserPost(userId);
        const likedPosts = userPosts.map(post => {
            const liked = model.isPostLiked(req.session.userId, post.postId);
            let commentCount = model.getCommentCount(post.postId);
            commentCount = commentCount["COUNT(*)"];
            return { ...post, liked, commentCount };
        });
        const reviews = model.getReviews(userId);
        let averageRating = model.getAverageRating(userId);
        averageRating = averageRating["AVG(rating)"];


        res.render("account", { user: user, userPosts: likedPosts, reviews: reviews, averageRating: averageRating });
    } catch (err) {
        console.error("Error while rendering feed page: " + err.message);
    }
}

function likePost(req, res) {
    try {
        const userId = req.session.userId;
        const postId = req.body.postId;
        model.likePost(userId, postId);

    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

function post(req, res) {
    try {
        const userId = req.session.userId;
        const title = req.body.title;
        const courseId = req.body.courseId;
        const description = req.body.description;
        const catId = req.body.catId;
        model.createPost(catId, userId, title, description, courseId);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while rendering feed page: " + err.message);
    }
}

function downloadResource(req, res) {
    try {
        const fileName = req.params.fileName;
        const file = path.join(__dirname, "../uploads", fileName);
        res.download(file);
    } catch (err) {
        console.error("Error while downloading file: " + err.message);
    }
}

function deletePost(req, res) {
    try {
        const postId = req.body.postId;
        const catId = req.body.catId;
        model.deletePost(postId);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while deleting post" + err.message);
    }
}

function reply(req, res) {
    try {
        const userId = req.session.userId;
        const catId = req.body.catId;
        const postId = req.body.postId;
        const description = req.body.description;

        model.createReply(userId, catId, postId, description);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while rendering feed page: " + err.message);
    }
}

function deleteReply(req, res) {
    try {
        const replyId = req.body.replyId;
        const catId = req.body.catId;
        model.deleteReply(replyId);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while deleting post" + err.message);
    }
}

function createConv(req, res) {
    try {
        const userId1 = req.session.userId;
        const userId2 = req.body.userId2;
        const convId = model.createConv(userId1, userId2);
        res.redirect("/modMessages?convId=" + convId);
    } catch (err) {
        console.error("Error while creating conversation" + err.message);
    }
}

function getMessagePage(req, res) {
    try {
        const convId = req.query.convId;
        res.redirect("/modMessages?convId=" + convId);
    } catch (err) {
        console.error("Error while getting message page:  " + err.message);
    }
}

function updateProfilePic(req, res) {
    try {
        const userId = req.session.userId;
        const fileName = req.file.filename;
        model.updateProfilePic(fileName, userId);
        res.redirect("/account/" + userId);
    }
    catch (err) {
        console.error("Error while updating profile pic:  " + err.message);
    }
}

function flagPost(req, res) {
    try {
        const postId = req.body.postId;
        console.log(postId);
        const catId = req.body.catId;
        model.flagPost(postId);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while flagging post:  " + err.message);
    }
}

function editPost(req, res) {
    try {
        const postId = req.body.postId;
        console.log(postId);
        const title = req.body.editTitle;
        const courseId = req.body.editCourseId;
        const description = req.body.editDescription;
        const catId = req.body.catId;
        model.editPost(postId, title, courseId, description);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while editing post:  " + err.message);
    }
}

function editReply(req, res) {
    try {
        const replyId = req.body.replyId;
        const description = req.body.editDescription;
        const catId = req.body.catId;
        model.editReply(replyId, description);
        res.redirect("/category/" + catId);
    } catch (err) {
        console.error("Error while editing reply:  " + err.message);
    }
}

// date still needed
// function filterPosts(req, res){
//     try{
//         const filteredcatId = req.body.catId;
//         const filtereduserId = req.body.userId;
//         const filteredcourseId = req.body.courseId;
//         const filteredtitle = req.body.title;
//         const Posts = model.filterPosts(filteredcatId, filtereduserId, filteredcourseId, filteredtitle);
//         res.redirect("/category/" + catId, {filteredPosts});
//     } catch (err) {
//         console.error("Error while filtering posts:  " + err.message);
//     }
// }

function filterPosts(req, res) {
    try {
        const userId = req.session.userId;
        const filteredcatId = req.query.catId;
        const filtereduserId = req.query.userId;
        const filteredcourseId = req.query.courseId;
        const filteredtitle = req.query.title;
        const date = req.query.daterange;
        console.log(date);

        const dateRange = req.query.daterange;

if (dateRange) {
    const [startDate, endDate] = dateRange.split(" - ");
    
    console.log("Start Date:", startDate); // First part of the date range
    console.log("End Date:", endDate); // Second part of the date range
}

        const posts = model.filterPosts(filteredcatId, filtereduserId, filteredcourseId, filteredtitle, date);

        const category = model.getCategory(filteredcatId);
        const resources = model.getResourcesforCategory(filteredcatId);

        const likedPosts = posts.map(post => {
            const liked = model.isPostLiked(userId, post.postId);
            const replies = model.getRepliesforPost(post.postId);
            let commentCount = model.getCommentCount(post.postId);
            commentCount = commentCount ? commentCount["COUNT(*)"] : 0;
            return { ...post, liked, replies, commentCount };
        });

        const ids = model.getConversations(userId);
        const convUsers = ids.map(id => {
            const otherUser = model.getUser(id.otherUserId);
            return {
                convId: id.convId,
                otherUser,
                unreadCount: id.unreadCount
            };
        });

        res.render("feed", {
            posts: likedPosts,
            catId: filteredcatId,
            category: category,
            resources: resources,
            convUsers: convUsers
        });
    } catch (err) {
        console.error("Error while rendering filtered posts: " + err.message);
    }
}


module.exports = {
    homePage,
    feedPage,
    reviewPage,
    makeReview,
    messagePage,
    searchUser,
    accountPage,
    likePost,
    post,
    downloadResource,
    deletePost,
    reply,
    deleteReply,
    createConv,
    getMessagePage,
    updateProfilePic,
    flagPost,
    editPost,
    editReply,
    filterPosts,
};