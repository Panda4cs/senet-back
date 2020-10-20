const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const shortid = require("shortid");
//rooms
const rooms = [];
// todo just not now!
const roomsDS = {};

// Load config
dotenv.config({ path: "./config/config.env" });

//# server
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Eyes on port ${PORT} ` + "http://localhost:3000/")
);

const io = require("socket.io")(server);
app.get("/api/create/tic-tac-toe", (req, res) => {
  const room = createRoom();
  res.send(room);
});
app.get("/api/join/tic-tac-toe/:code", (req, res) => {
  if (rooms.includes(req.params.code)) {
    res.send(req.params.code);
  } else {
    res.send(false);
  }
});
app.get("*", (req, res) => {
  res.send("Ayo");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// socket.emit("setPlayer", sendPlayer());
// socket.on("userClick", (data) => {
//   io.emit("registerClick", data);
// });
// socket.on("setWinner", (winner) => io.emit("declareWinner", winner));
//room creation
const createRoom = () => {
  const id = shortid.generate();
  const nsp = io.of(`/${id}`);
  nsp.on("connection", function (socket) {
    console.log("someone connected", id);
    // socket.emit("setPlayer", sendPlayer());
    socket.on("userClick", (data) => {
      nsp.emit("registerClick", data);
      console.log(data);
    });
    socket.on("opponentJoined", () => {
      nsp.emit("startGame");
    });
    socket.on("resetBoard", () => {
      nsp.emit("reset");
      console.log("lamo");
    });
    // socket.on("setWinner", (winner) => nsp.emit("declareWinner", winner));
  });
  rooms.push(id);
  return id;
};
