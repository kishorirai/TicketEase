import React, { useState, useRef, useEffect } from "react";
import { MapPin, TrendingUp, Calendar, Star, Users, Sparkles, Award, Clock, Music, Trophy, Theater, Laugh, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../pages/api";

export default function ConferenceFeaturedSection({ scrollY = 0 }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for different event categories
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [concertEvents, setConcertEvents] = useState([]);
  const [sportsEvents, setSportsEvents] = useState([]);
  const [theaterEvents, setTheaterEvents] = useState([]);
  const [comedyEvents, setComedyEvents] = useState([]);
  const [workshopEvents, setWorkshopEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchEvents();
        const allEvents = Array.isArray(response) ? response : (response. events || []);

        // Filter events by category - get MORE than needed
        const concerts = allEvents.filter(e => 
          e.category?. toLowerCase().includes('music') || 
          e.category?.toLowerCase().includes('concert') ||
          e.category?.toLowerCase().includes('live music')
        ).slice(0, 4);

        const sports = allEvents.filter(e => 
          e. category?.toLowerCase().includes('sport')
        ).slice(0, 4);

        const theater = allEvents.filter(e => 
          e.category?.toLowerCase().includes('theater') || 
          e.category?.toLowerCase().includes('theatre')
        ).slice(0, 4);

        const comedy = allEvents.filter(e => 
          e.category?.toLowerCase().includes('comedy')
        ).slice(0, 4);

        const workshops = allEvents.filter(e => 
          e.category?.toLowerCase().includes('workshop') || 
          e.category?. toLowerCase().includes('conference') ||
          e.category?.toLowerCase().includes('business')
        ).slice(0, 4);

        // Trending events - based on rating, reviews, or recent bookings
        const trending = allEvents
          .sort((a, b) => {
            const scoreA = (a.rating || 0) * (a.reviews || 0);
            const scoreB = (b.rating || 0) * (b.reviews || 0);
            return scoreB - scoreA;
          })
          .slice(0, 4);

        // Transform events to match the component structure
        const transformEvent = (event) => ({
          _id: event._id,
          name: event.title || 'Untitled Event',
          title: event.subtitle || event.category || 'Event',
          location: event.city || event.location || 'TBA',
          img: event.images && event.images.length > 0 
            ? event.images[0] 
            : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
          rating: event.rating || 4.5,
          reviews: event.reviews || 0,
          price: getMinPrice(event),
          date: formatDate(event.date),
          category: event.category
        });

        setTrendingEvents(trending. map(transformEvent));
        setConcertEvents(concerts.map(transformEvent));
        setSportsEvents(sports. map(transformEvent));
        setTheaterEvents(theater.map(transformEvent));
        setComedyEvents(comedy.map(transformEvent));
        setWorkshopEvents(workshops.map(transformEvent));

        setLoading(false);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Helper function to get minimum price from ticket types
  const getMinPrice = (event) => {
    if (event.ticket_types && event.ticket_types.length > 0) {
      return Math.min(...event.ticket_types.map(t => t.price));
    }
    return event.price || 0;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'TBA';
    }
  };

  // Navigate to event details
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Navigate to category page
  const handleViewAll = (category = null) => {
    if (category) {
      navigate(`/events? category=${encodeURIComponent(category)}`);
    } else {
      navigate('/events');
    }
  };

  // 3D Tilt Card Component - Compact Version
  const TiltCard = ({ event, index, showTrendingBadge = false }) => {
    const cardRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
      if (! cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e. clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
        transition: 'none'
      });
    };

    const handleMouseLeave = () => {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
      });
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleEventClick(event._id)}
        className="group relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          height: "320px",
          transformStyle: "preserve-3d",
          ... tiltStyle
        }}
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
            style={{ 
              transform: 'translateZ(30px)',
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>

        {/* Trending Badge */}
        {showTrendingBadge && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-2xl backdrop-blur-sm flex items-center gap-1.5"
            style={{ transform: 'translateZ(50px)' }}>
            <Award className="w-3 h-3" />
            Trending
          </div>
        )}

        {/* Image */}
        <img
          src={event.img}
          alt={event.name}
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0px)' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" style={{ transform: 'translateZ(10px)' }}></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end" style={{ transform: 'translateZ(20px)' }}>
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 glass-effect px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl"
            style={{ transform: 'translateZ(40px)' }}>
            <Star className="w-3. 5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold text-sm">{event.rating}</span>
          </div>

          <div style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-xl font-black text-white mb-2 line-clamp-1">{event.name}</h3>
            <div className="flex items-center gap-1. 5 text-gray-300 text-sm mb-3">
              <MapPin className="w-3. 5 h-3.5" />
              <span className="line-clamp-1">{event.title} • {event.location}</span>
            </div>
            
            {/* Compact Info Row */}
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">{event.date. split(',')[0]}</span>
              </div>
              <div className="text-gray-400 text-xs">({event.reviews} reviews)</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div>
                <div className="text-gray-400 text-xs">From</div>
                <div className="text-lg font-black text-white">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event._id);
                }}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl font-bold text-white text-sm transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:border-transparent">
                Book
              </button>
            </div>
          </div>
        </div>

        {/* 3D Border Glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.5), inset 0 0 20px rgba(147, 51, 234, 0.2)',
            transform: 'translateZ(50px)'
          }}
        ></div>
      </div>
    );
  };

  // Compact Card for 1-2 events - Featured Style
  const FeaturedCard = ({ event, showTrendingBadge = false }) => {
    return (
      <div
        onClick={() => handleEventClick(event._id)}
        className="group relative rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-500"
        style={{ height: "400px" }}
      >
        {/* Trending Badge */}
        {showTrendingBadge && (
          <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-sm flex items-center gap-2">
            <Award className="w-4 h-4" />
            Trending
          </div>
        )}

        {/* Image */}
        <img
          src={event.img}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Rating Badge */}
          <div className="absolute top-6 right-6 glass-effect px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold text-lg">{event.rating}</span>
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-3">
              {event.category}
            </div>
            <h3 className="text-3xl font-black text-white mb-3">{event.name}</h3>
            <div className="flex items-center gap-2 text-gray-300 text-base mb-4">
              <MapPin className="w-5 h-5" />
              <span>{event.title} • {event.location}</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{event.date}</span>
              </div>
              <div className="text-gray-400">({event.reviews} reviews)</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div>
                <div className="text-gray-400 text-sm">Starting from</div>
                <div className="text-3xl font-black text-white">
                  {event.price === 0 ?  'Free' : `$${event.price}`}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event._id);
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2">
                Book Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: '0 0 60px rgba(147, 51, 234, 0.6)' }}>
        </div>
      </div>
    );
  };

  // Section Component for each category
  const EventSection = ({ title, subtitle, icon: Icon, events, gradientFrom, gradientTo, bgPattern, category }) => {
    // OPTION 1: Hide if less than 3 events
    //if (events.length < 3) return null;

    // OPTION 2: Show differently based on count
     if (events.length === 0) return null;

    return (
      <section className="relative py-20 overflow-hidden" style={{ background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})` }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: bgPattern,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-5 py-2 rounded-full mb-4 glass-effect">
              <Icon className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold text-sm">{subtitle}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Discover amazing {title. toLowerCase()} experiences near you
            </p>
          </div>

          {/* Dynamic Grid based on event count */}
          {events.length >= 3 ? (
            // Standard grid for 3-4 events
            <div className={`grid gap-6 max-w-7xl mx-auto ${
              events.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 
              'grid-cols-1 sm: grid-cols-2 lg: grid-cols-4'
            }`}>
              {events.map((event, i) => (
                <TiltCard key={event._id} event={event} index={i} />
              ))}
            </div>
          ) : (
            // Featured style for 1-2 events
            <div className={`grid gap-8 max-w-6xl mx-auto ${
              events.length === 1 ? 'grid-cols-1 max-w-3xl' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {events.map((event, i) => (
                <FeaturedCard key={event._id} event={event} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-10">
            <button 
              onClick={() => handleViewAll(category)}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105">
              View All {title}
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
          <p className="text-white text-xl">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center py-20">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-white text-2xl font-bold mb-2">Failed to load events</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location. reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform:  translateY(-15px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Trending Events Section - Show if 3+ events */}
      {trendingEvents.length >= 3 && (
        <section className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#16041a] overflow-hidden">
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
              <div className="flex items-center gap-3 mb-6 md:mb-0">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white">
                    Trending Now
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Don't miss out on these hot events</p>
                </div>
              </div>
              <button 
                onClick={() => handleViewAll()}
                className="group flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-semibold text-white text-sm transition-all duration-300">
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Trending Events Grid */}
            <div className={`grid gap-6 max-w-7xl mx-auto ${
              trendingEvents.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {trendingEvents.map((event, i) => (
                <TiltCard key={event._id} event={event} index={i} showTrendingBadge={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Concerts Section */}
      <EventSection
        title="Concerts"
        subtitle="Live Music Events"
        icon={Music}
        events={concertEvents}
        category="Music"
        gradientFrom="#16041a"
        gradientTo="#0f0518"
        bgPattern="linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)"
      />

      {/* Sports Section */}
      <EventSection
        title="Sports"
        subtitle="Live Sports Events"
        icon={Trophy}
        events={sportsEvents}
        category="Sports"
        gradientFrom="#0f0518"
        gradientTo="#0a1520"
        bgPattern="linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)"
      />

      {/* Theater Section */}
      <EventSection
        title="Theater"
        subtitle="Stage Performances"
        icon={Theater}
        events={theaterEvents}
        category="Theater"
        gradientFrom="#0a1520"
        gradientTo="#180a1a"
        bgPattern="linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)"
      />

      {/* Comedy Section */}
      <EventSection
        title="Comedy"
        subtitle="Stand-Up Shows"
        icon={Laugh}
        events={comedyEvents}
        category="Comedy"
        gradientFrom="#180a1a"
        gradientTo="#0a0f1a"
        bgPattern="linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)"
      />

      {/* Workshops Section */}
      <EventSection
        title="Workshops"
        subtitle="Learning Experiences"
        icon={BookOpen}
        events={workshopEvents}
        category="Workshop"
        gradientFrom="#0a0f1a"
        gradientTo="#000000"
        bgPattern="linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)"
      />
    </>
  );
}