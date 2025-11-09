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

// ✅ MySQL Connection (using Railway environment variables)
async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT || 3306,
    });
    console.log("✅ Connected to MySQL database successfully!");
    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

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

// ✅ Health check (important for Railway)
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Railway 🚀");
});

// ✅ Start server after DB connection
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
