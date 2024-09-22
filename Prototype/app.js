"use strict";

const express = require("express");
const app = express();
const multer = require("multer");
const session = require("express-session");
const path = require("path");
const setSessionData = require("./routes/setSessionData");

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './images');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const imageUpload = multer({ storage: imageStorage });

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: uploadStorage });

//^^^^^^for storing post images and file resources

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(setSessionData);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views', 'partials'));



const moderatorRouter = require("./routes/moderator.route");
const userRouter = require("./routes/user.route");
const teacherRouter = require("./routes/teacher.route")(upload);
const tutorRouter = require("./routes/tutor.route");
const loginRouter = require("./routes/login.route");

app.use("/public", express.static('public'));
app.use("/images", express.static('images'));
app.use("/", moderatorRouter);
app.use("/", userRouter);
app.use("/", teacherRouter);
app.use("/", tutorRouter);
app.use("/", loginRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});