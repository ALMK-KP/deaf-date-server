import "dotenv/config";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { User } from "./utils/interfaces";

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

let allConnectedUsers: Array<User> = [];
const getUsersInTheRoom = (roomId: string) => {
  const allUsersInTheRoom = allConnectedUsers.filter(
    (user: User) => user.roomId === roomId,
  );
  const allUsersInTheRoomMapped = allUsersInTheRoom.map((user: User) => ({
    id: user.id,
    name: user.name,
  }));
  return allUsersInTheRoomMapped;
};

io.on("connection", (socket) => {
  const { roomId: customRoomId, username } = socket.handshake.query;
  if (!customRoomId || !username) return;

  socket.join(customRoomId);

  const currentUserIndex = allConnectedUsers.findIndex(
    (user: User) => user.name === username,
  );

  if (currentUserIndex < 0) {
    allConnectedUsers.push({
      id: socket.id,
      name: username.toString(),
      roomId: customRoomId.toString(),
    });
  }
  if (currentUserIndex >= 0) {
    allConnectedUsers[currentUserIndex].id = socket.id;
  }

  io.sockets.to(customRoomId).emit("CONNECTED_USERS_CHANGE", {
    users: getUsersInTheRoom(customRoomId.toString()),
  });

  socket.on("disconnect", () => {
    allConnectedUsers = allConnectedUsers.filter(
      (user: User) => user.id !== socket.id,
    );

    io.sockets.to(customRoomId).emit("CONNECTED_USERS_CHANGE", {
      users: getUsersInTheRoom(customRoomId.toString()),
    });
  });

  socket.on("TOGGLE_PLAY_EVENT", (payload) => {
    io.sockets.to(customRoomId).emit("TOGGLE_PLAY_EVENT", payload);
  });
});
