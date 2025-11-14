import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import reportRouter from "./routes/reportRoutes.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});


io.on("connection", (socket) => {
  console.log("user connected", socket.id)
  socket.on("join_room", (roomId) => {
    socket.join(roomId)
  })
  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data)
  })
})

app.use(cors());
app.use("/uploads", express.static("uploads"));

connectDB();
app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/report", reportRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("listening on port", port);
});
