const express = require("express");
const router = express.Router();
const { bookTickets, getBookings } = require("../controllers/bookingController");

// POST /api/bookings
router.post("/", bookTickets);

// GET /api/bookings
router.get("/", getBookings);

module.exports = router;
