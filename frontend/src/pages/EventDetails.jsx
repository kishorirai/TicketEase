import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Users, Star, Share2, Heart, ChevronLeft, ChevronRight, Plus, Minus, Check,
} from "lucide-react";
import { fetchEventById } from "./api";
import { isAuthenticated } from "../utils/auth";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTickets, setSelectedTickets] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  
  // Load event from backend
  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchEventById(id);
        setEvent(data);
        setCurrentImageIndex(0);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message || "Event not found");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

  const ticketCategories = event?.ticket_types || [];
  
  const handleTicketChange = (ticketId, change) => {
    setSelectedTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const ticket = ticketCategories.find((t) => String(t._id || t.id) === String(ticketId));
      const maxAvailable = ticket?.available || 0;
      const max = Math.min(10, maxAvailable);
      const newCount = Math.max(0, Math.min(max, currentCount + change));
      
      if (newCount === 0) {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ticketId]:  newCount };
    });
  };

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, count]) => {
      const ticket = ticketCategories.find((t) => String(t._id || t.id) === String(ticketId));
      return total + (ticket ?  ticket.price * count : 0);
    }, 0);
  };

  const getTotalTickets = () =>
    Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      event && event.images ?  (prev + 1) % event.images.length : 0
    );
    
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      event && event. images
        ? (prev - 1 + event.images.length) % event.images.length
        :  0
    );

  // handle proceed:  check auth and navigate accordingly
  const handleProceed = () => {
    const totalTickets = getTotalTickets();
    
    // Validate that tickets are selected
    if (totalTickets === 0) {
      alert("Please select at least one ticket");
      return;
    }

    const payload = { event, selectedTickets };
    
    // Debug logs
    console.log("[EventDetails] Proceed clicked");
    console.log("Total Tickets:", totalTickets);
    console.log("Is Authenticated:", isAuthenticated());
    console.log("Auth Token:", localStorage.getItem("authToken"));
    console.log("Auth User:", localStorage.getItem("authUser"));
    
    if (isAuthenticated()) {
      console.log("✅ User is authenticated, navigating to /bookings");
      navigate("/bookings", { state: payload });
    } else {
      console.log("❌ User is NOT authenticated, navigating to /auth");
      // Send the intended redirect and payload
      navigate("/auth", { state: { redirectTo: "/bookings", payload } });
    }
  };

  // Format date and time from event
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "TBA", time: "TBA" };
    
    try {
      const eventDate = new Date(dateString);
      const displayDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const displayTime = eventDate.toLocaleTimeString('en-US', { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      return { date: displayDate, time: displayTime };
    } catch (err) {
      return { date: "Invalid Date", time: "" };
    }
  };

  const { date:  formattedDate, time: formattedTime } = event ?  formatDateTime(event.date) : { date: "", time: "" };

  // Calculate total seats and availability
  const getTotalSeats = () => {
    if (!ticketCategories.length) return 0;
    return ticketCategories.reduce((sum, t) => sum + (t.total || 0), 0);
  };

  const getAvailableSeats = () => {
    if (!ticketCategories. length) return 0;
    return ticketCategories.reduce((sum, t) => sum + (t.available || 0), 0);
  };

  // Get rating (placeholder - you'll need to implement reviews system)
  const rating = event?.rating || 4.5;
  const reviews = event?.reviews || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-2xl text-gray-600">Loading event details…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const images = event.images && event.images.length > 0 
    ? event.images 
    : ["https://via.placeholder.com/1600x500? text=Event+Image"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
        <div className="relative h-full">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${event.title} - ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1600x500?text=Event+Image";
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {images.length > 1 && (
            <>
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
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              {event.category && (
                <div className="inline-block px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold mb-3">
                  {event.category}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
              {event.subtitle && (
                <p className="text-xl text-gray-200">{event.subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.title,
                    text: event.subtitle || event.description,
                    url: window. location.href,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window. location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard 
                icon={<Calendar className="w-6 h-6 text-blue-500 mb-2" />} 
                label="Date" 
                value={formattedDate} 
              />
              <InfoCard 
                icon={<Clock className="w-6 h-6 text-green-500 mb-2" />} 
                label="Time" 
                value={formattedTime} 
              />
              <InfoCard 
                icon={<Users className="w-6 h-6 text-purple-500 mb-2" />} 
                label="Available" 
                value={`${getAvailableSeats()} / ${getTotalSeats()}`} 
              />
              <InfoCard 
                icon={<Star className="w-6 h-6 text-yellow-500 mb-2" />} 
                label="Rating" 
                value={reviews > 0 ? `${rating} (${reviews})` : "New Event"} 
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line">
                {event.description || "No description available. "}
              </div>
              
              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Event Highlights</h3>
                  <HighlightsList highlights={event.highlights} />
                </div>
              )}
            </div>

            {(event.address || event.location) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Event Location</h2>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">{event.location}</p>
                    {event.address && (
                      <p className="text-gray-600">{event.address}</p>
                    )}
                  </div>
                </div>
                
                {event.address && (
                  <>
                    <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-inner bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-gray-400" />
                      <p className="text-gray-500 ml-2">Map view</p>
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right:  Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
                <TicketSelector
                  ticketCategories={ticketCategories}
                  selectedTickets={selectedTickets}
                  handleTicketChange={handleTicketChange}
                />
              </div>
              
              {getTotalTickets() > 0 && (
                <BookingSummary
                  ticketCategories={ticketCategories}
                  selectedTickets={selectedTickets}
                  getTotalTickets={getTotalTickets}
                  getTotalAmount={getTotalAmount}
                  onProceed={handleProceed}
                />
              )}
              
              {event.organizer && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold mb-3">Organized by</h3>
                  <p className="text-gray-700 font-semibold">{event. organizer}</p>
                  <button className="mt-3 w-full border-2 border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    Contact Organizer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI helper components
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
      {icon}
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function HighlightsList({ highlights }) {
  return (
    <div className="grid grid-cols-1 md: grid-cols-2 gap-3">
      {highlights.map((highlight, idx) => (
        <div key={idx} className="flex items-center gap-2 text-gray-700">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span>{highlight}</span>
        </div>
      ))}
    </div>
  );
}

function TicketSelector({ ticketCategories, selectedTickets, handleTicketChange }) {
  if (ticketCategories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No tickets available at this time. </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ticketCategories.map((ticket) => {
        const ticketId = ticket._id || ticket.id;
        const count = selectedTickets[ticketId] || 0;
        const available = ticket.available || 0;
        const total = ticket.total || 1;
        const availabilityPercent = total > 0 ? (available / total) * 100 : 0;
        
        return (
          <div
            key={ticketId}
            className="relative border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{ticket.name}</h3>
                {ticket.description && (
                  <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {ticket.originalPrice && ticket.originalPrice > ticket.price && (
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
            
            {ticket.features && ticket.features.length > 0 && (
              <div className="space-y-1 mb-3">
                {ticket.features. map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mb-2">
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
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTicketChange(ticketId, -1)}
                  disabled={count === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    count === 0 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-lg">{count}</span>
                <button
                  onClick={() => handleTicketChange(ticketId, 1)}
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
  );
}

function BookingSummary({ ticketCategories, selectedTickets, getTotalTickets, getTotalAmount, onProceed }) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
      <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
      <div className="space-y-2 mb-4">
        {Object.entries(selectedTickets).map(([ticketId, count]) => {
          const ticket = ticketCategories.find((t) => String(t._id || t.id) === String(ticketId));
          return (
            <div key={ticketId} className="flex justify-between text-sm">
              <span>
                {ticket?.name} × {count}
              </span>
              <span className="font-semibold">${ticket ?  ticket.price * count : 0}</span>
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
          {getTotalTickets()} {getTotalTickets() === 1 ? "ticket" : "tickets"} selected
        </p>
      </div>
      <button
        type="button"
        onClick={onProceed}
        className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
      >
        Proceed to Checkout
      </button>
      <p className="text-xs text-center text-white/80 mt-3">🔒 Secure payment · Instant confirmation</p>
    </div>
  );
}

export default EventDetails;