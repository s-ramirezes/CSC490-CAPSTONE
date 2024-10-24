"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const model = require("../models/moderator.model");

function messages (req, res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const messages= model.getMessages(req.query.convId);
        const userId= req.session.userId;
        const convId = req.query.convId; 
        const receiver= model.getReceiver(userId, convId);
        const role= req.session.role;
        res.render ("modMessages", {subjects : subjects, role: role, 
            messages: messages, userId: userId, receiver: receiver, 
            convId: convId});
        model.markMessagesAsRead(convId, userId);   
    } catch (err) {
        console.error("Failed to render modMessages page "+ err.message);
    }
}
function sendMessage (req, res){
    try{
        const userId = req.session.userId;
        const messageTxt = req.body.message;
        const convId = req.query.convId;
        if (!convId || !userId || !messageTxt) {
            throw new Error("Missing required parameters");
        }
        model.storeMessage(convId, messageTxt, userId);
        const messageId = model.getLastRowId().id;
        model.addMessageStatus(messageId, userId);
        const receiver = model.getReceiver(userId, convId);
        model.addMessageStatus(messageId, receiver.userId);


        res.redirect(`/modMessages?convId=${convId}`);
    } catch (err) {
        console.error ("Failed to send Message: " + err.message);
        res.status(500).send("Failed to send message");
    }
}
function createCalendar (req,res){
    try{
        const convId = req.query.convId;
        const userId = req.body.userId;
        const name= req.body.name;
        const location= req.body.location;
        const startDate= req.body.startDate;
        const endDate= req.body.endDate;
        const startTime= req.body.startTime;
        const endTime= req.body.endTime;
        model.storeCalendar(convId, userId, name, location,
            startDate, endDate, startTime, endTime);
        res.redirect(`/modMessages?convId=${convId}`);
    } catch (err) {
        console.error ("Failed to set calendar: " + err.message);
        res.status(500).send("Failed to set calendar");
    }
}
function userList (req,res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const flaggedUsers= model.getFlaggedUsers();
        const allUsers=model.getAllUsers();
        const role=req.session.role;
        if (model.isModRole(role)){
            res.render ("modUsers", {subjects : subjects, role: role, 
                flaggedUsers : flaggedUsers, allUsers: allUsers});
        } else{
            res.redirect(req.get('Referrer') || '/');
        }
        
    } catch (err) {
        console.error("Failed to render modUsers page "+ err.message);
    }
}
function unflagUser (req, res){
    try{
        const userId= req.query.userId;
        model.unflagUser(userId);
        res.redirect(`/modUsers`);
    } catch (err) {
        console.error ("Failed to unflag User: " + err.message);
        res.status(500).send("Failed to unflag User");
    }
}
function banUser (req, res){
    try{
        const userId= req.query.userId;
        model.banUser(userId);
        res.redirect(`/modUsers`);
    } catch (err) {
        console.error ("Failed to ban User: " + err.message);
        res.status(500).send("Failed to ban User");
    }
}
function modFlag (req, res){
    try{
        const userId= req.query.userId;
        model.flagUser(userId);
        res.redirect(`/modUsers`);
    } catch (err) {
        console.error ("Failed to flag User: " + err.message);
        res.status(500).send("Failed to flag User");
    }
}
function modUserPage (req, res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const userId= req.query.userId;
        const user= model.getUser(userId);
        const userPosts= model.getUserPosts(userId);
        const userReplies= model.getUserReplies(userId);
        const role=req.session.role;
        if (model.isModRole(role)){
            res.render ("modUserPage", {subjects : subjects, role: role, 
                userId : userId, user: user, userPosts: userPosts, userReplies: userReplies});
        } else{
            res.redirect(req.get('Referrer') || '/');
        }
        
    } catch (err) {
        console.error("Failed to render modUserPage page "+ err.message);
    }
}
function postList (req,res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const flaggedPosts= model.getFlaggedPosts();
        const allPosts=model.getAllPosts();
        const role= req.session.role;
        if (model.isModRole(role)){
            res.render ("modPosts", {subjects : subjects, role: role, 
                flaggedPosts : flaggedPosts, allPosts: allPosts});
        } else{
            res.redirect(req.get('Referrer') || '/');
        }
        
    } catch (err) {
        console.error("Failed to render modPosts page "+ err.message);
    }
}
function unflagPost (req, res){
    try{
        const postId= req.query.postId;
        model.unflagPost(postId);
        res.redirect(`/modPosts`);
    } catch (err) {
        console.error ("Failed to unflag Post: " + err.message);
        res.status(500).send("Failed to unflag Post");
    }
}
function deletePost (req, res){
    try{
        const postId= req.query.postId;
        model.deletePost(postId);
        res.redirect(`/modPosts`);
    } catch (err) {
        console.error ("Failed to delete post: " + err.message);
        res.status(500).send("Failed to delete post");
    }
}
function tutorList (req,res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const tutors= model.getTutors();
        const reviews=model.getReviews();
        const role= req.session.role;
        if(model.isModRole(role)){
            res.render ("modTutor", {subjects : subjects, role: role, 
                tutors : tutors, reviews: reviews});
        } else {
            res.redirect(req.get('Referrer') || '/');
        }
        
    } catch (err) {
        console.error("Failed to render modTutors page "+ err.message);
    }
}
function tutorPage (req, res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const userId= req.query.userId;
        const user= model.getUser(userId);
        const userPosts= model.getUserPosts(userId);
        const userReplies= model.getUserReplies(userId);
        const role=req.session.role;
        if (model.isModRole(role)){
            res.render ("tutorPage", {subjects : subjects, role: role, 
                userId : userId, user: user, userPosts: userPosts, userReplies: userReplies});
        } else {
            res.redirect(req.get('Referrer') || '/');
        }
        
    } catch (err) {
        console.error("Failed to render Tutor page "+ err.message);
    }
}
function addTutor (req, res){
    try{
        const userId= req.query.userId;
        model.addTutor(userId);
        res.redirect(`/modTutors`);
    } catch (err) {
        console.error ("Failed to add Tutor: " + err.message);
        res.status(500).send("Failed to add Tutor");
    }
}
function removeTutor (req, res){
    try{
        const userId= req.query.userId;
        model.removeTutor(userId);
        res.redirect(`/modTutors`);
    } catch (err) {
        console.error ("Failed to remove tutor: " + err.message);
        res.status(500).send("Failed to remove tutor");
    }
}
function voiceCall (req, res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const toUserId= req.query.userId;
        const toUser= model.getUser(toUserId);
        const userId= req.session.userId;
        const role=req.session.role;
        res.render ("voiceCall", {subjects : subjects, role: role, 
            userId : userId, toUserId: toUserId, toUser: toUser});
    } catch (err) {
        console.error("Failed to render voice call "+ err.message);
    }
}
module.exports = {
    messages,
    sendMessage,
    createCalendar,
    userList,
    unflagUser,
    banUser,
    modFlag,
    modUserPage,
    postList,
    unflagPost,
    deletePost,
    tutorList,
    tutorPage,
    addTutor,
    removeTutor,
    voiceCall,
};