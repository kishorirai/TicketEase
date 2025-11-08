import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

// Pricing tiers data
const pricingTiers = [
  {
    title: "Basic",
    price: "$99",
    sub: "Get a seat",
    features: [
      "Full event access",
      "Access to keynote & breakout sessions",
      "Networking opportunities",
      "Access to post-event session recordings",
      "Conference materials and swag bag"
    ]
  },
  {
    title: "Premium",
    price: "$399",
    sub: "Get a seat",
    features: [
      "Full event access",
      "Access to keynote & breakout sessions",
      "Networking opportunities",
      "Access to post-event session recordings",
      "Conference materials and swag bag"
    ]
  }
];

// FAQs data
const faqs = [
  { q: "Will the talks be recorded?", a: "Yes, conference talks will be recorded and made available to attendees after the event." },
  { q: "Is this event just for designers?", a: "No, it's for designers, developers, tech leaders, entrepreneurs, and anyone passionate about IT." },
  { q: "Does my ticket cover everything?", a: "Your ticket covers all main conference events, sessions, and access to recordings." },
  { q: "Can I refund or transfer my ticket?", a: "Refund and transfer policies are outlined during checkout—contact support for details." },
  { q: "What is the conference about ?", a: "Summitra 2025 is about innovation in IT, including AI, SaaS, apps, networking, and emerging tech." },
  { q: "Are there any perks with my ticket?", a: "Attendees receive conference materials, a swag bag, access to all sessions, and networking activities." },
  { q: "What does my ticket include?", a: "All conference events, meals, networking opportunities, and exclusive content." },
  { q: "How to become a speaker?", a: "Submit your proposal through our website. Selected applicants will be notified via email." },
];

const TicketPricingFAQFooter = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Pricing Section */}
      <section className="min-h-screen py-20 relative overflow-hidden rounded-t-[80px]" style={{ background: "#8A6EFF" }}>
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
            <path fill="none" stroke="url(#grad1)" strokeWidth="3" d="M0,100 Q250,50 500,100 T1000,100 T1500,100" opacity="0.6">
              <animate attributeName="d" dur="8s" repeatCount="indefinite"
                values="M0,100 Q250,50 500,100 T1000,100 T1500,100;
                        M0,100 Q250,150 500,100 T1000,100 T1500,100;
                        M0,100 Q250,50 500,100 T1000,100 T1500,100"/>
            </path>
            <path fill="none" stroke="url(#grad1)" strokeWidth="3" d="M0,200 Q250,150 500,200 T1000,200 T1500,200" opacity="0.5">
              <animate attributeName="d" dur="10s" repeatCount="indefinite"
                values="M0,200 Q250,150 500,200 T1000,200 T1500,200;
                        M0,200 Q250,250 500,200 T1000,200 T1500,200;
                        M0,200 Q250,150 500,200 T1000,200 T1500,200"/>
            </path>
            <path fill="none" stroke="url(#grad1)" strokeWidth="4" d="M0,300 Q250,250 500,300 T1000,300 T1500,300" opacity="0.7">
              <animate attributeName="d" dur="12s" repeatCount="indefinite"
                values="M0,300 Q250,250 500,300 T1000,300 T1500,300;
                        M0,300 Q250,350 500,300 T1000,300 T1500,300;
                        M0,300 Q250,250 500,300 T1000,300 T1500,300"/>
            </path>
            <path fill="none" stroke="url(#grad1)" strokeWidth="3" d="M0,450 Q250,400 500,450 T1000,450 T1500,450" opacity="0.4">
              <animate attributeName="d" dur="15s" repeatCount="indefinite"
                values="M0,450 Q250,400 500,450 T1000,450 T1500,450;
                        M0,450 Q250,500 500,450 T1000,450 T1500,450;
                        M0,450 Q250,400 500,450 T1000,450 T1500,450"/>
            </path>
          </svg>
        </div>
        
        {/* CSS Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0) scale(1);
            }
            33% {
              transform: translateY(-30px) translateX(20px) scale(1.1);
            }
            66% {
              transform: translateY(-15px) translateX(-20px) scale(0.9);
            }
          }
          
          @keyframes moveGradient {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(50px, 50px) scale(1.1);
            }
          }
        `}</style>
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4" style={{ color: "#FFE302" }}>
              Pricing For Tickets
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Explore our lineup of keynote speakers and industry leaders who will inspire and enlighten at the conference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={tier.title}
                className="rounded-3xl px-10 py-12 flex flex-col items-start relative"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="absolute top-6 left-6 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#8A6EFF' }}>{tier.title}</div>
                <div className="text-6xl font-black mb-3 mt-4" style={{ color: "#FFE302" }}>{tier.price}</div>
                <div className="font-semibold text-lg text-white mb-2">{tier.sub}</div>
                <p className="text-white mb-8 text-sm leading-relaxed" style={{ opacity: 0.9 }}>
                  Explore our lineup of keynote speakers and industry leaders who will inspire and enlighten at the conference.
                </p>
                <ul className="mb-10 text-white text-base space-y-3.5 w-full">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <span className="text-yellow-300 text-xl font-bold flex-shrink-0 mt-0.5">+</span>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full flex justify-center items-center py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl" style={{ background: 'white', color: '#8A6EFF' }}>
                  Buy Ticket <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black text-white py-20 rounded-t-[80px] relative z-20" style={{ marginTop: '-80px' }}>
        <div className="container mx-auto px-8">
          <h2 className="text-5xl font-black mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-black border border-gray-800 rounded-xl px-6 py-5 flex flex-col cursor-pointer transition hover:bg-gray-900"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{faq.q}</span>
                  <span className="text-2xl font-bold">
                    {openFaq === i ? "-" : "+"}
                  </span>
                </div>
                {openFaq === i && (
                  <div className="mt-4 text-gray-400 text-base">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ background: "#8A6EFF" }} className="rounded-t-[80px] relative z-20" style={{ background: "#8A6EFF", marginTop: '-80px' }}>
        <div className="container mx-auto px-8 py-16">
          <div className="flex flex-col lg:flex-row items-end justify-between">
            <div>
              <div className="text-4xl font-black text-white mb-3">Summitra</div>
              <p className="text-white opacity-80 max-w-sm mb-4">
                Thank you for exploring our world through the lens. From capturing cherished memories to unveiling the beauty of the everyday.
              </p>
            </div>
            <div className="flex flex-col items-end mb-5 lg:mb-0">
              <div className="inline-block bg-white bg-opacity-20 px-8 py-3 rounded-full text-lg font-semibold text-white" style={{border:'2px solid white'}}>
                August 20
              </div>
              <div className="mt-2 text-yellow-300 font-bold text-2xl lg:text-3xl">Largest 2025 IT Conference.</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-8 text-white opacity-80 text-sm border-t border-white border-opacity-20 pt-5">
            <span>Style guide</span>
            <span>Instructions</span>
            <span>License</span>
            <span>Changelog</span>
            <span>404</span>
            <span className="ml-auto text-white opacity-60">Design by Summitra - Powered by Webflow</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketPricingFAQFooter;