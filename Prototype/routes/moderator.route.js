"use strict";
const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderator.controller");

router.get("/modHome", moderatorController.homePage);



module.exports = router; 