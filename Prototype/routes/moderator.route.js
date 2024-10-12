"use strict";
const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderator.controller");

const isModRole = (req, res, next) => {
    if (req.user && req.user.role === "mod") {
        return next(); 
    }
    return res.redirect('back');
};

router.get("/modHome", isModRole, moderatorController.homePage);
router.get("/modMessages", moderatorController.messages);
router.post("/sendMessage", moderatorController.sendMessage);
router.post("/createCalendar", isModRole, moderatorController.createCalendar);
router.get("/modUsers", isModRole, moderatorController.userList);
router.post("/unflagUser", isModRole, moderatorController.unflagUser);
router.post("/banUser", isModRole, moderatorController.banUser);
router.post("/modFlag", isModRole, moderatorController.modFlag);
router.get("/modUserPage", isModRole, moderatorController.modUserPage);
router.get("/modPosts", isModRole, moderatorController.postList);
router.post("/unflagPost", isModRole, moderatorController.unflagPost);
router.post("/deletePost", isModRole, moderatorController.deletePost);
router.get("/modTutors", isModRole, moderatorController.tutorList);
router.get("/tutorPage", isModRole, moderatorController.tutorPage);
router.post("/addTutor", isModRole, moderatorController.addTutor);
router.post("/removeTutor", isModRole, moderatorController.removeTutor);
module.exports = router;