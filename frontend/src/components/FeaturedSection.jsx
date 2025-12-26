import React, { useState, useRef } from "react";
import { MapPin, TrendingUp, Calendar, Star, Users, Sparkles, Award, Clock, Music, Trophy, Theater, Laugh, BookOpen } from "lucide-react";

export default function ConferenceFeaturedSection({ scrollY = 0 }) {
  const concertEvents = [
    {
      name: "Rhythm Fest 2025",
      title: "Live Concert",
      location: "Mumbai",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 234,
      price: 1299,
      date: "Dec 28, 2025"
    },
    {
      name: "Rock Revolution",
      title: "Rock Concert",
      location: "Delhi",
      img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 456,
      price: 1499,
      date: "Jan 10, 2026"
    },
    {
      name: "Jazz Night Live",
      title: "Jazz Performance",
      location: "Bengaluru",
      img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      reviews: 189,
      price: 999,
      date: "Jan 20, 2026"
    },
    {
      name: "EDM Festival",
      title: "Electronic Dance",
      location: "Goa",
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 678,
      price: 1999,
      date: "Feb 5, 2026"
    },
  ];

  const sportsEvents = [
    {
      name:  "Cricket Championship",
      title: "IPL Match",
      location: "Mumbai",
      img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 567,
      price: 899,
      date: "Jan 5, 2026"
    },
    {
      name: "Football League",
      title: "ISL Finals",
      location: "Kolkata",
      img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 423,
      price: 799,
      date: "Jan 15, 2026"
    },
    {
      name: "Tennis Open",
      title: "Grand Slam",
      location: "Delhi",
      img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      reviews: 298,
      price: 1299,
      date: "Feb 10, 2026"
    },
    {
      name: "Basketball Finals",
      title: "NBA Exhibition",
      location: "Bengaluru",
      img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 512,
      price: 1599,
      date: "Feb 20, 2026"
    },
  ];

  const theaterEvents = [
    {
      name: "Shakespeare's Hamlet",
      title: "Classic Drama",
      location: "Mumbai",
      img: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 234,
      price: 799,
      date: "Jan 8, 2026"
    },
    {
      name: "Modern Ballet",
      title: "Dance Performance",
      location: "Delhi",
      img: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 345,
      price: 999,
      date: "Jan 18, 2026"
    },
    {
      name: "Musical Broadway",
      title: "Musical Theatre",
      location: "Bengaluru",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      reviews: 456,
      price: 1299,
      date: "Feb 3, 2026"
    },
    {
      name: "Comedy Play",
      title: "Theatrical Comedy",
      location: "Pune",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 189,
      price: 699,
      date: "Feb 12, 2026"
    },
  ];

  const comedyEvents = [
    {
      name: "Stand-Up Special",
      title: "Comedy Night",
      location: "Mumbai",
      img: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 567,
      price: 599,
      date: "Jan 12, 2026"
    },
    {
      name: "Comedy Club Live",
      title: "Stand-Up Show",
      location:  "Delhi",
      img: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 423,
      price: 499,
      date: "Jan 22, 2026"
    },
    {
      name:  "Improv Comedy",
      title: "Improvisation Show",
      location: "Bengaluru",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      reviews: 345,
      price: 699,
      date: "Feb 5, 2026"
    },
    {
      name: "Roast Battle",
      title: "Comedy Roast",
      location: "Pune",
      img: "https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 489,
      price: 799,
      date: "Feb 18, 2026"
    },
  ];

  const workshopEvents = [
    {
      name: "Photography Masterclass",
      title: "Photography Workshop",
      location: "Mumbai",
      img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      reviews: 234,
      price: 1999,
      date: "Jan 25, 2026"
    },
    {
      name: "Digital Marketing",
      title: "Marketing Workshop",
      location: "Bengaluru",
      img:  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 456,
      price: 2499,
      date: "Feb 8, 2026"
    },
    {
      name: "Cooking Class",
      title: "Culinary Workshop",
      location: "Delhi",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      reviews: 189,
      price: 1499,
      date: "Feb 15, 2026"
    },
    {
      name:  "Yoga & Wellness",
      title: "Wellness Workshop",
      location: "Goa",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      reviews: 378,
      price: 1799,
      date: "Mar 1, 2026"
    },
  ];

  // 3D Tilt Card Component - Compact Version
  const TiltCard = ({ event, index }) => {
    const cardRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
      if (! cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e. clientY - rect.top;
      
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

        {/* Image */}
        <img
          src={event.img}
          alt={event.name}
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0px)' }}
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
            <div className="flex items-center gap-1.5 text-gray-300 text-sm mb-3">
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
                <div className="text-lg font-black text-white">₹{event.price}</div>
              </div>
              <button className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl font-bold text-white text-sm transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:border-transparent">
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

  // Section Component for each category - Single Row with 4 Cards
  const EventSection = ({ title, subtitle, icon: Icon, events, gradientFrom, gradientTo, bgPattern }) => (
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

        {/* Single Row Grid - Always 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {events.map((event, i) => (
            <TiltCard key={i} event={event} index={i} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="group inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105">
            View All {title}
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );

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

      {/* Trending Events Section - 4 Cards */}
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
            <button className="group flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-semibold text-white text-sm transition-all duration-300">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Single Row - 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {concertEvents.map((event, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden glass-effect hover:scale-105 transition-all duration-500 cursor-pointer"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-2xl backdrop-blur-sm flex items-center gap-1.5">
                  <Award className="w-3 h-3" />
                  Trending
                </div>

                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  
                  {/* Overlay Content on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1. 5 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-sm">{event.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <div className="text-gray-500 text-xs">From</div>
                      <div className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₹{event.price}
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concerts Section - 4 Cards */}
      <EventSection
        title="Concerts"
        subtitle="Live Music Events"
        icon={Music}
        events={concertEvents}
        gradientFrom="#16041a"
        gradientTo="#0f0518"
        bgPattern="linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)"
      />

      {/* Sports Section - 4 Cards */}
      <EventSection
        title="Sports"
        subtitle="Live Sports Events"
        icon={Trophy}
        events={sportsEvents}
        gradientFrom="#0f0518"
        gradientTo="#0a1520"
        bgPattern="linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)"
      />

      {/* Theater Section - 4 Cards */}
      <EventSection
        title="Theater"
        subtitle="Stage Performances"
        icon={Theater}
        events={theaterEvents}
        gradientFrom="#0a1520"
        gradientTo="#180a1a"
        bgPattern="linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)"
      />

      {/* Comedy Section - 4 Cards */}
      <EventSection
        title="Comedy"
        subtitle="Stand-Up Shows"
        icon={Laugh}
        events={comedyEvents}
        gradientFrom="#180a1a"
        gradientTo="#0a0f1a"
        bgPattern="linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)"
      />

      {/* Workshops Section - 4 Cards */}
      <EventSection
        title="Workshops"
        subtitle="Learning Experiences"
        icon={BookOpen}
        events={workshopEvents}
        gradientFrom="#0a0f1a"
        gradientTo="#000000"
        bgPattern="linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)"
      />
    </>
  );
}