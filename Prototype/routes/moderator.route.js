"use strict";
const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderator.controller");

router.get("/modHome", moderatorController.homePage);
router.get("/modMessages", moderatorController.messages);



module.exports = router; 