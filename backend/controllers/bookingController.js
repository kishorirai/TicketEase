const db = require("../models/db");

// We'll pass the Socket.IO instance from server.js
let io;
let lockedSeats = {}; // { eventId: { socketId: quantity } }

exports.initSocket = (socketIo, lockedSeatsRef) => {
    io = socketIo;
    lockedSeats = lockedSeatsRef;
};

// POST /api/bookings - Book tickets
exports.bookTickets = async (req, res) => {
    const { event_id, user_name, quantity, socket_id } = req.body;

    if (!event_id || !user_name || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Get event info
        const [events] = await db.query("SELECT * FROM events WHERE id = ?", [event_id]);
        if (events.length === 0) return res.status(404).json({ message: "Event not found" });

        const event = events[0];

        // Calculate seats locked by other users
        let locked = 0;
        if (lockedSeats[event_id]) {
            locked = Object.entries(lockedSeats[event_id])
                .filter(([sid, q]) => sid !== socket_id)
                .reduce((sum, [, q]) => sum + q, 0);
        }

        const available = event.available_seats - locked;
        if (quantity > available) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        // Calculate total amount
        const total_amount = event.price * quantity;

        // Insert booking
        const [result] = await db.query(
            "INSERT INTO bookings (event_id, user_name, quantity, total_amount) VALUES (?, ?, ?, ?)",
            [event_id, user_name, quantity, total_amount]
        );

        // Update available seats in database
        const newAvailableSeats = event.available_seats - quantity;
        await db.query("UPDATE events SET available_seats = ? WHERE id = ?", [newAvailableSeats, event_id]);

        // Release locked seats for this socket
        if (lockedSeats[event_id] && lockedSeats[event_id][socket_id]) {
            delete lockedSeats[event_id][socket_id];
            io.emit("seatUpdate", { eventId: event_id, lockedSeats: lockedSeats[event_id] });
        }

        const [booking] = await db.query("SELECT * FROM bookings WHERE id = ?", [result.insertId]);
        res.status(201).json(booking[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
