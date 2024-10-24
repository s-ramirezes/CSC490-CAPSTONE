"use strict";

const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const multer = require("multer");
const session = require("express-session");
const path = require("path");
const {setSessionData, isLoggedIn} = require("./routes/setSessionData");
const server =http.createServer(app);
const io = new Server(server);

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const imageUpload = multer({ storage: imageStorage });

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: uploadStorage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views', 'partials'));

const moderatorRouter = require("./routes/moderator.route");
const userRouter = require("./routes/user.route")(imageUpload);
const teacherRouter = require("./routes/teacher.route")(upload);
const tutorRouter = require("./routes/tutor.route");
const loginRouter = require("./routes/login.route");

const userSocketMap = {};

io.on('connection', (socket) => {

  socket.on('registerUser', (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  socket.on('signal', (data) => {
   const targetSocketId = userSocketMap[data.toUserId];
       if (targetSocketId) {
        io.to(targetSocketId).emit('signal', {
          signal: data.signal,
          fromUserId: data.fromUserId
        });
          console.log('Signal relayed from:', data.fromUserId, 'to:', data.toUserId);
        } else {
          console.error('Target user not connected:', data.toUserId);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        for (const userId in userSocketMap) {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
    });
});

app.use("/public", express.static('public'));
app.use("/images", express.static('images'));
app.use("/", loginRouter);
app.use(setSessionData);
app.use(isLoggedIn);
app.use("/", moderatorRouter);
app.use("/", userRouter);
app.use("/", teacherRouter);
app.use("/", tutorRouter);
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});