const userModel = require("../models/user.model");

function setSessionData(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.subjects = req.session.subjects;
        res.locals.userId = req.session.userId;
        res.locals.role = req.session.role;
        res.locals.email = req.session.email;
        res.locals.fname = req.session.fname;
        res.locals.lname = req.session.lname;
       
    }
    next();
}

module.exports = setSessionData;