"use strict";
const express = require("express");
const app = express();
// const path = require('path')
const multer = require("multer");
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
const model = require("../models/moderator.model");
function homePage (req,res) {
    try {
        const subjects = model.getSubjects();
        req.session.subjects = subjects;
        const role= 'moderator';
        res.render ("modHome", {subjects : subjects, role: role});
    } catch (err) {
        console.error("Failed to render modHome page: "+ err.message);
    }
}
function messages (req, res){
    try{
        const subjects= model.getSubjects();
        req.session.subjects = subjects;
        const messages= model.getMessages(req.query.convId);
        const userId= 2;
        const receiver= model.getReceiver(userId);
        const convId = req.query.convId; 
        const role= 'moderator';
        res.render ("modMessages", {subjects : subjects, role: role, 
            messages: messages, userId: userId, receiver: receiver, 
            convId: convId});
    } catch (err) {
        console.error("Failed to render modMessages page "+ err.message);
    }
}
function sendMessage (req, res){
    try{
        const userId = req.body.userId;
        const messageTxt = req.body.message;
        const convId = req.query.convId;
        if (!convId || !userId || !messageTxt) {
            throw new Error("Missing required parameters");
        }
        model.storeMessage(convId, messageTxt, userId);
        const messageId = model.getLastRowId().id;
        model.addMessageStatus(messageId, userId);
        const receiver = model.getReceiver(userId);
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
module.exports = {
    homePage,
    messages,
    sendMessage,
    createCalendar,

};