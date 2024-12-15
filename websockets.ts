import "dotenv/config";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { getRandomUsername } from "./services/getRandomUsername";

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

let allConnectedUsers: any = [];

io.on("connection", (socket) => {
  const customRoomId = socket.handshake.query.roomId;
  if (!customRoomId) return;

  socket.join(customRoomId);

  allConnectedUsers.push({
    id: socket.id,
    name: getRandomUsername(),
    roomId: customRoomId,
  });

  const usersInThisRoom = allConnectedUsers.filter(
    (user: any) => user.roomId === customRoomId,
  );
  io.sockets.to(customRoomId).emit("CONNECTED_USERS_CHANGE", usersInThisRoom);

  socket.on("disconnect", () => {
    allConnectedUsers = allConnectedUsers.filter(
      (user: any) => user.id !== socket.id,
    );
    const usersInThisRoom = allConnectedUsers.filter(
      (user: any) => user.roomId === customRoomId,
    );

    io.sockets.to(customRoomId).emit("CONNECTED_USERS_CHANGE", usersInThisRoom);
  });

  socket.on("TOGGLE_PLAY_EVENT", (val) => {
    console.log(val);
    socket.broadcast.to("LbgL0927Noa").emit("TOGGLE_PLAY_EVENT", val);

    // socket.broadcast.emit("TOGGLE_PLAY_EVENT", val);
  });
});
