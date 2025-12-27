import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Users, Star, Share2, Heart, ChevronLeft, ChevronRight, 
  Plus, Minus, Check, AlertCircle, ExternalLink, Navigation, Ticket, Shield,
  TrendingUp, Award, MessageCircle, Download, Bell, X, Zap, Gift, Info,
  ChevronDown, ChevronUp, Facebook, Twitter, Linkedin, Copy, Mail
} from "lucide-react";
import { fetchEventById } from "./api";
import { isAuthenticated } from "../utils/auth";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTickets, setSelectedTickets] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  // Load event from backend
  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchEventById(id);
        setEvent(data);
        setCurrentImageIndex(0);
        
        // Load saved preferences
        const savedLikes = JSON.parse(localStorage.getItem("likedEvents") || "[]");
        setIsLiked(savedLikes.includes(id));
        
        const savedReminders = JSON.parse(localStorage. getItem("eventReminders") || "[]");
        setReminderSet(savedReminders.includes(id));
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

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (summaryRef.current) {
        const rect = summaryRef.current.getBoundingClientRect();
        setShowStickyBar(rect. top < -100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance images
  useEffect(() => {
    if (! event?. images || event.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [event]);

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
      
      // Show notification for ticket change
      showNotificationMessage(`${change > 0 ? 'Added' : 'Removed'} ${ticket?.name}`);
      
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

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      event && event.images ?  (prev + 1) % event.images.length : 0
    );
  };
    
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      event && event.images
        ? (prev - 1 + event.images.length) % event.images.length
        :  0
    );
  };

  const handleProceed = () => {
    const totalTickets = getTotalTickets();
    
    if (totalTickets === 0) {
      showNotificationMessage("⚠️ Please select at least one ticket");
      return;
    }

    const payload = { event, selectedTickets };
    
    if (isAuthenticated()) {
      navigate("/bookings", { state: payload });
    } else {
      navigate("/auth", { state: { redirectTo: "/bookings", payload } });
    }
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    const savedLikes = JSON.parse(localStorage.getItem("likedEvents") || "[]");
    if (newLikedState) {
      savedLikes.push(id);
      showNotificationMessage("❤️ Added to favorites!");
    } else {
      const index = savedLikes.indexOf(id);
      if (index > -1) savedLikes.splice(index, 1);
      showNotificationMessage("Removed from favorites");
    }
    localStorage.setItem("likedEvents", JSON.stringify(savedLikes));
  };

  const handleReminder = () => {
    const newReminderState = !reminderSet;
    setReminderSet(newReminderState);
    
    const savedReminders = JSON.parse(localStorage.getItem("eventReminders") || "[]");
    if (newReminderState) {
      savedReminders.push(id);
      showNotificationMessage("🔔 Reminder set successfully!");
    } else {
      const index = savedReminders.indexOf(id);
      if (index > -1) savedReminders.splice(index, 1);
      showNotificationMessage("Reminder removed");
    }
    localStorage.setItem("eventReminders", JSON.stringify(savedReminders));
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${event.title}! `;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php? u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard. writeText(url);
      setCopiedLink(true);
      showNotificationMessage("🔗 Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "TBA", time: "TBA", isPast: false, daysUntil: null };
    
    try {
      const eventDate = new Date(dateString);
      const now = new Date();
      const diffTime = eventDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const displayDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const displayTime = eventDate.toLocaleTimeString('en-US', { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      return { 
        date: displayDate, 
        time: displayTime, 
        isPast: diffTime < 0,
        daysUntil:  diffDays > 0 ? diffDays :  null
      };
    } catch (err) {
      return { date: "Invalid Date", time: "", isPast: false, daysUntil: null };
    }
  };

  const { date:  formattedDate, time: formattedTime, isPast, daysUntil } = 
    event ?  formatDateTime(event.date) : { date: "", time: "", isPast: false, daysUntil: null };

  const getTotalSeats = () => {
    if (!ticketCategories. length) return 0;
    return ticketCategories.reduce((sum, t) => sum + (t.total || 0), 0);
  };

  const getAvailableSeats = () => {
    if (!ticketCategories.length) return 0;
    return ticketCategories.reduce((sum, t) => sum + (t.available || 0), 0);
  };

  const getAvailabilityStatus = () => {
    const available = getAvailableSeats();
    const total = getTotalSeats();
    const percentage = (available / total) * 100;
    
    if (percentage > 50) return { color: "green", text: "Good Availability" };
    if (percentage > 20) return { color: "yellow", text: "Selling Fast" };
    if (percentage > 0) return { color: "red", text: "Almost Sold Out" };
    return { color: "gray", text: "Sold Out" };
  };

  const rating = event?.rating || 4.5;
  const reviews = event?.reviews || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
            <Ticket className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-700 mt-6">Loading your experience...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing event details</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
          <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Event Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Explore All Events
          </button>
        </div>
      </div>
    );
  }

  const images = event.images && event.images.length > 0 
    ? event.images 
    : ["https://via.placeholder.com/1600x500? text=Event+Image"];

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border-l-4 border-purple-600">
            <div className="bg-purple-100 rounded-full p-2">
              <Check className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-800">{notificationMessage}</p>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar (Mobile) */}
      {showStickyBar && getTotalTickets() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40 lg:hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{getTotalTickets()} tickets</p>
              <p className="text-2xl font-bold text-gray-800">${getTotalAmount()}</p>
            </div>
            <button
              onClick={handleProceed}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Share Event</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <ShareButton icon={<Facebook />} label="Facebook" color="bg-blue-600" onClick={() => handleShare('facebook')} />
              <ShareButton icon={<Twitter />} label="Twitter" color="bg-sky-500" onClick={() => handleShare('twitter')} />
              <ShareButton icon={<Linkedin />} label="LinkedIn" color="bg-blue-700" onClick={() => handleShare('linkedin')} />
              <ShareButton icon={<Mail />} label="Email" color="bg-gray-600" onClick={() => handleShare('email')} />
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 pr-24 text-sm"
              />
              <button
                onClick={() => handleShare('copy')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  copiedLink ? 'bg-green-500 text-white' :  'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isImageFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setIsImageFullscreen(false)}>
          <button className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-3 hover:bg-black/70">
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[currentImageIndex]}
            alt={event. title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Hero Section with Image Gallery */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="relative h-full">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${event.title} - ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 cursor-zoom-in ${
                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              onClick={() => setIsImageFullscreen(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1600x600?text=Event+Image";
              }}
            />
          ))}
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30" />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-full transition-all shadow-xl group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-full transition-all shadow-xl group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images. map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? "w-10 bg-white shadow-lg" 
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Event Header Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-3 mb-4">
                {event.category && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-sm font-bold text-white shadow-lg">
                    {event.category}
                  </span>
                )}
                {isPast && (
                  <span className="px-4 py-2 bg-red-500 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Event Ended
                  </span>
                )}
                {! isPast && daysUntil !== null && daysUntil <= 7 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2 animate-pulse">
                    <Zap className="w-4 h-4" /> {daysUntil} {daysUntil === 1 ? 'Day' : 'Days'} Left
                  </span>
                )}
                {availabilityStatus.color === 'red' && (
                  <span className="px-4 py-2 bg-red-600 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2 animate-pulse">
                    <TrendingUp className="w-4 h-4" /> Almost Sold Out
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-2xl">
                {event.title}
              </h1>
              
              {event.subtitle && (
                <p className="text-xl md:text-2xl text-gray-100 drop-shadow-lg max-w-3xl">
                  {event. subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons (Top Right) */}
          <div className="absolute top-6 right-6 flex gap-3">
            <ActionButton
              icon={<Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />}
              active={isLiked}
              onClick={handleLike}
              tooltip="Add to Favorites"
            />
            <ActionButton
              icon={<Bell className={`w-5 h-5 ${reminderSet ? "fill-current" : ""}`} />}
              active={reminderSet}
              onClick={handleReminder}
              tooltip="Set Reminder"
            />
            <ActionButton
              icon={<Share2 className="w-5 h-5" />}
              onClick={() => setShowShareModal(true)}
              tooltip="Share Event"
            />
            <ActionButton
              icon={<Download className="w-5 h-5" />}
              onClick={() => showNotificationMessage("📥 Download feature coming soon!")}
              tooltip="Download Info"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg: col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard 
                icon={<Calendar className="w-6 h-6 text-blue-600" />} 
                label="Date" 
                value={formattedDate}
                gradient="from-blue-50 to-blue-100"
              />
              <InfoCard 
                icon={<Clock className="w-6 h-6 text-green-600" />} 
                label="Time" 
                value={formattedTime}
                gradient="from-green-50 to-green-100"
              />
              <InfoCard 
                icon={<Users className="w-6 h-6 text-purple-600" />} 
                label="Seats Available" 
                value={`${getAvailableSeats()} / ${getTotalSeats()}`}
                gradient="from-purple-50 to-purple-100"
                badge={availabilityStatus.text}
                badgeColor={availabilityStatus.color}
              />
              <InfoCard 
                icon={<Star className="w-6 h-6 text-yellow-600" />} 
                label="Rating" 
                value={reviews > 0 ? `${rating} ⭐` : "New Event"}
                gradient="from-yellow-50 to-yellow-100"
                subtext={reviews > 0 ?  `${reviews} reviews` : "Be the first"}
              />
            </div>

            {/* Event Description */}
            <ExpandableSection
              title="About This Event"
              icon={<Info className="w-6 h-6" />}
              defaultExpanded={true}
              expanded={expandedSection === 'about'}
              onToggle={() => setExpandedSection(expandedSection === 'about' ? null : 'about')}
            >
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {event.description || "No description available. "}
              </div>
              
              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Event Highlights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                      >
                        <div className="bg-green-500 rounded-full p-1 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Event Info */}
              <div className="mt-8 grid grid-cols-1 md: grid-cols-2 gap-4">
                <InfoBox 
                  icon={<Shield className="w-5 h-5 text-blue-600" />}
                  title="Secure Booking"
                  description="Your payment information is encrypted and secure"
                />
                <InfoBox 
                  icon={<Gift className="w-5 h-5 text-purple-600" />}
                  title="Instant Confirmation"
                  description="Get your tickets immediately after purchase"
                />
                <InfoBox 
                  icon={<Award className="w-5 h-5 text-yellow-600" />}
                  title="Verified Event"
                  description="This event has been verified by our team"
                />
                <InfoBox 
                  icon={<MessageCircle className="w-5 h-5 text-green-600" />}
                  title="24/7 Support"
                  description="We're here to help with any questions"
                />
              </div>
            </ExpandableSection>

            {/* Location Section */}
            {(event.address || event.location) && (
              <ExpandableSection
                title="Event Location"
                icon={<MapPin className="w-6 h-6" />}
                defaultExpanded={true}
                expanded={expandedSection === 'location'}
                onToggle={() => setExpandedSection(expandedSection === 'location' ? null : 'location')}
              >
                <div className="flex items-start gap-4 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                  <div className="bg-red-500 rounded-full p-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{event.location}</h3>
                    {event.address && (
                      <p className="text-gray-600">{event.address}</p>
                    )}
                  </div>
                </div>
                
                {event.address && (
                  <>
                    {/* Map Placeholder */}
                    <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="bg-white rounded-full p-6 shadow-xl mb-4">
                          <MapPin className="w-16 h-16 text-red-500" />
                        </div>
                        <p className="text-gray-600 text-lg font-semibold">Interactive Map</p>
                        <p className="text-gray-500 text-sm">Click below to view in full</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg transform hover:scale-105"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Open in Google Maps
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg transform hover:scale-105"
                      >
                        <Navigation className="w-5 h-5" />
                        Get Directions
                      </a>
                    </div>
                  </>
                )}
              </ExpandableSection>
            )}

            {/* Reviews Section (Placeholder) */}
            <ExpandableSection
              title="Reviews & Ratings"
              icon={<Star className="w-6 h-6" />}
              badge={reviews > 0 ? `${reviews} reviews` : "Be the first"}
              expanded={expandedSection === 'reviews'}
              onToggle={() => setExpandedSection(expandedSection === 'reviews' ? null : 'reviews')}
            >
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Be the first to review this event after attending!</p>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Write a Review
                </button>
              </div>
            </ExpandableSection>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6" ref={summaryRef}>
              {/* Ticket Selection */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Ticket className="w-6 h-6" />
                      Select Tickets
                    </h2>
                  </div>
                  <p className="text-purple-100 text-sm">Choose your ticket type below</p>
                </div>
                
                <div className="p-6">
                  <TicketSelector
                    ticketCategories={ticketCategories}
                    selectedTickets={selectedTickets}
                    handleTicketChange={handleTicketChange}
                  />
                </div>
              </div>
              
              {/* Booking Summary */}
              {getTotalTickets() > 0 && (
                <BookingSummary
                  ticketCategories={ticketCategories}
                  selectedTickets={selectedTickets}
                  getTotalTickets={getTotalTickets}
                  getTotalAmount={getTotalAmount}
                  onProceed={handleProceed}
                />
              )}
              
              {/* Organizer Info */}
              {event.organizer && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Organized by
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-600">
                        {event.organizer.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-bold text-lg">{event.organizer}</p>
                      <p className="text-sm text-gray-500">Event Organizer</p>
                    </div>
                  </div>
                  <button className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Organizer
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold mb-4 text-gray-800">Why Book With Us?</h3>
                <div className="space-y-3">
                  <TrustBadge 
                    icon={<Shield className="w-5 h-5 text-green-600" />}
                    text="Secure Payment"
                  />
                  <TrustBadge 
                    icon={<Zap className="w-5 h-5 text-yellow-600" />}
                    text="Instant Confirmation"
                  />
                  <TrustBadge 
                    icon={<Award className="w-5 h-5 text-purple-600" />}
                    text="Best Price Guarantee"
                  />
                  <TrustBadge 
                    icon={<MessageCircle className="w-5 h-5 text-blue-600" />}
                    text="24/7 Customer Support"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== HELPER COMPONENTS =====

function ActionButton({ icon, active, onClick, tooltip }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg transform hover:scale-110 ${
          active 
            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        {icon}
      </button>
      {tooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover: opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function ShareButton({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-4 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex flex-col items-center gap-2 shadow-lg`}
    >
      <span className="w-6 h-6">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function InfoCard({ icon, label, value, gradient, badge, badgeColor, subtext }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-white/50`}>
      <div className="flex items-start justify-between mb-2">
        {icon}
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
            badgeColor === 'green' ?  'bg-green-500 text-white' : 
            badgeColor === 'yellow' ? 'bg-yellow-500 text-white' : 
            badgeColor === 'red' ? 'bg-red-500 text-white' : 
            'bg-gray-500 text-white'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
      <p className="font-bold text-gray-900 text-lg">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function InfoBox({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <div className="bg-white rounded-lg p-2 shadow-sm">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function ExpandableSection({ title, icon, children, badge, defaultExpanded, expanded, onToggle }) {
  const isExpanded = expanded ?? defaultExpanded;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-2">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {badge && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}

function TicketSelector({ ticketCategories, selectedTickets, handleTicketChange }) {
  if (ticketCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No tickets available at this time</p>
        <p className="text-sm text-gray-500 mt-2">Please check back later</p>
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
        const isSelected = count > 0;
        
        return (
          <div
            key={ticketId}
            className={`relative border-2 rounded-2xl p-5 transition-all duration-300 ${
              isSelected 
                ?  "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg" 
                :  "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5" />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  {ticket.name}
                  {ticket.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </h3>
                {ticket.description && (
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="flex items-center gap-2">
                  {ticket.originalPrice && ticket.originalPrice > ticket.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${ticket.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ${ticket.price}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Features */}
            {ticket.features && ticket.features.length > 0 && (
              <div className="space-y-2 mb-4 p-3 bg-white/70 rounded-xl">
                {ticket.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Availability Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-gray-600">
                  <Users className="w-3 h-3 inline mr-1" />
                  {available} of {total} available
                </span>
                <span className={`${
                  availabilityPercent > 50 ? 'text-green-600' : 
                  availabilityPercent > 20 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(availabilityPercent)}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r transition-all duration-500 ${
                    availabilityPercent > 50
                      ? "from-green-400 to-green-600"
                      : availabilityPercent > 20
                      ? "from-yellow-400 to-yellow-600"
                      :  "from-red-400 to-red-600"
                  }`}
                  style={{ width: `${availabilityPercent}%` }}
                />
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl">
              <span className="text-sm font-bold text-gray-700">Quantity: </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleTicketChange(ticketId, -1)}
                  disabled={count === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform ${
                    count === 0 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      :  "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 hover:from-purple-200 hover:to-blue-200 hover:scale-110 shadow-md"
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-10 text-center font-bold text-xl text-gray-800">{count}</span>
                <button
                  onClick={() => handleTicketChange(ticketId, 1)}
                  disabled={count >= 10 || available === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform ${
                    count >= 10 || available === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-110 shadow-lg"
                  }`}
                >
                  <Plus className="w-5 h-5" />
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
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-400">
      <div className="bg-white/10 backdrop-blur-sm p-6 border-b border-white/20">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="w-6 h-6" />
          Booking Summary
        </h3>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Ticket Breakdown */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
          {Object.entries(selectedTickets).map(([ticketId, count]) => {
            const ticket = ticketCategories.find((t) => String(t._id || t.id) === String(ticketId));
            return (
              <div key={ticketId} className="flex justify-between items-center text-white">
                <div className="flex-1">
                  <p className="font-semibold">{ticket?.name}</p>
                  <p className="text-xs text-white/70">
                    ${ticket?.price} × {count}
                  </p>
                </div>
                <span className="font-bold text-lg">${ticket ?  ticket.price * count : 0}</span>
              </div>
            );
          })}
        </div>
        
        {/* Total */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border-2 border-white/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-lg font-semibold">Total Amount</span>
            <span className="text-white text-4xl font-bold">${getTotalAmount()}</span>
          </div>
          <p className="text-white/90 text-sm flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            {getTotalTickets()} {getTotalTickets() === 1 ? "ticket" : "tickets"} selected
          </p>
        </div>
        
        {/* Proceed Button */}
        <button
          type="button"
          onClick={onProceed}
          className="w-full bg-white text-purple-600 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
        >
          <Shield className="w-5 h-5" />
          Proceed to Secure Checkout
        </button>
        
        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 text-white/80 text-xs pt-2">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add custom animations to your CSS/Tailwind config
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slide-down {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 2000px;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
  
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default EventDetails;