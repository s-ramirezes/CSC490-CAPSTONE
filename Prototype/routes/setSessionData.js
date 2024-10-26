const userModel = require("../models/user.model");

function setSessionData(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.subjects = req.session.subjects;
        res.locals.userId = req.session.userId;
        res.locals.role = req.session.role;
        res.locals.email = req.session.email;
        res.locals.fname = req.session.fname;
        res.locals.lname = req.session.lname;
        res.locals.subject = req.session.subject;
    }
    next();
}

function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else if (req.originalUrl !== "/") {
        res.redirect("/");
    } else {
        next();
    }
}

function isTeacher(req, res, next) {
    if(req.session.role === 'teacher'){
        return next();
    } else {
        res.redirect("/home")
    }
}

function isMod(req, res, next) {
    if(req.session.role === 'moderator'){
        return next();
    } else {
        res.redirect("/home")
    }
}

module.exports = { setSessionData, isLoggedIn, isMod, isTeacher};