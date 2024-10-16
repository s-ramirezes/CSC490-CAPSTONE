"use strict";
const express = require("express");
const router = express.Router();

const { setSessionData, isLoggedIn } = require("./setSessionData");

const tutorController = require("../controllers/tutor.controller");



module.exports = router; 