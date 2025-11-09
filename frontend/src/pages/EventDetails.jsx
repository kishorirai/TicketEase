import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  X,
} from "lucide-react";
import { fetchEventDetails } from "./api"; // Adjust if your api.js is elsewhere

const EventDetailsPage = () => {
  const { id } = useParams(); // event id from route
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTickets, setSelectedTickets] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchEventDetails(id)
      .then((data) => setEvent(data))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Only one of each ticket should show if DB is clean
  const ticketCategories = event?.ticket_types || [];

  const handleTicketChange = (ticketId, change) => {
    setSelectedTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const max = 10;
      const newCount = Math.max(0, Math.min(max, currentCount + change));
      if (newCount === 0) {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ticketId]: newCount };
    });
  };

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, count]) => {
      const ticket = ticketCategories.find((t) => String(t.id) === String(ticketId));
      return total + (ticket ? ticket.price * count : 0);
    }, 0);
  };
  const getTotalTickets = () =>
    Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      event && event.images ? (prev + 1) % event.images.length : 0
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      event && event.images
        ? (prev - 1 + event.images.length) % event.images.length
        : 0
    );

  // Format date to YYYY-MM-DD
  const formattedDate = event?.date
    ? event.date.slice(0, 10)
    : "";

  if (loading) {
    return (
      <div className="text-center py-32 text-2xl text-gray-500">
        Loading event details…
      </div>
    );
  }
  if (error || !event) {
    return (
      <div className="text-center py-32 text-2xl text-red-500">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
        <div className="relative h-full">
          {event.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${event.title} - ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          {/* Image Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {event.images?.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="inline-block px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold mb-3">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
              <p className="text-xl text-gray-200">{event.subtitle}</p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Calendar className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formattedDate}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Clock className="w-6 h-6 text-green-500 mb-2" />
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{event.time || ""}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Users className="w-6 h-6 text-purple-500 mb-2" />
                <p className="text-sm text-gray-600">Attendees</p>
                <p className="font-semibold">{event.attendees || "2,500+"}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">
                  {event.rating} ({event.reviews})
                </p>
              </div>
            </div>
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line">
                {event.description}
              </div>
              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Event Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Google Maps Integration */}
            {event.address && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Event Location</h2>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">{event.location}</p>
                    <p className="text-gray-600">{event.address}</p>
                  </div>
                </div>
                <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    title="Event Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${encodeURIComponent(event.address)}&zoom=15`}
                    allowFullScreen
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Open in Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            )}
          </div>
          {/* Right: Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
                <div className="space-y-4">
                  {ticketCategories.length === 0 && (
                    <div className="text-gray-500">
                      Ticket categories not available.
                    </div>
                  )}
                  {ticketCategories.map((ticket, index) => {
                    const count = selectedTickets[ticket.id] || 0;
                    const available =
                      ticket.available ?? ticket.remaining ?? 0;
                    const total = ticket.total ?? ticket.total_seats ?? 1;
                    const availabilityPercent =
                      total > 0 ? (available / total) * 100 : 0;
                    return (
                      <div
                        key={ticket.id}
                        className="relative border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all duration-300"
                      >
                        {/* Optionally render ticket.badge... */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">
                              {ticket.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {ticket.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {ticket.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  ${ticket.originalPrice}
                                </span>
                              )}
                              <span className="text-2xl font-bold text-gray-800">
                                ${ticket.price}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Features */}
                        {ticket.features && ticket.features.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {ticket.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >
                                <Check className="w-4 h-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Availability Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{available} available</span>
                            <span>{Math.round(availabilityPercent)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${
                                availabilityPercent > 50
                                  ? "from-green-400 to-green-600"
                                  : availabilityPercent > 20
                                  ? "from-yellow-400 to-yellow-600"
                                  : "from-red-400 to-red-600"
                              } transition-all duration-500`}
                              style={{ width: `${availabilityPercent}%` }}
                            />
                          </div>
                        </div>
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleTicketChange(ticket.id, -1)
                              }
                              disabled={count === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                count === 0
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">
                              {count}
                            </span>
                            <button
                              onClick={() =>
                                handleTicketChange(ticket.id, 1)
                              }
                              disabled={count >= 10 || available === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                count >= 10 || available === 0
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-purple-600 text-white hover:bg-purple-700"
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Booking Summary */}
              {getTotalTickets() > 0 && (
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
                  <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                  <div className="space-y-2 mb-4">
                    {Object.entries(selectedTickets).map(([ticketId, count]) => {
                      const ticket = ticketCategories.find(
                        (t) => String(t.id) === String(ticketId)
                      );
                      return (
                        <div key={ticketId} className="flex justify-between text-sm">
                          <span>
                            {ticket?.name} × {count}
                          </span>
                          <span className="font-semibold">
                            $ {ticket ? ticket.price * count : 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/30 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-3xl font-bold">${getTotalAmount()}</span>
                    </div>
                    <p className="text-xs text-white/80 mt-1">
                      {getTotalTickets()}{" "}
                      {getTotalTickets() === 1 ? "ticket" : "tickets"} selected
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate("/bookings")}
                    className="w-full mt-3 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Book Now
                  </button>
                  <p className="text-xs text-center text-white/80 mt-3">
                    🔒 Secure payment · Instant confirmation
                  </p>
                </div>
              )}
              {/* Organizer Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold mb-3">Organized by</h3>
                <p className="text-gray-700 font-semibold">{event.organizer}</p>
                <button className="mt-3 w-full border-2 border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  Contact Organizer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Complete Booking</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="bg-purple-50 rounded-lg p-4 mt-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${getTotalAmount()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getTotalTickets()} tickets</p>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 mt-6">
                Confirm & Pay ${getTotalAmount()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;