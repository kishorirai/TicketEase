import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // For navigation

import PartnersAndResources from "../components/PartnersandResources";
import AgendaSection from "../components/Agenda";
import TicketPricingFAQFooter from "../components/Ticketfooter";
import ConferenceFeaturedSection from "../components/FeaturedSection";

export default function ConferenceLanding() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = Math.max(1 - scrollY / 400, 0);
  const speakerSectionStart = 400;
  const animationStart = 600;
  const animationEnd = 1000;
  const animationProgress = Math.max(
    0,
    Math.min(1, (scrollY - animationStart) / (animationEnd - animationStart))
  );
  const sideCardOffset = 80;
  const sideCardsTranslateY = sideCardOffset * (1 - animationProgress);
  const speakerOpacity = Math.min((scrollY - speakerSectionStart) / 200, 1);
  const aboutVisible = scrollY > 1200;

  return (
    <div className="bg-black">
      {/* Fixed Buy Ticket Button */}
      <button
        onClick={() => navigate("/events")}
        className="fixed bottom-8 right-8 bg-white text-purple-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-2xl z-50"
      >
        Buy Ticket
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Hero Section */}
      <section
        className="min-h-screen relative"
        style={{
          backgroundColor: "#6F2CFD",
          opacity: heroOpacity,
          position: heroOpacity > 0 ? "sticky" : "relative",
          top: 0,
          zIndex: 1,
        }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(157, 127, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 92, 232, 0.6) 0%, transparent 50%)",
              animation: "moveGradient 10s ease infinite",
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated Wave Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#9D7FFF", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#7C5CE8", stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {[100, 200, 300, 450].map((y, i) => (
              <path
                key={i}
                fill="none"
                stroke="url(#grad1)"
                strokeWidth={i === 2 ? "4" : "3"}
                d={`M0,${y} Q250,${y - 50} 500,${y} T1000,${y} T1500,${y}`}
                opacity={`${0.4 + i * 0.1}`}
              >
                <animate
                  attributeName="d"
                  dur={`${8 + i * 3}s`}
                  repeatCount="indefinite"
                  values={`M0,${y} Q250,${y - 50} 500,${y} T1000,${y} T1500,${y};
                           M0,${y} Q250,${y + 50} 500,${y} T1000,${y} T1500,${y};
                           M0,${y} Q250,${y - 50} 500,${y} T1000,${y} T1500,${y}`}
                />
              </path>
            ))}
          </svg>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); }
            33% { transform: translateY(-30px) translateX(20px) scale(1.1); }
            66% { transform: translateY(-15px) translateX(-20px) scale(0.9); }
          }
          @keyframes moveGradient {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, 50px) scale(1.1); }
          }
        `}</style>

        {/* Hero Content */}
        <div className="container mx-auto px-8 flex items-center justify-center" style={{ minHeight: "calc(100vh - 100px)" }}>
          <div className="max-w-4xl pt-24">
            <h1 className="text-6xl font-black mb-6 leading-tight" style={{ color: "#FFE302" }}>
              Discover. Book.<br />
              Experience. Live Events<br />
              Made Easy.
            </h1>
            <p className="text-white text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Your one-stop destination to book tickets for concerts, sports, theatre, and festivals.
              Explore top events near you and reserve your spot today!
            </p>
            <button
              onClick={() => navigate("/events")}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-gray-100 transition-all shadow-lg"
            >
              Buy Ticket
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section
        className="relative py-32 pb-64"
        style={{ opacity: speakerOpacity, zIndex: 2, backgroundColor: "#111111" }}
      >
        <div className="container mx-auto px-8">
          <h2 className="text-5xl font-black text-center text-white mb-16">Featured Events</h2>
          <div className="overflow-x-auto pb-8 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="inline-flex gap-6 min-w-max items-end">
              {[
                { id: 1, title: "Summer Music Festival 2025", location: "New York", date: "2025-06-15", time: "18:00", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&h=600&fit=crop", price: 89, totalSeats: 500, bookedSeats: 450 },
                { id: 2, title: "Tech Conference 2025", location: "San Francisco", date: "2025-07-20", time: "09:00", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=600&fit=crop", price: 199, totalSeats: 300, bookedSeats: 275 },
                { id: 3, title: "Food & Wine Festival", location: "Los Angeles", date: "2025-08-10", time: "12:00", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&h=600&fit=crop", price: 75, totalSeats: 200, bookedSeats: 180 },
                { id: 4, title: "Art Gallery Exhibition", location: "Chicago", date: "2025-07-05", time: "10:00", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1000&h=600&fit=crop", price: 35, totalSeats: 150, bookedSeats: 45 },
              ].map((event, index) => {
                const seatsLeft = event.totalSeats - event.bookedSeats;
                return (
                  <div key={event.id} className="w-70 flex-shrink-0" style={{ transform: index % 2 === 0 ? `translateY(${sideCardsTranslateY}px)` : "translateY(0)" }}>
                    <div className="rounded-xl overflow-hidden mb-4 relative" style={{ backgroundColor: "#222", height: "260px" }}>
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover p-2 rounded-xl" />
                    </div>
                    <div className="bg-gray-900 p-5 rounded-lg">
                      <h3 className="text-white text-xl font-bold mb-1">{event.title}</h3>
                      <p className="text-gray-400 text-sm mb-1">📍 {event.location}</p>
                      <p className="text-gray-400 text-sm mb-2">🗓 {event.date} • ⏰ {event.time}</p>
                      <p className="text-yellow-400 text-sm font-semibold mb-2">{seatsLeft > 0 ? `${seatsLeft} seats left` : "Sold Out"}</p>
                      <p className="text-white text-lg font-bold mb-3">₹{event.price}</p>
                      <button
                        onClick={() => navigate("/events")}
                        className="w-full bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                      >
                        Book Ticket
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="min-h-screen bg-black text-white py-20" style={{ opacity: aboutVisible ? 1 : 0, transition: "opacity 0.5s", zIndex: 3 }}>
        <div className="container mx-auto px-8">
          <h2 className="text-6xl font-black mb-8">About TicketEase</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xl leading-relaxed mb-6">
                <span className="font-bold" style={{ color: "#FFE302" }}>TicketEase</span> is your one-stop destination to discover, explore, and book tickets for the hottest events around you.
                Whether it’s <span className="font-semibold text-purple-400">concerts, workshops, festivals, or sports</span> — we make booking effortless and exciting.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Our mission is simple — to connect people with experiences they love.
                Enjoy seamless booking, instant e-tickets, and secure payments — all in just a few taps.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: "Instant Booking", icon: "🎟️" },
                  { label: "Secure Payments", icon: "💳" },
                  { label: "Verified Events", icon: "✅" },
                  { label: "24/7 Support", icon: "🕒" },
                ].map((feature, i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-800 transition">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="font-bold text-white">{feature.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-gray-900 rounded-xl overflow-hidden h-96 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=600&fit=crop"
                  alt="People enjoying event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Components */}
      <ConferenceFeaturedSection scrollY={scrollY} />
      <PartnersAndResources />
      <AgendaSection />
      <TicketPricingFAQFooter />
    </div>
  );
}
