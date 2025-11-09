const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");

const app = express();
app.use(cors());
app.use(express.json());

// HTTP + WebSocket setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Seat locking state
let lockedSeats = {}; // { eventId: { socketId: quantity } }

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check (important for Railway)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Correct listen for Railway
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
