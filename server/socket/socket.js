import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const userMap = {};
const messages = {}; // Store messages for each room
const roomTexts = {}; // Store text per room
let languages={};
let output={};
let error={};

// Function to get all connected users in a room
const getAllConnectedUsers = (room) => {
  return Array.from(io.sockets.adapter.rooms.get(room) || []).map(
    (socketId) => ({
      socketId,
      username: userMap[socketId],
    })
  );
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);



  socket.on("user", ({ username, roomName }) => {
    console.log(username, "joined room:", roomName);
    userMap[socket.id] = username;
    socket.join(roomName);

    // Ensure room messages and text exist
    if (!messages[roomName]) messages[roomName] = [];
    if (!roomTexts[roomName]) roomTexts[roomName] = "";

    // Send updated user list to all users in the room
    io.to(roomName).emit("sendtoall", getAllConnectedUsers(roomName));

    // Notify others that a new user joined
    socket.to(roomName).emit("user-joined", { username });

    // Send existing messages and text to new user
    socket.emit("load-message", messages[roomName]);
    socket.emit("load-text", roomTexts[roomName]);
    socket.emit("load-language",languages[roomName]);
    socket.emit("load-output",output[roomName]);
    socket.emit("load-error",error[roomName]);
  });




  // Handle text updates (live typing feature)
  socket.on("update-text", (texts) => {
    const roomName = Array.from(socket.rooms)[1];  // in this roomName you find a array which consisits of two elemenet , first one (0th index) is user id (which is the room id itself) and 1st index elem has the room jisme user join hua h 
    if (!roomName) return;

    roomTexts[roomName] = texts;
    socket.to(roomName).emit("update-text", texts);
  });

  // Handle message sending
  socket.on("send-message", (newMessage) => {
    const roomName = Array.from(socket.rooms)[1]; // Get the room the user is in
    if (!roomName) return;

    // Append the new message to the room-specific messages array
    messages[roomName].push(newMessage);
    console.log(messages);

    // Broadcast only the new message
    socket.to(roomName).emit("send-message", newMessage);
  });

  socket.on("set-language",(language)=>{
    const roomName= Array.from(socket.rooms)[1];
    if (!roomName) return;
    languages[roomName]=language;
    socket.to(roomName).emit("set-language",language)
  })

  socket.on("update-output",(out)=>{
    const roomName=Array.from(socket.rooms)[1];
    if(!roomName) return;
    output[roomName]=out
    socket.to(roomName).emit("update-output",out)
  })

  socket.on("update-error",(err)=>{
    const roomName=Array.from(socket.rooms)[1];
    if(!roomName) return;
    Error[roomName]=err;
    socket.to(roomName).emit("update-error",err);
  })



  // Handle user disconnection
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    const username = userMap[socket.id];

    rooms.forEach((roomName) => {
      socket.to(roomName).emit("user-left", {
        socketId: socket.id,
        username: username,
      });

      // Remove user from userMap
      delete userMap[socket.id];

      // Check if the room is empty
      setTimeout(() => {
        if (!io.sockets.adapter.rooms.get(roomName)) {
          console.log(`Room ${roomName} is empty. Resetting text.`);
          delete roomTexts[roomName]; // Reset text for the room
          delete messages[roomName]; // Clear messages for the room
        }
      }, 1000);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, server };
