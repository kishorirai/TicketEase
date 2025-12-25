const mongoose = require('mongoose');

const BookingItemSchema = new mongoose.Schema({
  ticketTypeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  items: { type: [BookingItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);