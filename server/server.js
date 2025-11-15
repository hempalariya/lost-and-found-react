import dotenv from "dotenv";
import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("join_room", (roomId) => {
    if (roomId) {
      socket.join(roomId.toString());
    }
  });
  socket.on("leave_room", (roomId) => {
    if (roomId) {
      socket.leave(roomId.toString());
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

connectDB();
app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/chat", chatRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("listening on port", port);
});
