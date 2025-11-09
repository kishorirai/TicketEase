const express = require("express");
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// CRUD routes
router.get("/", getEvents);           // List all events
router.get("/:id", getEventById);    // Get event by ID
router.post("/", createEvent);       // Create new event
router.put("/:id", updateEvent);     // Update event
router.delete("/:id", deleteEvent);  // Delete event

module.exports = router;
