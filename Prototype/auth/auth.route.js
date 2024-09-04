<<<<<<< HEAD
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        keepSessionInfo: true,
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    })
);

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", {
            keepSessionInfo: true,
            failureRedirect: "/",
        }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user || !user.emails || !user.emails[0].value.endsWith("@uncg.edu")) {
                return res.redirect("/");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/feed"); // put redirect address here
            });
        })(req, res, next);
    }
);

// router.get("/login", (req, res) => {
//     console.log("=====" + req.session.returnTo)
//     res.render("login");
// });

// router.get("/logout", function (req, res, next) {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         res.redirect("/");
//     });
// });

=======
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        keepSessionInfo: true,
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    })
);

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", {
            keepSessionInfo: true,
            failureRedirect: "/",
        }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user || !user.emails || !user.emails[0].value.endsWith("@uncg.edu")) {
                return res.redirect("/");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(req.session.returnTo || "/");
            });
        })(req, res, next);
    }
);

router.get("/login", (req, res) => {
    // console.log("=====" + req.session.returnTo)
    res.render("login");
});

router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

>>>>>>> 8eadf80897d5e9abceb849bb58b33d3812da4d25
module.exports = router;