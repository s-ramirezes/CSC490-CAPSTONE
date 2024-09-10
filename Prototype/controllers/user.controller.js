"use strict";

const express = require("express");
const app = express();
// const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/user.model");

function feedPage(req, res) {
    try {
        // const error = null;
        const subjects = model.getSubjects();
        req.session.subjects = subjects;
        const role = 'student';
        // const role = 'teacher';
        // const role = 'moderator';
        // const role = 'tutor';
        const userId = 11;
        const posts = model.getSubjectPosts(req.query.catId);
        const likedPosts = posts.map(post => {
            const liked = model.isPostLiked(userId, post.postId); 
            return { ...post, liked };
        });

        res.render("feed", {subjects: subjects, role: role, posts: likedPosts});
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

function accountPage(req, res) {
    try {

        if (!req.session.subjects) {
            return res.redirect('/feed');
        }

        // const error = null;
        // const subjects = model.getSubjects();
        const role = 'student';
        // const role = 'teacher';
        // const role = 'moderator';
        // const role = 'tutor';

        const userId = 11 // this would use req.session.userId once setup
        const user = model.getUser(userId);
        const userPosts = model.getUserPost(userId);
        const likedPosts = userPosts.map(post => {
            const liked = model.isPostLiked(userId, post.postId); 
            return { ...post, liked };
        });

        res.render("account", {subjects: req.session.subjects, role: role, user: user, userPosts: likedPosts});
    } catch (err) {
        console.error("Error while rendering feed page: " + err.message);
    }
}

function likePost(req, res) {
    try {
        const userId = 11 // this would use req.session.userId once setup
        const postId = req.body.postId;
        model.likePost(userId, postId);

    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

module.exports = {
    feedPage,
    accountPage,
    likePost,
};