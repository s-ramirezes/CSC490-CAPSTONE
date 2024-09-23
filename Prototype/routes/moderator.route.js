"use strict";
const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderator.controller");

router.get("/modHome", moderatorController.homePage);
router.get("/modMessages", moderatorController.messages);
router.post("/sendMessage", moderatorController.sendMessage);
router.post("/createCalendar", moderatorController.createCalendar);
router.get("/modUsers", moderatorController.userList);
router.post("/unflagUser", moderatorController.unflagUser);
router.post("/banUser", moderatorController.banUser);
router.post("/modFlag", moderatorController.modFlag);
router.get("/modUserPage", moderatorController.modUserPage);

module.exports = router; 