"use strict";
const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderator.controller");

router.get("/modHome", moderatorController.homePage);
router.get("/modMessages", moderatorController.messages);
router.post("/sendMessage", moderatorController.sendMessage);



module.exports = router; 