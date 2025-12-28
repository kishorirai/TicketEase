import React, { useState, useMemo, useEffect } from "react";
import { 
  MapPin, Calendar, Clock, Users, Search, ChevronLeft, ChevronRight,
  X, Star, TrendingUp, Heart, Grid, List, SlidersHorizontal,
  Sparkles, Zap, Tag, DollarSign, ArrowUpDown, Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "./api";

const EventListingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [likedEvents, setLikedEvents] = useState([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // ===== HELPER FUNCTIONS =====
  
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
      return { date:   "Invalid Date", time: "" };
    }
  };

  const getMinPrice = (event) => {
    if (!event.ticket_types || event.ticket_types.length === 0) {
      return event.price || 0;
    }
    return Math.min(... event.ticket_types.map(t => t.price));
  };

  const matchesPriceRange = (event, range) => {
    if (range === "All") return true;
    const price = getMinPrice(event);
    
    if (range === "free") return price === 0;
    if (range === "0-50") return price > 0 && price <= 50;
    if (range === "50-100") return price > 50 && price <= 100;
    if (range === "100-200") return price > 100 && price <= 200;
    if (range === "200+") return price > 200;
    return true;
  };

  const getAvailableSeats = (event) => {
    if (event.ticket_types && event. ticket_types.length > 0) {
      return event.ticket_types.reduce((sum, t) => sum + (t.available || 0), 0);
    }
    return event.available_seats || 0;
  };

  const getSeatStatus = (event) => {
    const available = getAvailableSeats(event);
    
    if (available <= 0) return { text: "Sold Out", color: "text-red-600", bgColor: "bg-red-100" };
    if (available < 20) return { text: `Only ${available} left! `, color: "text-orange-600", bgColor: "bg-orange-100" };
    return { text: `${available} available`, color: "text-green-600", bgColor: "bg-green-100" };
  };

  const isHappeningSoon = (dateString) => {
    if (!dateString) return false;
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

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

  const toggleLike = (eventId) => {
    setLikedEvents(prev => {
      const newLiked = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem("likedEvents", JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("All");
    setSelectedDate("All");
    setSelectedCategory("All");
    setPriceRange("All");
    setSortBy("date");
  };

  // ===== USE EFFECTS =====

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("likedEvents") || "[]");
    setLikedEvents(saved);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchEvents();
        const eventsArray = Array.isArray(data) ? data : (data.events || []);
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

  // ===== MEMOIZED VALUES =====

  const cities = useMemo(
    () => ["All", ... Array.from(new Set(events. map((e) => e.city).filter(Boolean)))].sort(),
    [events]
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))],
    [events]
  );

  const dates = useMemo(() => {
    const uniqueDates = Array.from(new Set(events. map((e) => e.date).filter(Boolean)));
    const formattedDates = uniqueDates.map(d => ({
      value: d,
      label: formatDateTime(d).date
    }));
    return [{ value: "All", label: "All Dates" }, ...formattedDates];
  }, [events]);

  const priceRanges = [
    { value: "All", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200+", label:  "$200+" }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events. filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCity =
        selectedCity === "All" || event.city === selectedCity;
      const matchesDate = selectedDate === "All" || event.date === selectedDate;
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesPrice = matchesPriceRange(event, priceRange);
      
      return matchesSearch && matchesCity && matchesDate && matchesCategory && matchesPrice;
    });

    filtered. sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "price-low":
          return getMinPrice(a) - getMinPrice(b);
        case "price-high":
          return getMinPrice(b) - getMinPrice(a);
        case "popular":
          return (b.reviews || 0) - (a.reviews || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, selectedCity, selectedDate, selectedCategory, priceRange, sortBy]);

  const activeFiltersCount = [
    searchQuery,
    selectedCity !== "All",
    selectedDate !== "All",
    selectedCategory !== "All",
    priceRange !== "All"
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg: px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Search Bar and Controls */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 mb-6 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Long Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, venues, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus: ring-2 focus:ring-purple-500 outline-none text-sm bg-white hover:border-gray-300 transition-all"
              >
                <option value="date">📅 Date</option>
                <option value="price-low">💰 Price:  Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(! showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity:  1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target. value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                      </label>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e. target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus: ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        {dates.map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        Price Range
                      </label>
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus: ring-purple-500 outline-none text-sm"
                      >
                        {priceRanges.map((range) => (
                          <option key={range.value} value={range. value}>
                            {range. label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex items-center justify-between">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-semibold hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                        Clear all filters
                      </button>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      Showing {filteredEvents.length} of {events.length} events
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info - Only show when not loading */}
        {!loading && ! showFilters && (
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-purple-600">{filteredEvents.length}</span> of{" "}
              <span className="font-bold">{events.length}</span> events
            </p>
          </div>
        )}

        {/* Events Display */}
        {loading ?  (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
            </div>
            <p className="text-lg text-gray-600 mt-4 font-semibold">Loading events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Events</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length > 0 ? (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    index={index}
                    currentImageIndex={currentImageIndex}
                    nextImage={nextImage}
                    prevImage={prevImage}
                    getSeatStatus={getSeatStatus}
                    formatDateTime={formatDateTime}
                    getMinPrice={getMinPrice}
                    isHappeningSoon={isHappeningSoon}
                    likedEvents={likedEvents}
                    toggleLike={toggleLike}
                    navigate={navigate}
                  />
                ))}
              </motion. div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredEvents.map((event, index) => (
                  <EventListItem
                    key={event._id}
                    event={event}
                    index={index}
                    getSeatStatus={getSeatStatus}
                    formatDateTime={formatDateTime}
                    getMinPrice={getMinPrice}
                    isHappeningSoon={isHappeningSoon}
                    likedEvents={likedEvents}
                    toggleLike={toggleLike}
                    navigate={navigate}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover: from-purple-700 hover: to-blue-700 transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Event Card Component (Grid View) - Shows both City and Location
const EventCard = ({
  event,
  index,
  currentImageIndex,
  nextImage,
  prevImage,
  getSeatStatus,
  formatDateTime,
  getMinPrice,
  isHappeningSoon,
  likedEvents,
  toggleLike,
  navigate
}) => {
  const seatInfo = getSeatStatus(event);
  const images = event.images && event.images.length > 0 
    ? event.images 
    : ["https://via.placeholder.com/600x400? text=Event+Image"];
  const currentIndex = currentImageIndex[event._id] || 0;
  const { date:  displayDate, time: displayTime } = formatDateTime(event.date);
  const minPrice = getMinPrice(event);
  const isLiked = likedEvents.includes(event._id);

  return (
    <motion. div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={event.title || "Event"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/600x400?text=Event+Image";
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e. stopPropagation();
                prevImage(event._id, images.length);
              }}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-1. 5 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(event._id, images. length);
              }}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Compact Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {event.category && (
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {event.category}
            </span>
          )}
          {isHappeningSoon(event. date) && (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Soon
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(event._id);
          }}
          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isLiked ? "fill-red-500 text-red-500" :  "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Compact Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {event.title || "Untitled Event"}
        </h3>

        {event.subtitle && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">
            {event.subtitle}
          </p>
        )}

        {/* Event Info */}
        <div className="space-y-1. 5 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{displayDate}</span>
            <Clock className="w-3.5 h-3.5 text-green-500 ml-2 flex-shrink-0" />
            <span>{displayTime}</span>
          </div>
          
          {/* City */}
          {event.city && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium truncate">{event.city}</span>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-600 truncate">{event.location}</span>
            </div>
            <span className={`${seatInfo.color} font-semibold text-xs whitespace-nowrap`}>
              {seatInfo.text. split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Rating */}
        {event.rating && event.reviews > 0 && (
          <div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(event.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      :  "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {event.rating} <span className="text-gray-500">({event.reviews})</span>
            </span>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {minPrice === 0 ? "Free" : `$${minPrice}`}
            </p>
          </div>
          <button
            disabled={seatInfo.text === "Sold Out"}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              seatInfo.text === "Sold Out"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {seatInfo.text === "Sold Out" ? "Sold Out" : "Book"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Event List Item Component (List View) - Shows both City and Location
const EventListItem = ({
  event,
  index,
  getSeatStatus,
  formatDateTime,
  getMinPrice,
  isHappeningSoon,
  likedEvents,
  toggleLike,
  navigate
}) => {
  const seatInfo = getSeatStatus(event);
  const images = event.images && event.images.length > 0 
    ? event.images 
    :  ["https://via.placeholder.com/400x300?text=Event+Image"];
  const { date: displayDate, time: displayTime } = formatDateTime(event. date);
  const minPrice = getMinPrice(event);
  const isLiked = likedEvents.includes(event._id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x:  0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
          <img
            src={images[0]}
            alt={event.title || "Event"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e. target.src = "https://via.placeholder.com/400x300?text=Event+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {event. category && (
              <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {event.category}
              </span>
            )}
            {isHappeningSoon(event.date) && (
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Soon
              </span>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(event._id);
            }}
            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isLiked ? "fill-red-500 text-red-500" :  "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              {event.title || "Untitled Event"}
            </h3>
            {event.subtitle && (
              <p className="text-sm text-gray-600 mb-3">{event.subtitle}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">{displayDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{displayTime}</span>
              </div>
              {event.city && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{event.city}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700">{event.location || "TBA"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className={`w-4 h-4 ${seatInfo.color} flex-shrink-0`} />
                <span className={`${seatInfo.color} font-semibold`}>{seatInfo.text}</span>
              </div>
            </div>

            {/* Rating */}
            {event.rating && event.reviews > 0 && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3. 5 h-3.5 ${
                        i < Math. floor(event.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {event. rating} <span className="text-gray-500">({event.reviews})</span>
                </span>
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {minPrice === 0 ? "Free" : `$${minPrice}`}
              </p>
            </div>
            <button
              disabled={seatInfo.text === "Sold Out"}
              className={`px-6 py-2. 5 rounded-xl font-bold transition-all ${
                seatInfo.text === "Sold Out"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {seatInfo.text === "Sold Out" ? "Sold Out" : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform:  translate(50px, 50px) scale(1.05); }
  }
  
  . animate-blob {
    animation: blob 7s infinite;
  }
  
  . animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay:  4s;
  }
`;
document.head.appendChild(style);

export default EventListingPage;