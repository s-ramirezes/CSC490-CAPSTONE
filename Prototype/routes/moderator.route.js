"use strict";
const express = require("express");
const router = express.Router();

// const { isMod } = require("./setSessionData");

const moderatorController = require("../controllers/moderator.controller");

router.get("/modMessages", moderatorController.messages);
router.post("/sendMessage", moderatorController.sendMessage);
router.post("/createCalendar", moderatorController.createCalendar);
router.get("/modUsers", moderatorController.userList);
router.post("/unflagUser", moderatorController.unflagUser);
router.post("/banUser", moderatorController.banUser);
router.post("/modFlag", moderatorController.modFlag);
router.get("/modUserPage", moderatorController.modUserPage);
router.get("/modPosts", moderatorController.postList);
router.post("/unflagPost", moderatorController.unflagPost);
router.post("/deletePost", moderatorController.deletePost);
router.get("/modTutors", moderatorController.tutorList);
router.get("/tutorPage", moderatorController.tutorPage);
router.post("/addTutor", moderatorController.addTutor);
router.post("/removeTutor", moderatorController.removeTutor);
router.get("/voiceCall", moderatorController.voiceCall);
module.exports = router;