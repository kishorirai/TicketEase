const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

const router = express.Router();

// POST /api/bookings
// Protected: requires Authorization: Bearer <token>
router.post('/', auth, async (req, res) => {
  const { eventId, items } = req.body;
  if (!eventId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'eventId and items are required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const session = await mongoose.startSession();
    let booking;
    try {
      session.startTransaction();

      let totalAmount = 0;
      const bookingItems = items.map((it) => {
        // it = { ticketTypeId, quantity }
        const tt = event.ticket_types.id(it.ticketTypeId);
        if (!tt) throw new Error(`Ticket type ${it.ticketTypeId} not found`);
        if (tt.available < it.quantity) throw new Error(`Not enough tickets for ${tt.name}`);
        totalAmount += tt.price * it.quantity;
        return {
          ticketTypeId: tt._id,
          name: tt.name,
          price: tt.price,
          quantity: it.quantity
        };
      });

      // decrement availability
      bookingItems.forEach((bi) => {
        const tt = event.ticket_types.id(bi.ticketTypeId);
        tt.available = tt.available - bi.quantity;
      });

      await event.save({ session });

      booking = await Booking.create([{
        userId: req.user._id,
        eventId: event._id,
        items: bookingItems,
        totalAmount
      }], { session });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    res.status(201).json({ booking: booking[0] });
  } catch (err) {
    console.error(err);
    if (err.message && err.message.startsWith('Not enough tickets')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET /api/bookings/my - user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId').lean();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;