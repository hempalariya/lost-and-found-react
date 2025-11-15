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

const clientOrigins =
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173";
const allowedOrigins = clientOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) =>
  !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS request from: ${origin}`);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ["GET", "POST"],
    credentials: true,
  },
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

app.use(cors(corsOptions));
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
