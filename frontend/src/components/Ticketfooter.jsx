import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      "Conference materials and swag bag",
    ],
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
      "Conference materials and swag bag",
    ],
  },
];

// FAQ data
const faqs = [
  {
    q: "How do I book tickets?",
    a: "Browse your favorite event, select your seats or ticket type, and complete payment securely through our platform.",
  },
  {
    q: "Can I cancel or refund my booking?",
    a: "Refund and cancellation policies depend on the event organizer. You can check specific terms on the event’s booking page.",
  },
  {
    q: "Will I receive a physical ticket?",
    a: "No, all tickets are digital. Once you complete your booking, your e-ticket will be sent instantly to your registered email.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI, and digital wallets for a quick and secure checkout experience.",
  },
  {
    q: "How can I check seat availability?",
    a: "Seat or ticket availability is shown live on each event page, updating instantly as bookings are made.",
  },
  {
    q: "What happens if the event is canceled?",
    a: "If an event is canceled, you’ll receive a full refund automatically within 5–7 business days.",
  },
  {
    q: "Do I need to create an account to book tickets?",
    a: "You can book as a guest, but creating an account lets you easily track bookings and access your tickets anytime.",
  },
  {
    q: "Is my payment information safe?",
    a: "Absolutely. We use encrypted payment gateways and never store your card or banking details.",
  },
];

const TicketPricingFAQFooter = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      {/* Pricing Section */}
      <section
        className="min-h-screen py-20 relative overflow-hidden rounded-t-[80px]"
        style={{ background: "#8A6EFF" }}
      >
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-bold mb-4"
              style={{ color: "#FFE302" }}
            >
              Pricing For Tickets
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Choose the ticket that best fits your needs and enjoy full
              access to our events.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={tier.title}
                className="rounded-3xl px-10 py-12 flex flex-col items-start relative"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="absolute top-6 left-6 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider"
                  style={{ background: "rgba(255, 255, 255, 0.25)", color: "#8A6EFF" }}
                >
                  {tier.title}
                </div>
                <div
                  className="text-6xl font-black mb-3 mt-4"
                  style={{ color: "#FFE302" }}
                >
                  {tier.price}
                </div>
                <div className="font-semibold text-lg text-white mb-2">{tier.sub}</div>
                <p className="text-white mb-8 text-sm leading-relaxed" style={{ opacity: 0.9 }}>
                  Enjoy the best experience at our events with full access.
                </p>
                <ul className="mb-10 text-white text-base space-y-3.5 w-full">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <span className="text-yellow-300 text-xl font-bold flex-shrink-0 mt-0.5">+</span>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/events")}
                  className="w-full flex justify-center items-center py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                  style={{ background: "white", color: "#8A6EFF" }}
                >
                  Buy Ticket <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black text-white py-20 rounded-t-[80px] relative z-20" style={{ marginTop: "-80px" }}>
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
                  <span className="text-2xl font-bold">{openFaq === i ? "-" : "+"}</span>
                </div>
                {openFaq === i && <div className="mt-4 text-gray-400 text-base">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="rounded-t-[80px] relative z-20"
        style={{ background: "#8A6EFF", marginTop: "-80px" }}
      >
        <div className="container mx-auto px-8 py-16">
          <div className="flex flex-col lg:flex-row items-end justify-between">
            <div>
              <div className="text-4xl font-black text-white mb-3">TICKETEASE</div>
              <p className="text-white opacity-80 max-w-sm mb-4">
                Thank you for being part of our journey to make live experiences more accessible. From concerts to conferences — we bring you closer to the moments that matter.
              </p>
            </div>
           
          </div>
          <div className="flex flex-wrap gap-6 mt-8 text-white opacity-80 text-sm border-t border-white border-opacity-20 pt-5">
            <span>Style guide</span>
            <span>Instructions</span>
            <span>License</span>
            <span>Changelog</span>
            <span>404</span>
            <span className="ml-auto text-white opacity-60">Design by Kishori</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketPricingFAQFooter;
