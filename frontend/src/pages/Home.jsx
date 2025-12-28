import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles, Star, Search, Loader2, X, TrendingUp, Clock, Navigation, Calendar, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedEvents, fetchCities, fetchEvents } from "./api";

import AgendaSection from "../components/Agenda";
import ConferenceFeaturedSection from "../components/FeaturedSection";

export default function ConferenceLanding() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for backend data
  const [slides, setSlides] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New features state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState({
    cities: [],
    events:   [],
    categories: [],
    locations: []
  });

  // Popular searches (can be dynamic from backend)
  const popularSearches = [
    "New York", "Los Angeles", "Chicago", "San Francisco", "Austin"
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [featuredEvents, citiesData, eventsData] = await Promise.all([
          fetchFeaturedEvents(5),
          fetchCities(),
          fetchEvents() // Fetch all events for multi-criteria search
        ]);
        
        const transformedSlides = featuredEvents.map((event, index) => ({
          image: event.images && event.images.length > 0 
            ? event.images[0] 
            : `https://images.unsplash.com/photo-${1470229722913 + index * 1000000}?w=1920&h=800&fit=crop`,
          eventName: event.title || "Event",
          tagline: event.subtitle || (event.description ?    event.description.substring(0, 100) : "Experience the moment"),
          gradient: getGradientForIndex(index),
          eventId:   event._id
        }));

        setAllCities(citiesData);
        setAllEvents(Array.isArray(eventsData) ? eventsData : (eventsData. events || []));
        setSlides(transformedSlides);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGradientForIndex = (index) => {
    const gradients = [
      "from-purple-900/60 via-pink-900/40 to-transparent",
      "from-red-900/60 via-orange-900/40 to-transparent",
      "from-blue-900/60 via-indigo-900/40 to-transparent",
      "from-cyan-900/60 via-teal-900/40 to-transparent",
      "from-emerald-900/60 via-green-900/40 to-transparent"
    ];
    return gradients[index % gradients.length];
  };

  const speakerSectionStart = 400;
  const speakerOpacity = Math.min((scrollY - speakerSectionStart) / 200, 1);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  // Navigate to event detail page
  const handleSlideClick = (eventId) => {
    if (eventId) {
      navigate(`/events/${eventId}`);
    }
  };

  // Geolocation Detection
  const detectUserLocation = async () => {
    setDetectingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding API to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const detectedCity = data.city || data.locality || data.principalSubdivision;
            
            setUserLocation(detectedCity);
            setSearchQuery(detectedCity);
            setDetectingLocation(false);
            
            // Save to search history
            addToSearchHistory(detectedCity);
            
            // Navigate to events page with detected city
            handleNavigateToEvents(detectedCity, 'city');
          } catch (error) {
            console.error("Error getting city name:", error);
            setDetectingLocation(false);
            alert("Could not detect your city. Please search manually.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setDetectingLocation(false);
          alert("Location access denied. Please enable location services.");
        }
      );
    } else {
      setDetectingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Add to search history
  const addToSearchHistory = (query) => {
    if (!query. trim()) return;
    
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Clear search history
  const clearSearchHistory = () => {
    localStorage. removeItem("searchHistory");
    setSearchHistory([]);
  };

  // Multi-criteria search function
  const performMultiCriteriaSearch = (query) => {
    if (!query.trim()) {
      setSuggestions({ cities: [], events: [], categories:   [], locations: [] });
      return;
    }

    const searchTerm = query.toLowerCase();

    // Search in cities
    const cityMatches = allCities.filter(city =>
      city.name.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search in events (by title)
    const eventMatches = allEvents.filter(event =>
      event.title?. toLowerCase().includes(searchTerm) ||
      event.subtitle?.toLowerCase().includes(searchTerm) ||
      event.organizer?.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search in categories
    const allCategories = [...new Set(allEvents.map(e => e.category).filter(Boolean))];
    const categoryMatches = allCategories.filter(category =>
      category.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    // Search in locations (venues)
    const allLocations = [...new Set(allEvents.map(e => e. location).filter(Boolean))];
    const locationMatches = allLocations.filter(location =>
      location.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    setSuggestions({
      cities: cityMatches,
      events: eventMatches,
      categories: categoryMatches,
      locations: locationMatches
    });
  };

  // Handle search input change with autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value. trim()) {
      performMultiCriteriaSearch(value);
      setShowSuggestions(true);
    } else {
      setSuggestions({ cities: [], events: [], categories:  [], locations: [] });
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = (query) => {
    if (query.trim()) {
      addToSearchHistory(query);
      setSearchQuery(query);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (value, type) => {
    setSearchQuery(value);
    addToSearchHistory(value);
    setShowSuggestions(false);
    
    if (type === 'event') {
      // Navigate to specific event
      const event = allEvents.find(e => e. title === value);
      if (event) {
        navigate(`/events/${event._id}`);
      }
    } else if (type === 'city') {
      handleNavigateToEvents(value, 'city');
    } else if (type === 'category') {
      handleNavigateToEvents(value, 'category');
    } else if (type === 'location') {
      handleNavigateToEvents(value, 'location');
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSuggestions({ cities: [], events:  [], categories: [], locations: [] });
    setShowSuggestions(false);
    setUserLocation(null);
  };

  // Navigation handlers
  const handleNavigateToEvents = (value = null, filterType = null) => {
    if (value && filterType) {
      navigate(`/events?${filterType}=${encodeURIComponent(value)}`);
    } else {
      navigate('/events');
    }
  };

  // Check if we have any suggestions
  const hasSuggestions = suggestions.cities.length > 0 || 
                        suggestions.events.length > 0 || 
                        suggestions. categories.length > 0 || 
                        suggestions.locations. length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
     

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {slides.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
            <p className="text-white text-2xl">No featured events available</p>
          </div>
        ) : (
          <>
            <div className="relative h-full">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 cursor-pointer ${
                    currentSlide === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                  }`}
                  onClick={() => handleSlideClick(slide.eventId)}
                >
                  <div className="absolute inset-0">
                    <img
                      src={slide.image}
                      alt={slide.eventName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=800&fit=crop';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  </div>

                  <div className="absolute inset-0 flex items-end justify-start p-8 md:p-16 z-20">
                    <div className="max-w-4xl space-y-6">
                      <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                        <span className="text-white text-sm font-semibold">Featured Event</span>
                      </div>
                      <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight"
                        style={{
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(255,255,255,0.1)",
                          animation: currentSlide === index ? "slideUp 0.8s ease-out" : "none"
                        }}
                      >
                        {slide.eventName}
                      </h1>
                      <p 
                        className="text-xl md:text-2xl text-white/90 font-light"
                        style={{
                          animation: currentSlide === index ? "slideUp 0.8s ease-out 0.2s both" : "none"
                        }}
                      >
                        {slide.tagline}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlideClick(slide.eventId);
                        }}
                        className="mt-6 px-8 py-4 bg-white text-black font-bold rounded-full hover: bg-gray-100 transition-all hover: scale-105 shadow-xl"
                        style={{
                          animation: currentSlide === index ? "slideUp 0.8s ease-out 0.4s both" :   "none"
                        }}
                      >
                        Explore Events
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 hover:scale-110 transition-all border border-white/20 group"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 hover:scale-110 transition-all border border-white/20 group"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentSlide === index 
                          ? "bg-white w-12 shadow-lg shadow-white/50" 
                          :  "bg-white/40 w-2 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(40px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25);
        }
      `}</style>

      {/* Search Section */}
      <section
        className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0a1520] to-[#0f0518]"
        style={{ opacity: speakerOpacity }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
        </div>

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-3 rounded-full mb-6 glass-effect">
              <Search className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold">Find Your Perfect Event</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Search Events, Cities & More
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
              Discover events by name, city, venue, category, or organizer
            </p>

            {/* Enhanced Search Bar with Multi-Criteria Autocomplete */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                {/* Main Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by event name, city, venue, category, or organizer..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchQuery.trim() || searchHistory.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="w-full pl-16 pr-32 py-5 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 text-lg"
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {/* Clear All Button */}
                    {searchQuery && (
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
                        title="Clear all filters"
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </button>
                    )}
                    
                    {/* Geolocation Button */}
                    <button
                      onClick={detectUserLocation}
                      disabled={detectingLocation}
                      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
                      title="Detect my location"
                    >
                      {detectingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      {detectingLocation ? 'Detecting...' : 'Near Me'}
                    </button>
                  </div>
                </div>

                {/* Multi-Criteria Autocomplete Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border-2 border-white/10 rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-y-auto">
                    {/* Search History */}
                    {searchHistory.length > 0 && ! searchQuery && (
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                            <Clock className="w-4 h-4" />
                            Recent Searches
                          </div>
                          <button
                            onClick={clearSearchHistory}
                            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                          >
                            Clear All
                          </button>
                        </div>
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(item);
                              performMultiCriteriaSearch(item);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg transition-all flex items-center gap-3 text-white"
                          >
                            <Clock className="w-4 h-4 text-gray-500" />
                            {item}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multi-Criteria Suggestions */}
                    {searchQuery && hasSuggestions && (
                      <>
                        {/* Events */}
                        {suggestions.events.length > 0 && (
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
                              <Calendar className="w-4 h-4" />
                              Events
                            </div>
                            {suggestions.events.map((event, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(event. title, 'event')}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-all group"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                                      {event.title}
                                    </p>
                                    {event.subtitle && (
                                      <p className="text-gray-500 text-xs mt-1">{event.subtitle}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                      {event.city && (
                                        <span className="text-xs text-gray-400">{event. city}</span>
                                      )}
                                      {event. category && (
                                        <span className="text-xs text-purple-400">• {event.category}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Cities */}
                        {suggestions.cities.length > 0 && (
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
                              <MapPin className="w-4 h-4" />
                              Cities
                            </div>
                            {suggestions.cities.map((city, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(city. name, 'city')}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-all flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-blue-400" />
                                  <span className="text-white font-medium group-hover:text-purple-400 transition-colors">{city.name}</span>
                                </div>
                                <span className="text-gray-500 text-sm group-hover:text-purple-400 transition-colors">
                                  {city.events} events
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Categories */}
                        {suggestions. categories.length > 0 && (
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
                              <Tag className="w-4 h-4" />
                              Categories
                            </div>
                            {suggestions.categories.map((category, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(category, 'category')}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-all flex items-center gap-3 group"
                              >
                                <Tag className="w-4 h-4 text-green-400" />
                                <span className="text-white font-medium group-hover:text-purple-400 transition-colors">{category}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Locations (Venues) */}
                        {suggestions.locations.length > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
                              <MapPin className="w-4 h-4" />
                              Venues
                            </div>
                            {suggestions.locations.map((location, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(location, 'location')}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-all flex items-center gap-3 group"
                              >
                                <MapPin className="w-4 h-4 text-orange-400" />
                                <span className="text-white font-medium group-hover:text-purple-400 transition-colors">{location}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* No Results */}
                    {searchQuery && !hasSuggestions && (
                      <div className="p-8 text-center">
                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No results found for "{searchQuery}"</p>
                        <p className="text-gray-500 text-sm mt-2">Try searching for a city, event name, or category</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Location Info */}
              {userLocation && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
                  <Navigation className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">
                    Showing events near {userLocation}
                  </span>
                </div>
              )}
            </div>

            {/* Popular Searches */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Popular:  </span>
                </div>
                {popularSearches.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(city, 'city')}
                    className="px-4 py-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Components */}
      <ConferenceFeaturedSection scrollY={scrollY} />
      <AgendaSection />
    </div>
  );
}