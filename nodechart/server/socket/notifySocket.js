const io = require("socket.io")();
io.path("localhost:3000/socket.io/notification");
const socketAPI = {};

io.on("connection", (client) => {
  console.log("a user connected");
  client.on("message", (data) => {
    /* … */
    console.log("message", data);
    console.log("a user connected 1");
  });
  
  client.on("disconnect", () => {
    /* … */
    console.log("a user connected 2");
  });
});

socketAPI.io = io;

module.exports = socketAPI;
