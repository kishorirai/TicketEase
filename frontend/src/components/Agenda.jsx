import React from "react";

const eventsSchedule = [
  {
    id: 1,
    time: "09:00 - 11:30",
    title: "Summer Music Extravaganza",
    description: "Start your morning with electrifying live performances, chart-topping artists, and unforgettable melodies.",
    performers: ["The Harmony Crew", "DJ Phoenix"],
  },
  {
    id: 2,
    time: "12:00 - 01:45",
    title: "Innovation & Tech Summit",
    description: "Dive into cutting-edge technology trends, groundbreaking startups, and interactive innovation displays.",
    performers: ["FutureTech Collective"],
  },
  {
    id: 3,
    time: "02:15 - 03:45",
    title: "Laughter Fest",
    description: "Get ready for non-stop laughter with hilarious stand-up acts from the funniest comedians in town.",
    performers: ["Comedy Kings"],
  },
  {
    id: 4,
    time: "04:15 - 06:00",
    title: "Cinema Showcase Premiere",
    description: "Experience exclusive screenings of upcoming blockbusters with celebrity meet-and-greets and Q&A sessions.",
    performers: ["Producer Davis", "Star Johnson"],
  },
  {
    id: 5,
    time: "06:30 - 08:30",
    title: "Championship Sports Arena",
    description: "Witness intense live cricket action as champion teams compete for glory on the grand stage.",
    performers: ["Thunder Squad", "Lightning United"],
  },
 
];

export default function EventsScheduleSection() {
  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Schedule Cards */}
        <div className="relative">
          {eventsSchedule.map((event, index) => (
            <div
              key={event.id}
              className="sticky top-24 mb-8"
              style={{ zIndex: index + 10 }}
            >
              <div
                className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8 shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 max-w-lg mx-auto lg:mx-0"
                style={{
                  transform:  `translateY(${index * 14}px) scale(${1 - index * 0.04})`,
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="text-xs font-bold text-yellow-400 mr-4">{event.time}</div>
                  <div className="text-xl font-bold text-white">{event.title}</div>
                </div>
                <div className="text-gray-300 mb-4">{event.description}</div>
                {event. performers.length > 0 && (
                  <div className="flex gap-4 mt-3 flex-wrap">
                    {event.performers.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-sm text-white bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="h-96"></div>
        </div>

        {/* Right Column:  CTA */}
        <div className="md:sticky md:top-28 flex flex-col items-start justify-start pt-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Organize Your Schedule</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-pink-700 shadow-xl transition-all mb-2">
            Reserve Your Seats
          </button>
          <p className="text-gray-300 mt-4 max-w-md">
            Choose your favorite events and reserve your place now. Stay updated on schedules and featured performers effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
}