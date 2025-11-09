import React from "react";

const eventsSchedule = [
  {
    id: 1,
    time: "10:00 - 12:00",
    title: "Rhythm Fest 2025",
    description: "Kick off your day with live music, amazing performers, and non-stop entertainment.",
    performers: ["DJ Alex", "The Beat Band"],
  },
  {
    id: 2,
    time: "12:30 - 02:00",
    title: "Tech Expo Summit",
    description: "Explore the latest in technology, startups, and innovation showcases at this exciting expo.",
    performers: ["TechVision Team"],
  },
  {
    id: 3,
    time: "02:30 - 03:30",
    title: "Comedy Carnival",
    description: "Laugh out loud with some of the best stand-up comedians performing live.",
    performers: ["Funny Bones"],
  },
  {
    id: 4,
    time: "04:00 - 05:30",
    title: "Film Fiesta Premiere",
    description: "Watch exclusive premieres of the latest blockbuster films with special guest appearances.",
    performers: ["Director Smith", "Actor Lee"],
  },
  {
    id: 5,
    time: "06:00 - 08:00",
    title: "Sports Mania: Cricket League",
    description: "Catch thrilling cricket matches live with top teams battling it out on the field.",
    performers: ["Team Titans", "Team Warriors"],
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
                  transform: `translateY(${index * 14}px) scale(${1 - index * 0.04})`,
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="text-xs font-bold text-yellow-400 mr-4">{event.time}</div>
                  <div className="text-xl font-bold text-white">{event.title}</div>
                </div>
                <div className="text-gray-300 mb-4">{event.description}</div>
                {event.performers.length > 0 && (
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

        {/* Right Column: CTA */}
        <div className="md:sticky md:top-28 flex flex-col items-start justify-start pt-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Plan Your Day</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-pink-700 shadow-xl transition-all mb-2">
            Book Your Tickets
          </button>
          <p className="text-gray-300 mt-4 max-w-md">
            Select the events you want to attend and secure your spot. Keep track of timings and performers easily.
          </p>
        </div>
      </div>
    </section>
  );
}
