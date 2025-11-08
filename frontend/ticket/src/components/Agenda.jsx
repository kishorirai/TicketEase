import React from "react";
import imgJohn from "../assets/a.png";       // John Anderson
import imgTomislav from "../assets/a.png";   // Tomislav P.
import imgEthan from "../assets/d.png";      // Ethan Zhao
import imgJonathan from "../assets/b.png";   // Jonathan
import imgAhmed from "../assets/c.png";      // Ahmed Faizal

const schedule = [
  {
    id: 1,
    time: "09:40 - 10:00 am",
    title: "Opening",
    description:
      "Kick off the day with a warm welcome from the host. We'll walk through the schedule, introduce key speakers, and set the tone for an inspiring day.",
    speakers: []
  },
  {
    id: 2,
    time: "10:30 - 11:50 am",
    title: "Keynote Speech: The Future of Tech",
    description:
      "A visionary talk by our headline speaker on where technology is heading—AI, SaaS, and enterprise innovation.",
    speakers: [
      { name: "Tomislav P.", img: imgTomislav },
      { name: "Ethan Zhao", img: imgEthan }
    ]
  },
  {
    id: 3,
    time: "11:50 - 12:50 pm",
    title: "Generative App Showcase",
    description:
      "Live demos of exciting new SaaS products, apps, and platforms. A mix of startup spotlights and enterprise innovation.",
    speakers: [
      { name: "John Anderson", img: imgJohn }
    ]
  },
  {
    id: 4,
    time: "01:30 - 02:30 pm",
    title: "Networking Lunch",
    description:
      "Enjoy tasty food, meet other attendees, and make real connections. Swap ideas, business cards, and maybe your next partnership.",
    speakers: []
  },
  {
    id: 5,
    time: "03:00 - 04:30 pm",
    title: "Building Scalable Products",
    description:
      "Dive deep into the strategies and tools used by tech giants to build and manage products that can handle massive growth.",
    speakers: [
      { name: "Jonathan", img: imgJonathan },
      { name: "Ahmed Faizal", img: imgAhmed }
    ]
  }
];

export default function AgendaSection() {
  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Stacking Schedule Cards */}
        <div className="relative">
          {schedule.map((item, index) => (
            <div
              key={item.id}
              className="sticky top-24 mb-8"
              style={{
                zIndex: index + 10
              }}
            >
              <div
                className="bg-gray-900 border-2 border-cyan-400 rounded-2xl p-8 shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300 max-w-lg mx-auto lg:mx-0"
                style={{
                  transform: `translateY(${index * 14}px) scale(${1 - index * 0.04})`
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="text-xs font-bold text-cyan-400 mr-4">{item.time}</div>
                  <div className="text-xl font-bold text-white">{item.title}</div>
                </div>
                <div className="text-gray-300 mb-4">{item.description}</div>
                {item.speakers.length > 0 && (
                  <div className="flex gap-4 mt-3">
                    {item.speakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <img
                          src={speaker.img}
                          alt={speaker.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
                        />
                        <span className="text-sm text-white">{speaker.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="h-96"></div>
        </div>
        {/* Right Column: Fixed Heading and CTA */}
        <div className="md:sticky md:top-28 flex flex-col items-start justify-start pt-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Organize Your Schedule</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-pink-700 shadow-xl transition-all mb-2">
            Buy Ticket
          </button>
        </div>
      </div>
    </section>
  );
}