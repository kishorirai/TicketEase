import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, Clock, MapPin, Star, Users } from "lucide-react";
import { fetchEvents } from "../pages/api";

export default function EventsScheduleSection() {
  const navigate = useNavigate();
  const [eventsSchedule, setEventsSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchEvents();
        const allEvents = Array.isArray(response) ? response : (response. events || []);

        // Transform and filter events for schedule
        // Sort by date and take upcoming events
        const upcomingEvents = allEvents
          .filter(event => event.  date && new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5); // Take top 5 upcoming events

        // Transform events to schedule format
        const transformedEvents = upcomingEvents.  map((event, index) => ({
          id: event._id,
          time: formatEventTime(event.date),
          title: event.title || 'Untitled Event',
          description: event.subtitle || event.description?.substring(0, 100) || 'Experience an amazing event.',
          performers: getPerformers(event),
          category: event.category,
          location: event.city || event.location,
          rating: event.rating,
          reviews: event.reviews,
          price: getMinPrice(event),
          image: event.images && event.images.  length > 0 ? event.  images[0] : null
        }));

        setEventsSchedule(transformedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error loading events schedule:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Helper function to format event date/time
  const formatEventTime = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return 'TBA';
    }
  };

  // Helper function to get performers/organizers
  const getPerformers = (event) => {
    const performers = [];
    
    if (event.organizer) {
      performers.push(event.organizer);
    }
    
    // If no organizer, use category or location as performer
    if (performers.length === 0) {
      if (event.category) performers.push(event.category);
      if (event.location && performers.length < 2) performers.push(event.location);
    }
    
    return performers. length > 0 ? performers : ['Featured Event'];
  };

  // Helper function to get minimum price
  const getMinPrice = (event) => {
    if (event.ticket_types && event.ticket_types.length > 0) {
      return Math. min(...event.ticket_types. map(t => t.price));
    }
    return event.price || 0;
  };

  // Navigate to event details
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Navigate to events listing
  const handleReserveSeats = () => {
    navigate('/events');
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-black text-white min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-400">Loading event schedule...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-black text-white min-h-screen py-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold mb-2">Failed to load schedule</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No events state
  if (eventsSchedule.length === 0) {
    return (
      <section className="bg-black text-white min-h-screen py-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Calendar className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
          <p className="text-gray-400 mb-6">Check back soon for new events!</p>
          <button
            onClick={handleReserveSeats}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Browse All Events
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 px-6 py-3 rounded-full mb-6 border border-yellow-400/20">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Upcoming Events</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Event Schedule
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't miss out on these amazing upcoming events happening soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left Column:  Schedule Cards - REDUCED SIZE */}
          <div className="relative">
            {eventsSchedule.map((event, index) => (
              <div
                key={event.  id}
                className="sticky top-24 mb-6 cursor-pointer"
                style={{ zIndex: index + 10 }}
                onClick={() => handleEventClick(event.id)}
              >
                <div
                  className="bg-gray-900 border-2 border-yellow-400 rounded-xl p-5 shadow-2xl hover:shadow-yellow-400/20 hover:scale-105 transition-all duration-300 max-w-md mx-auto lg:mx-0 group"
                  style={{
                    transform: `translateY(${index * 10}px) scale(${1 - index * 0.03})`,
                  }}
                >
                  {/* Category Badge */}
                  {event.category && (
                    <div className="inline-block px-2. 5 py-0.5 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-xs font-bold mb-2">
                      {event.category}
                    </div>
                  )}

                  {/* Time and Title */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1. 5 text-yellow-400 text-xs font-bold mb-1.5">
                      <Clock className="w-3. 5 h-3.5" />
                      {event.time}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Location and Rating - Compact Row */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    
                    {event.rating && event.reviews > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold">{event.rating}</span>
                        <span className="text-gray-400">({event.reviews})</span>
                      </div>
                    )}
                  </div>

                  {/* Performers - Compact */}
                  {event.performers. length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {event.performers.  slice(0, 2).map((p, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-white bg-yellow-500 bg-opacity-20 px-2. 5 py-1 rounded-full border border-yellow-500/30 font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and CTA - Compact */}
                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-xs">From</div>
                      <div className="text-xl font-black text-yellow-400">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.id);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-600 text-white rounded-lg font-bold text-sm hover:scale-105 transition-all shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-64"></div>
          </div>

          {/* Right Column: CTA - Slightly Reduced */}
          <div className="md:sticky md:top-28 flex flex-col items-start justify-start pt-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6">
                
                <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                  Organize Your Schedule
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  Choose your favorite events and reserve your place now. Stay updated on schedules and featured performers effortlessly.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-yellow-400 mb-0.5">
                    {eventsSchedule.  length}
                  </div>
                  <div className="text-gray-400 text-xs">Upcoming Events</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-pink-500 mb-0.5">
                    {eventsSchedule. reduce((sum, e) => sum + (e.reviews || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-xs">Total Reviews</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleReserveSeats}
                  className="w-full bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-6 py-3.5 rounded-xl font-bold text-base hover:from-yellow-500 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Reserve Your Seats
                </button>
                
              </div>

              {/* Features */}
              <div className="mt-6 space-y-2. 5">
                <div className="flex items-center gap-2.5 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Real-time seat availability</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Secure payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}