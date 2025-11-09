import React, { useState, useMemo } from "react";
import { MapPin, Calendar, Clock, Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EventListingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  const events = [
    {
      id: 1,
      title: "Summer Music Festival 2025",
      location: "New York",
      date: "2025-06-15",
      time: "18:00",
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&h=600&fit=crop",
      price: 89,
      totalSeats: 500,
      bookedSeats: 450,
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      location: "San Francisco",
      date: "2025-07-20",
      time: "09:00",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=600&fit=crop",
      price: 199,
      totalSeats: 300,
      bookedSeats: 275,
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      location: "Los Angeles",
      date: "2025-08-10",
      time: "12:00",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&h=600&fit=crop",
      price: 75,
      totalSeats: 200,
      bookedSeats: 180,
    },
    {
      id: 4,
      title: "Art Gallery Exhibition",
      location: "Chicago",
      date: "2025-07-05",
      time: "10:00",
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1000&h=600&fit=crop",
      price: 35,
      totalSeats: 150,
      bookedSeats: 45,
    },
  ];

  const locations = ["All", ...new Set(events.map((e) => e.location))];
  const dates = ["All", ...new Set(events.map((e) => e.date))];

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedLocation === "All" || event.location === selectedLocation;
      const matchesDate = selectedDate === "All" || event.date === selectedDate;
      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [searchQuery, selectedLocation, selectedDate]);

  // Helper: seat availability
  const getSeatStatus = (totalSeats, bookedSeats) => {
    const available = totalSeats - bookedSeats;
    if (available <= 0) return { text: "Sold Out", color: "text-red-600" };
    if (available < 20) return { text: `Only ${available} left!`, color: "text-orange-500" };
    return { text: `${available} available`, color: "text-green-600" };
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
          {/* Search */}
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

          {/* Location Filter */}
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

          {/* Date Filter */}
          <div>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date === "All" ? "All Dates" : date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {filteredEvents.map((event) => {
              const seatInfo = getSeatStatus(event.totalSeats, event.bookedSeats);

              return (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-purple-600">
                      {event.location}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className={seatInfo.color}>{seatInfo.text}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-3">
                      <p className="text-lg font-semibold text-gray-800">
                        ${event.price}
                      </p>
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
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
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-20">
            No events found. Try adjusting your filters or search.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingPage;
