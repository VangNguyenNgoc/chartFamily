const express = require("express");
const mongoose = require("mongoose");
// const logger = require("morgan");
const route = require("./server/routes/main");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
// set up express app
const app = express();
const server = require("http").createServer(app);
const port = 3000;

const PersonModel = require("./server/models/Person");
//--
// app.use(cors());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "POST,GET,PUT,OPTIONS,DELETE",
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});
const connection = "mongodb://localhost:27017/chart";
// socket;

// set up home route

//connect db
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database");
  });

app.use(express.json());

//route
route(app);
// var user = [];
// io.on("connection", function (socket) {
//   socket.on("message", function (userId) {
//     user[userId] = socket.id;
//     console.log("socket", socket.id);
//   });
//   socket.on("sendMessage", async function (data) {
//     console.log("data", data);
//     PersonModel.find({ idAccount: data.userSend }).exec(function (
//       err,
//       personReceive
//     ) {
//       console.log("personReceive", personReceive);
//       if (personReceive != null) {
//         if (personReceive.length > 0) {
//           PersonModel.find({ _id: data.userReceive }).exec(function (
//             err,
//             personSend
//           ) {
//             if (personSend.length > 0) {
//               var avatar = personReceive.image;
//               var messageReceived =
//                 personReceive.name + " invite you join family.";
//               io.to(socket.id).emit("messageReceived", {
//                 messageReceived,
//                 avatar,
//               });
//             }
//           });
//         }
//       }
//     });
//   });

//   // socket.to(socket.id).emit("messageReceive", (data) => {
//   //   console.log("person 1", person);
//   // });
// });

server.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});
