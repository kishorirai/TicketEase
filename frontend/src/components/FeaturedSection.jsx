import React from "react";
import { ArrowRight } from "lucide-react";
import imgJohn from "../assets/a.png";
import imgCarlos from "../assets/b.png";
import imgErnest from "../assets/c.png";
import imgEthan from "../assets/d.png";
import imgTomislav from "../assets/a.png"; 
import imgDavid from "../assets/b.png";    
import videoSrc from "../assets/video.mp4";

export default function ConferenceFeaturedSection({ scrollY }) {
  return (
    <>
      {/* Video Section with Scroll Animation */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex flex-col items-center justify-center py-32">
        <div
          className="w-[80%] md:w-[60%] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            transform: `scale(${0.7 + (Math.min(scrollY - 1400, 800) / 800) * 0.3})`,
            transition: 'transform 0.1s linear'
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Meet The Speakers Section */}
      <section className="relative bg-black text-white overflow-hidden py-32">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: 'linear-gradient(135deg, #6F2CFD 0%, #8A6EFF 25%, #6E85FF 50%, #F06E99 75%, #6F2CFD 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite'
          }}
        />
        <div className="relative z-10 container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black mb-4" style={{ color: '#FFE302' }}>
              Meet All The Top IT Minds
            </h2>
            <p className="text-white text-lg opacity-90">
              Explore our lineup of keynote speakers and industry leaders
            </p>
          </div>

          {/* Speaker Grid - 2 Rows, 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* First Row */}
            {[
              { name: "John Anderson", title: "Head of Marketing Design", bg: "#6E85FF", img: imgJohn },
              { name: "Carlos Mendes", title: "Senior Design Engineer", bg: "#FFB8D1", img: imgCarlos },
              { name: "Ethan Zhao", title: "AI/Tech Innovator", bg: "#FFE302", img: imgEthan }
            ].map((speaker, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: speaker.bg,
                  height: '280px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  animation: `float ${12+ i * 1.5}s ease-in-out infinite`
                }}
              >
                <img
                  src={speaker.img}
                  alt={speaker.name}
                  className="w-24 h-24 object-cover rounded-full mb-4 mt-8 shadow-lg border-4 border-white"
                />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-xl font-bold">{speaker.name}</h3>
                  <p className="text-white text-sm opacity-90">{speaker.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Second Row */}
            {[
              { name: "Tomislav Petrovic", title: "Blockchain Solutions Architect", bg: "#D79EF5", img: imgTomislav },
              { name: "David Kim", title: "VP of Research, TechVision", bg: "#C5FF6E", img: imgDavid }
            ].map((speaker, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: speaker.bg,
                  height: '280px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  animation: `float ${12 + i * 1.5}s ease-in-out infinite`
                }}
              >
                <img
                  src={speaker.img}
                  alt={speaker.name}
                  className="w-24 h-24 object-cover rounded-full mb-4 mt-8 shadow-lg border-4 border-white"
                />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-xl font-bold">{speaker.name}</h3>
                  <p className="text-white text-sm opacity-90">{speaker.title}</p>
                </div>
              </div>
            ))}
            {/* Buy Ticket Card */}
            <div
              className="relative rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 group"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: '280px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}
            >
              <div className="text-center">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-xl flex items-center gap-3 group-hover:bg-gray-100 transition-all shadow-lg mx-auto">
                  Buy Ticket
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Animations */}
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </section>
    </>
  );
}