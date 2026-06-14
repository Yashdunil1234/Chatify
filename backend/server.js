const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

/* ================= CONFIG ================= */
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat App Backend Running 🚀");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  /* -------- SETUP USER -------- */
  // frontend: socket.emit("setup", user)
  socket.on("setup", (userData) => {
    socket.join(userData._id); // personal room
    socket.emit("connected");
    console.log("User setup:", userData._id);
  });

  /* -------- JOIN CHAT ROOM -------- */
  // frontend: socket.emit("join chat", chatId)
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("User joined chat room:", roomId);
  });

  /* -------- TYPING INDICATOR -------- */
  socket.on("typing", (roomId) => {
    socket.in(roomId).emit("typing");
  });

  socket.on("stop typing", (roomId) => {
    socket.in(roomId).emit("stop typing");
  });

  /* -------- NEW MESSAGE -------- */
  // frontend: socket.emit("new message", message)
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

    if (!chat || !chat.users) return;

    chat.users.forEach((user) => {
      // do not send message to sender
      if (user._id === newMessage.sender._id) return;

      // send message to receiver's personal room
      socket.to(user._id).emit("message received", newMessage);
    });
  });

  /* -------- DISCONNECT -------- */
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ================= START SERVER ================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
