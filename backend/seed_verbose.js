
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-ease';

async function run() {
  console.log('Using MONGODB_URI:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { autoIndex: true });
  console.log('Connected to MongoDB for seeding ->', mongoose.connection.name, mongoose.connection.host);

  console.log('Clearing events collection...');
  const del = await Event.deleteMany({});
  console.log('Deleted documents:', del.deletedCount);

  const events = [
    {
      title: 'Sunset Jazz in the Park',
      subtitle: 'An evening of smooth jazz by the riverside',
      category: 'Live Music',
      location: 'Riverside Park',
      address: '123 River Walk',
      date: new Date('2026-06-15T19:30:00Z'),
      description: 'Join us for a magical evening of jazz under the sunset.',
      images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80&auto=format&fit=crop'],
      ticket_types: [
        { name: 'General Admission', description: 'Open seating', price: 25, available: 50, total: 120 },
        { name: 'VIP Seating', description: 'Reserved seat', price: 75, available: 10, total: 20 }
      ]
    },
    {
      title: 'Tech Talks: AI & Ethics',
      subtitle: 'Conversations on responsible AI',
      category: 'Conference',
      location: 'Convention Center',
      address: '500 Convention Ave',
      date: new Date('2026-07-03T14:00:00Z'),
      description: 'A half-day series of talks from researchers and industry leaders.',
      images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=80&auto=format&fit=crop'],
      ticket_types: [
        { name: 'Standard', description: 'Access to all talks', price: 0, available: 200, total: 300 },
        { name: 'Student', description: 'Discount', price: 0, available: 50, total: 100 }
      ]
    }
  ];

  console.log('Inserting events...');
  const inserted = await Event.insertMany(events);
  console.log('Inserted count:', inserted.length);
  inserted.forEach((doc, idx) => {
    console.log(`${idx + 1}) id=${doc._id} title=${doc.title}`);
  });

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});