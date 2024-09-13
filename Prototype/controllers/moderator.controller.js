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
        const userId= req.session.userId;
        const recipient= model.getReceivers (userId);
        const role= 'moderator';
        res.render ("modMessages", {subjects : subjects, role: role, 
            messages: messages, userId: userId, recipient: recipient});
    } catch (err) {
        console.error("Failed to render modMessages page "+ err.message);
    }
}



module.exports = {
    homePage,
    messages,
};