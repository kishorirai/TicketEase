const express = require("express");
const router = express.Router();
const { bookTickets } = require("../controllers/bookingController");

// POST booking
router.post("/", bookTickets);

module.exports = router;
