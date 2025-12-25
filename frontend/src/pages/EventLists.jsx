import React, { useState, useMemo, useEffect } from "react";
import { MapPin, Calendar, Clock, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "./api";

const EventListingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track current image index per event for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Fetch events from backend
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchEvents();
        // Handle both array response and object with data property
        const eventsArray = Array.isArray(data) ? data : (data. events || []);
        setEvents(eventsArray);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Error loading events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Generate filter options from actual data
  const locations = useMemo(
    () => ["All", ... Array.from(new Set(events. map((e) => e.location).filter(Boolean)))],
    [events]
  );

  const dates = useMemo(
    () => ["All", ...Array.from(new Set(events.map((e) => e.date).filter(Boolean)))],
    [events]
  );

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedLocation === "All" || event.location === selectedLocation;
      const matchesDate = selectedDate === "All" || event.date === selectedDate;
      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, searchQuery, selectedLocation, selectedDate]);

  // Seat availability helper
  const getSeatStatus = (event) => {
    const total = event.total_seats || 0;
    const available = event.available_seats || 0;
    
    if (available <= 0) return { text: "Sold Out", color: "text-red-600" };
    if (available < 20) return { text: `Only ${available} left! `, color: "text-orange-500" };
    return { text:  `${available} available`, color: "text-green-600" };
  };

  // Handle carousel navigation
  const nextImage = (eventId, length) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) + 1) % length,
    }));
  };

  const prevImage = (eventId, length) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) - 1 + length) % length,
    }));
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "TBA", time: "TBA" };
    
    try {
      const eventDate = new Date(dateString);
      const displayDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const displayTime = eventDate.toLocaleTimeString('en-US', { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      return { date: displayDate, time: displayTime };
    } catch (err) {
      return { date: "Invalid Date", time: "" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center mb-12">
          Discover{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Exciting Events
          </span>
        </h1>

        {/* Search + Filters */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative col-span-1 md:col-span-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Locations" : loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date === "All" ?  "All Dates" : formatDateTime(date).date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading/Error/Events Grid */}
        {loading ?  (
          <div className="text-center text-lg text-gray-600">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p>Loading events…</p>
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-lg text-red-600 font-medium mb-2">Error Loading Events</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden:  { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
            }}
          >
            {filteredEvents.map((event) => {
              const seatInfo = getSeatStatus(event);
              const images = event.images && event.images.length > 0 
                ? event.images 
                : ["https://via.placeholder.com/600x400? text=Event+Image"];
              const currentIndex = currentImageIndex[event._id] || 0;
              const { date: displayDate, time: displayTime } = formatDateTime(event.date);

              return (
                <motion. div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <img
                      src={images[currentIndex]}
                      alt={event.title || "Event"}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/600x400?text=Event+Image";
                      }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(event._id, images.length);
                          }}
                          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(event._id, images.length);
                          }}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-800" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-2 rounded-full transition-all ${
                                idx === currentIndex 
                                  ? "w-6 bg-white" 
                                  : "w-2 bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {event.location && (
                      <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-purple-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                    {event.category && (
                      <div className="absolute top-3 left-3 bg-blue-500/90 px-3 py-1 rounded-full text-sm font-medium text-white">
                        {event.category}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {event.title || "Untitled Event"}
                    </h3>

                    {event.subtitle && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {event.subtitle}
                      </p>
                    )}

                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {displayDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {displayTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className={seatInfo.color}>{seatInfo.text}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {event.price > 0 ? `$${event.price}` : "Free"}
                        </p>
                        {event.ticket_types && event.ticket_types.length > 1 && (
                          <p className="text-xs text-gray-500">
                            {event.ticket_types.length} ticket types
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        disabled={seatInfo.text === "Sold Out"}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          seatInfo.text === "Sold Out"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        {seatInfo.text === "Sold Out" ? "Sold Out" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </motion. div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-20 bg-white/50 rounded-2xl p-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium mb-2">No events found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingPage;