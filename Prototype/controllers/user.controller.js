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
        const userId = req.session.userId;
        const posts = model.getSubjectPosts(req.query.catId);
        const likedPosts = posts.map(post => {
            const liked = model.isPostLiked(userId, post.postId); 
            return { ...post, liked };
        });

        res.render("feed", {subjects: req.session.subjects, role: req.session.role, posts: likedPosts});
    } catch (err) {
        // console.error("Error while rendering feed page: " + err.message);
    }
}

function accountPage(req, res) {
    try {
        const userId = req.session.userId;
        const user = model.getUser(userId);
        const userPosts = model.getUserPost(userId);
        const likedPosts = userPosts.map(post => {
            const liked = model.isPostLiked(userId, post.postId); 
            return { ...post, liked };
        });

        res.render("account", {subjects: req.session.subjects, role: req.session.role, user: user, userPosts: likedPosts});
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

module.exports = {
    feedPage,
    accountPage,
    likePost,
};