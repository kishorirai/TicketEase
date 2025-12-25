const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// Helper function to format event data
const formatEventData = (event) => {
  const eventObj = event.toObject ?  event.toObject({ virtuals: true }) : event;
  
  // Ensure images array has at least a placeholder
  if (! eventObj.images || eventObj. images.length === 0) {
    eventObj.images = ['https://via.placeholder.com/600x400?text=Event+Image'];
  }
  
  return eventObj;
};

// GET /api/events - Get all events with optional filters
router.get('/', async (req, res) => {
  try {
    const { location, date, category, search } = req.query;
    
    // Build query filter
    const filter = {};
    
    if (location && location !== 'All') {
      filter.location = location;
    }
    
    if (date && date !== 'All') {
      // Match events on the specific date
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title:  { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event. find(filter).sort({ date: 1 });
    const formattedEvents = events.map(formatEventData);
    
    res.json(formattedEvents);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET /api/events/: id - Get single event
router. get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params. id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const formattedEvent = formatEventData(event);
    res.json(formattedEvent);
  } catch (err) {
    console.error('Error fetching event:', err);
    
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.title || !eventData. date) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['title', 'date'] 
      });
    }
    
    const event = new Event(eventData);
    await event.save();
    
    const formattedEvent = formatEventData(event);
    res.status(201).json(formattedEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error', message:  err.message });
  }
});

// PUT /api/events/:id - Update event
router. put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params. id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const formattedEvent = formatEventData(event);
    res.json(formattedEvent);
  } catch (err) {
    console.error('Error updating event:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully', event: formatEventData(event) });
  } catch (err) {
    console.error('Error deleting event:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;