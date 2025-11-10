const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");

dotenv.config();

const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection Pool using .env variables
let db;
async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "smart_event",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ Connected to MySQL database successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Make DB accessible in routes/controllers
app.locals.db = db;

// HTTP + WebSocket setup
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Seat locking state
let lockedSeats = {}; // { eventId: { socketId: quantity } }

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("lockSeats", ({ eventId, quantity }) => {
    if (!lockedSeats[eventId]) lockedSeats[eventId] = {};
    lockedSeats[eventId][socket.id] = quantity;
    io.emit("seatUpdate", { eventId, lockedSeats: lockedSeats[eventId] });
  });

  socket.on("releaseSeats", ({ eventId }) => {
    if (lockedSeats[eventId] && lockedSeats[eventId][socket.id]) {
      delete lockedSeats[eventId][socket.id];
      io.emit("seatUpdate", { eventId, lockedSeats: lockedSeats[eventId] });
    }
  });

  socket.on("disconnect", () => {
    for (const eventId in lockedSeats) {
      if (lockedSeats[eventId][socket.id]) {
        delete lockedSeats[eventId][socket.id];
        io.emit("seatUpdate", { eventId, lockedSeats: lockedSeats[eventId] });
      }
    }
  });
});

// Initialize booking controller with Socket.IO
bookingController.initSocket(io, lockedSeats);

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// ✅ Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
