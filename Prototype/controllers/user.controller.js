"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const model = require("../models/user.model");

function feedPage(req, res) {
    try {
        const userId = req.session.userId;
        const posts = model.getSubjectPosts(req.params.catId);
        const resources = model.getResourcesforCategory(req.params.catId);
        const likedPosts = posts.map(post => {
            const liked = model.isPostLiked(userId, post.postId);
            const replies = model.getRepliesforPost(post.postId);
            return { ...post, liked, replies };
        });
        res.render("feed", {subjects: req.session.subjects, role: req.session.role, posts: likedPosts, catId: req.params.catId, role: req.session.role, resources: resources, userId: userId});
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

function post(req, res){
    try {
        const userId = req.session.userId;
        const title = req.body.title;
        const description = req.body.description;
        const catId = req.body.catId;
        model.createPost(catId, userId, title, description);
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

function deletePost(req, res){
    try{
        const postId = req.body.postId;
        const catId = req.body.catId;
        model.deletePost(postId);
        res.redirect("/category/" + catId);
    }catch(err){
        console.error("Error while deleting post" + err.message)
    }
}

function reply(req, res){
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

function deleteReply(req, res){
    try{
        const replyId = req.body.replyId;
        const catId = req.body.catId;
        model.deleteReply(replyId);
        res.redirect("/category/" + catId);
    }catch(err){
        console.error("Error while deleting post" + err.message)
    }
}

module.exports = {
    feedPage,
    accountPage,
    likePost,
    post,
    downloadResource,
    deletePost,
    reply,
    deleteReply,
};