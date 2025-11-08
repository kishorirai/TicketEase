import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    totalSeats: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  // Simulated API calls - replace with actual API endpoints
  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    // Simulated data - replace with: fetch('/api/events')
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Tech Conference 2025',
          description: 'Annual technology conference featuring industry leaders',
          date: '2025-12-15',
          time: '09:00',
          venue: 'Convention Center',
          totalSeats: 500,
          availableSeats: 320,
          price: 299.99,
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
        },
        {
          id: 2,
          title: 'Music Festival',
          description: 'Three-day music festival with top artists',
          date: '2025-11-20',
          time: '14:00',
          venue: 'Central Park',
          totalSeats: 1000,
          availableSeats: 450,
          price: 149.99,
          category: 'Music',
          imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const fetchBookings = async () => {
    // Simulated data - replace with: fetch('/api/admin/bookings')
    setTimeout(() => {
      setBookings([
        {
          id: 1,
          bookerName: 'John Doe',
          email: 'john@example.com',
          eventId: 1,
          eventTitle: 'Tech Conference 2025',
          quantity: 2,
          totalAmount: 599.98,
          status: 'Confirmed',
          bookingDate: '2025-11-01'
        },
        {
          id: 2,
          bookerName: 'Jane Smith',
          email: 'jane@example.com',
          eventId: 2,
          eventTitle: 'Music Festival',
          quantity: 4,
          totalAmount: 599.96,
          status: 'Confirmed',
          bookingDate: '2025-11-02'
        },
        {
          id: 3,
          bookerName: 'Mike Johnson',
          email: 'mike@example.com',
          eventId: 1,
          eventTitle: 'Tech Conference 2025',
          quantity: 1,
          totalAmount: 299.99,
          status: 'Pending',
          bookingDate: '2025-11-03'
        }
      ]);
    }, 500);
  };

  const handleCreateEvent = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Replace with actual API call: POST /api/admin/events
    const newEvent = {
      id: events.length + 1,
      ...eventForm,
      totalSeats: parseInt(eventForm.totalSeats),
      availableSeats: parseInt(eventForm.totalSeats),
      price: parseFloat(eventForm.price)
    };
    
    setTimeout(() => {
      setEvents([...events, newEvent]);
      resetForm();
      setLoading(false);
      alert('Event created successfully!');
    }, 500);
  };

  const handleUpdateEvent = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Replace with actual API call: PUT /api/admin/events/:id
    setTimeout(() => {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventForm, totalSeats: parseInt(eventForm.totalSeats), price: parseFloat(eventForm.price) }
          : event
      ));
      resetForm();
      setLoading(false);
      alert('Event updated successfully!');
    }, 500);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    setLoading(true);
    // Replace with actual API call: DELETE /api/admin/events/:id
    setTimeout(() => {
      setEvents(events.filter(event => event.id !== eventId));
      setLoading(false);
      alert('Event deleted successfully!');
    }, 500);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      totalSeats: event.totalSeats.toString(),
      price: event.price.toString(),
      category: event.category,
      imageUrl: event.imageUrl || ''
    });
    setShowEventForm(true);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      totalSeats: '',
      price: '',
      category: '',
      imageUrl: ''
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const filteredBookings = selectedEventFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.eventId === parseInt(selectedEventFilter));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-purple-200">Manage events and track bookings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-purple-500/30">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'events'
                ? 'text-white border-b-2 border-purple-400'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Event Management
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'text-white border-b-2 border-purple-400'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Bookings Tracking
          </button>
        </div>

        {/* Events Management */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Events</h2>
              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Create New Event
              </button>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {editingEvent ? 'Edit Event' : 'Create New Event'}
                    </h3>
                    <button onClick={resetForm} className="text-purple-300 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-purple-200 mb-2">Title *</label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2">Description *</label>
                        <textarea
                          required
                          value={eventForm.description}
                          onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                          rows="3"
                          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 mb-2">Date *</label>
                          <input
                            type="date"
                            required
                            value={eventForm.date}
                            onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2">Time *</label>
                          <input
                            type="time"
                            required
                            value={eventForm.time}
                            onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2">Venue *</label>
                        <input
                          type="text"
                          required
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 mb-2">Total Seats *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={eventForm.totalSeats}
                            onChange={(e) => setEventForm({...eventForm, totalSeats: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-purple-200 mb-2">Price ($) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={eventForm.price}
                            onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2">Category *</label>
                        <input
                          type="text"
                          required
                          value={eventForm.category}
                          onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-200 mb-2">Image URL</label>
                        <input
                          type="url"
                          value={eventForm.imageUrl}
                          onChange={(e) => setEventForm({...eventForm, imageUrl: e.target.value})}
                          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Save size={20} />
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="grid gap-4">
              {loading && events.length === 0 ? (
                <div className="text-center text-purple-300 py-12">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center text-purple-300 py-12">No events found. Create your first event!</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex gap-6">
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                            <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded">
                              {event.category}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditForm(event)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-purple-200 mb-3">{event.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-purple-300">Date:</span>
                            <p className="text-white font-semibold">{event.date}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Time:</span>
                            <p className="text-white font-semibold">{event.time}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Venue:</span>
                            <p className="text-white font-semibold">{event.venue}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Price:</span>
                            <p className="text-white font-semibold">${event.price}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Total Seats:</span>
                            <p className="text-white font-semibold">{event.totalSeats}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Available:</span>
                            <p className="text-white font-semibold">{event.availableSeats}</p>
                          </div>
                          <div>
                            <span className="text-purple-300">Booked:</span>
                            <p className="text-white font-semibold">{event.totalSeats - event.availableSeats}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bookings Tracking */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Bookings</h2>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-purple-300" />
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="text-left text-purple-300 px-6 py-4">Booking ID</th>
                      <th className="text-left text-purple-300 px-6 py-4">Booker Name</th>
                      <th className="text-left text-purple-300 px-6 py-4">Email</th>
                      <th className="text-left text-purple-300 px-6 py-4">Event</th>
                      <th className="text-left text-purple-300 px-6 py-4">Quantity</th>
                      <th className="text-left text-purple-300 px-6 py-4">Total Amount</th>
                      <th className="text-left text-purple-300 px-6 py-4">Status</th>
                      <th className="text-left text-purple-300 px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-purple-300 py-12">
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map(booking => (
                        <tr key={booking.id} className="border-t border-slate-700 hover:bg-slate-750">
                          <td className="px-6 py-4 text-white">#{booking.id}</td>
                          <td className="px-6 py-4 text-white font-semibold">{booking.bookerName}</td>
                          <td className="px-6 py-4 text-purple-200">{booking.email}</td>
                          <td className="px-6 py-4 text-white">{booking.eventTitle}</td>
                          <td className="px-6 py-4 text-white">{booking.quantity}</td>
                          <td className="px-6 py-4 text-white font-semibold">${booking.totalAmount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'Confirmed' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-purple-200">{booking.bookingDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bookings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-purple-300 mb-2">Total Bookings</h3>
                <p className="text-3xl font-bold text-white">{filteredBookings.length}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-purple-300 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-white">
                  ${filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-purple-300 mb-2">Total Tickets Sold</h3>
                <p className="text-3xl font-bold text-white">
                  {filteredBookings.reduce((sum, b) => sum + b.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;