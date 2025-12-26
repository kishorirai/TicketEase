import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles, Star, Search } from "lucide-react";

import AgendaSection from "../components/Agenda";
import ConferenceFeaturedSection from "../components/FeaturedSection";

export default function ConferenceLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCity, setHoveredCity] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=800&fit=crop",
      eventName: "Summer Music Festival",
      tagline: "Where rhythm meets summer breeze",
      gradient: "from-purple-900/60 via-pink-900/40 to-transparent"
    },
    {
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=800&fit=crop",
      eventName: "Rock Concert Live",
      tagline: "Feel the thunder of live music",
      gradient: "from-red-900/60 via-orange-900/40 to-transparent"
    },
    {
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1920&h=800&fit=crop",
      eventName: "Jazz Night Experience",
      tagline: "Smooth melodies under the stars",
      gradient: "from-blue-900/60 via-indigo-900/40 to-transparent"
    },
    {
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&h=800&fit=crop",
      eventName: "Electronic Dance Festival",
      tagline: "Lose yourself in the beat",
      gradient: "from-cyan-900/60 via-teal-900/40 to-transparent"
    },
    {
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=800&fit=crop",
      eventName: "Indie Music Fest",
      tagline: "Discover tomorrow's legends today",
      gradient: "from-emerald-900/60 via-green-900/40 to-transparent"
    }
  ];

  // All available cities
  const cities = [
    { 
      name: "Mumbai", 
      events: 45, 
      img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80",
      popular: true
    },
    { 
      name: "Delhi", 
      events: 38, 
      img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
      popular: true
    },
    { 
      name: "Bengaluru", 
      events: 52, 
      img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80",
      popular: true
    },
    { 
      name: "Chennai", 
      events: 29, 
      img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
      popular: false
    },
    
    { 
      name: "Hyderabad", 
      events: 41, 
      img: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=600&q=80",
      popular: true
    },
    { 
      name: "Pune", 
      events: 27, 
      img: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=600&q=80",
      popular: false
    },
  ];

  const speakerSectionStart = 400;
  const speakerOpacity = Math.min((scrollY - speakerSectionStart) / 200, 1);

  useEffect(() => {
    if (!isAutoPlaying) return;
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

  // Filter cities based on search query - show all if empty
  const filteredCities = searchQuery.trim() === "" 
    ? cities 
    :  cities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="bg-black min-h-screen">
      {/* Floating CTA Button */}
      <button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 z-50 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Buy Tickets
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                currentSlide === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.eventName}
                  className="w-full h-full object-cover"
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
                    className="mt-6 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all hover: scale-105 shadow-xl"
                    style={{
                      animation: currentSlide === index ? "slideUp 0.8s ease-out 0.4s both" : "none"
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
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 hover:scale-110 transition-all border border-white/20 group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 hover:scale-110 transition-all border border-white/20 group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? "bg-white w-12 shadow-lg shadow-white/50" 
                  : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
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

      {/* Location-Based Events Section */}
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
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold">Discover Locally</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Events Near You
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
              Explore exciting events happening in cities across India
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus: border-purple-500 focus: outline-none transition-all duration-300 text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-2 px-5 my-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cities Grid */}
          <div className="max-w-7xl mx-auto">
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {filteredCities.map((city, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="relative rounded-3xl overflow-hidden card-hover h-72 group cursor-pointer"
                  >
                    <img
                      src={city.img}
                      alt={city. name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    
                    {/* Popular Badge */}
                    {city.popular && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-black" />
                        Hot
                      </div>
                    )}

                    {/* City Info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center">
                      <div className="mb-3 w-14 h-14 glass-effect rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">{city.name}</h3>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-full">
                        <Sparkles className="w-3. 5 h-3.5 text-white" />
                        <span className="text-white font-semibold text-sm">{city.events} Events</span>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              // No Results Found
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No cities found</h3>
                <p className="text-gray-400 mb-6">
                  No results for "<span className="text-purple-400">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Components */}
      <ConferenceFeaturedSection scrollY={scrollY} />
      <AgendaSection />
    </div>
  );
}