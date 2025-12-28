const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  available: { type: Number, required: true, default: 0 }, // remaining
  total:  { type: Number, default: 0 }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  category: { type: String },
  location: { type: String },
  address: { type: String },
  city: { type: String, index: true },
  date: { type: Date, required:  true },
  description: { type: String },
  images: { type: [String], default: [] },
  ticket_types: { type: [TicketTypeSchema], default: [] },
  
  // New fields
  organizer: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  highlights: { type:  [String], default: [] },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject:  { virtuals: true }
});

// Virtual fields for backward compatibility and easy access
EventSchema.virtual('price').get(function() {
  if (this.ticket_types && this.ticket_types.length > 0) {
    // Return the lowest price from ticket types
    return Math.min(...this.ticket_types.map(t => t.price));
  }
  return 0;
});

EventSchema.virtual('total_seats').get(function() {
  if (this.ticket_types && this.ticket_types.length > 0) {
    return this.ticket_types.reduce((sum, t) => sum + (t.total || 0), 0);
  }
  return 0;
});

EventSchema.virtual('available_seats').get(function() {
  if (this.ticket_types && this.ticket_types.length > 0) {
    return this.ticket_types.reduce((sum, t) => sum + (t.available || 0), 0);
  }
  return 0;
});

EventSchema.virtual('booked_seats').get(function() {
  if (this.ticket_types && this.ticket_types.length > 0) {
    return this.ticket_types. reduce((sum, t) => sum + ((t.total || 0) - (t.available || 0)), 0);
  }
  return 0;
});

module.exports = mongoose.model('Event', EventSchema);