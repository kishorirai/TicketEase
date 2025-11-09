import React from "react";
import videoSrc from "../assets/video.mp4";

export default function ConferenceFeaturedSection({ scrollY = 0 }) {
  const events = [
    {
      name: "Rhythm Fest 2025",
      title: "Live Concert • Mumbai",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    },
    {
  name: "Tech Expo Summit",
  title: "Innovation Event • Bengaluru",
  img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80", // updated
},

    {
      name: "Comedy Carnival",
      title: "Stand-up Night • Delhi",
      img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Film Fiesta",
      title: "Movie Premiere • Chennai",
      img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Sports Mania",
      title: "Cricket League • Kolkata",
      img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Culinary Carnival",
      title: "Food & Culture Fest • Hyderabad",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <>
      {/* Video Section */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex flex-col items-center justify-center py-32">
        <div
          className="w-[85%] md:w-[60%] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            transform: `scale(${0.7 + (Math.min(scrollY - 1400, 800) / 800) * 0.3})`,
            transition: "transform 0.1s linear",
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

      {/* Popular Events */}
      <section className="relative bg-black text-white py-32">
        <div className="relative z-10 container mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-[#FFE302]">
              Popular Events
            </h2>
            <p className="text-white text-lg opacity-90">
              Discover top-rated concerts, festivals, and entertainment shows near you
            </p>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{ height: "350px" }}
              >
                <img
                  src={event.img}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                  <p className="text-gray-300">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
