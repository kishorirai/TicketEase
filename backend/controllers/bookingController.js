const db = require("../models/db");

let io;
let lockedSeats = {}; // { eventId: { socketId: quantity } }

exports.initSocket = (socketIo, lockedSeatsRef) => {
  io = socketIo;
  lockedSeats = lockedSeatsRef;
};

// POST /api/bookings
exports.bookTickets = async (req, res) => {
  const { event_id, user_name, quantity, tickets, contact, payment, socket_id } = req.body;

  // ---- Validate required fields ----
  if (!event_id || !user_name || !quantity || !Array.isArray(tickets) || tickets.length === 0 || !contact || !payment) {
    return res.status(400).json({ message: "Missing required fields: event_id, user_name, quantity, tickets, contact, payment" });
  }

  // Validate tickets array
  for (const t of tickets) {
    if (typeof t.id === "undefined" || typeof t.quantity !== "number" || typeof t.price !== "number") {
      return res.status(400).json({ message: "Each ticket must have id, price, and quantity (numbers)" });
    }
  }

  // Validate contact
  if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
    return res.status(400).json({ message: "Missing required contact fields" });
  }

  // Validate payment
  if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardName) {
    return res.status(400).json({ message: "Missing required payment fields" });
  }

  try {
    // Fetch event
    const [events] = await db.query("SELECT * FROM events WHERE id = ?", [event_id]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });

    const event = events[0];

    // Check locked seats
    let locked = 0;
    if (lockedSeats[event_id]) {
      locked = Object.entries(lockedSeats[event_id])
        .filter(([sid]) => sid !== socket_id)
        .reduce((sum, [, q]) => sum + q, 0);
    }

    const available = event.available_seats - locked;
    if (quantity > available) return res.status(400).json({ message: "Not enough seats available" });

    // Calculate total
    const total_amount = tickets.reduce((sum, t) => sum + t.price * t.quantity, 0);

    // Insert booking
    const [result] = await db.query(
      "INSERT INTO bookings (event_id, user_name, quantity, total_amount, tickets, contact, payment) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        event_id,
        user_name,
        quantity,
        total_amount,
        JSON.stringify(tickets),
        JSON.stringify(contact),
        JSON.stringify(payment),
      ]
    );

    // Update available seats
    await db.query("UPDATE events SET available_seats = ? WHERE id = ?", [event.available_seats - quantity, event_id]);

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