import "dotenv/config";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";

const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

const server = createServer();
const io = new Server({
  ...server,
  cors: {
    origin: process.env.WEBSOCKETS_CLIENT_PORT,
  },
});

io.listen(+process.env.WEBSOCKETS_SERVER_PORT! || 3001);

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(...io.sockets.listeners("connection"));

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("toggle play", (val) => {
    console.log(val);
    io.emit("chat message", "DUA LIPA");
  });
});
