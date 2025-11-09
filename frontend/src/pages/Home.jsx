import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import PartnersAndResources from "../components/PartnersAndResources";
import AgendaSection from "../components/Agenda";
import TicketPricingFAQFooter from "../components/Ticketfooter";
import ConferenceFeaturedSection from "../components/FeaturedSection";

export default function ConferenceLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const speakers = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief AI Architect, TechVision",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
      bgColor: "#FFE302",
      position: "side"
    },
    {
      name: "Marcus Reid",
      title: "VP Engineering, CloudScale",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      bgColor: "#6E85FF",
      position: "center"
    },
    {
      name: "Elena Rodriguez",
      title: "Director of Innovation, DataCorp",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      bgColor: "#F06E99",
      position: "center"
    },
    {
      name: "James Park",
      title: "Lead Solutions Architect, DevCore",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
      bgColor: "#8A6EFF",
      position: "side"
    },
  ];

  const heroOpacity = Math.max(1 - scrollY / 400, 0);
  const speakerSectionStart = 400;
  const animationStart = 600;
  const animationEnd = 1000;
  const animationProgress = Math.max(0, Math.min(1, (scrollY - animationStart) / (animationEnd - animationStart)));
  const sideCardOffset = 80;
  const sideCardsTranslateY = sideCardOffset * (1 - animationProgress);
  const speakerOpacity = Math.min((scrollY - speakerSectionStart) / 200, 1);
  const aboutVisible = scrollY > 1200;

  return (
    <div className="bg-black">
      {/* ✅ Fixed Buy Ticket Button */}
      <button className="fixed bottom-8 right-8 bg-white text-purple-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-2xl z-50">
        Buy Ticket
        <ArrowRight className="w-5 h-5" />
      </button>

     
   

      {/* Hero Section */}
      <section
        className="min-h-screen relative"
        style={{
          backgroundColor: '#6F2CFD',
          opacity: heroOpacity,
          position: heroOpacity > 0 ? 'sticky' : 'relative',
          top: 0,
          zIndex: 1
        }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(157, 127, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 92, 232, 0.6) 0%, transparent 50%)',
            animation: 'moveGradient 10s ease infinite'
          }}></div>
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
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Animated Wave Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#9D7FFF', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#7C5CE8', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {[100, 200, 300, 450].map((y, i) => (
              <path key={i}
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

        {/* Keyframes */}
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
        <div className="container mx-auto px-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
          <div className="max-w-4xl pt-24">
            <h1 className="text-8xl font-black mb-6 leading-tight" style={{ color: '#FFE302' }}>
              Code. Connect.<br />Create. One Epic<br />Conference
            </h1>
            <p className="text-white text-xl mb-8 max-w-2xl leading-relaxed">
              Explore our lineup of keynote speakers and industry leaders who will inspire and enlighten us at the conference.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-gray-100 transition-all shadow-lg">
              Buy Ticket
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Speaker Cards Section */}
      <section className="relative py-32 pb-64" style={{ opacity: speakerOpacity, zIndex: 2, backgroundColor: '#111111' }}>
        <div className="container mx-auto px-8">
          <div className="overflow-x-auto pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="inline-flex gap-6 min-w-max items-end">
              {speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="w-85 flex-shrink-0"
                  style={{
                    transform: speaker.position === 'side'
                      ? `translateY(${sideCardsTranslateY}px)`
                      : 'translateY(0)',
                  }}
                >
                  <div
                    className="rounded-xl overflow-hidden mb-4 relative"
                    style={{ backgroundColor: speaker.bgColor, height: '400px' }}
                  >
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover p-4"
                      style={{ objectPosition: 'top' }}
                    />
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-white text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-gray-300 text-sm">{speaker.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="min-h-screen bg-black text-white py-20"
        style={{
          opacity: aboutVisible ? 1 : 0,
          transition: 'opacity 0.5s',
          zIndex: 3
        }}
      >
        <div className="container mx-auto px-8">
          <h2 className="text-6xl font-black mb-8">About</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xl leading-relaxed mb-6">
                Summitra 2025 brings together the brightest minds in technology for three days of innovation, learning, and networking. Join us <span className="font-bold" style={{ color: '#FFE302' }}>August 13–15</span> for an unforgettable experience.
              </p>
              <div className="flex gap-4 my-8">
                {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-4 text-center flex-1">
                    <div className="text-4xl font-black mb-1">00</div>
                    <div className="text-sm text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-gray-900 rounded-xl overflow-hidden h-96">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
                  alt="Conference audience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured, Partners, Agenda, Footer */}
      <ConferenceFeaturedSection scrollY={scrollY} />
      <PartnersAndResources />
      <AgendaSection />
      <TicketPricingFAQFooter />
    </div>
  );
}
