import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate!
import { Calendar, Clock, MapPin, Users, Star, Share2, Heart, ChevronLeft, ChevronRight, Plus, Minus, Check, X } from 'lucide-react';
import BookingFlow from './Bookings';

const EventDetailsPage = () => {
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 2. Initialize navigate
  const navigate = useNavigate();

  // Sample event data
  const event = {
    id: 1,
    title: 'Summer Music Festival 2025',
    subtitle: 'The Ultimate Open-Air Concert Experience',
    date: '2025-06-15',
    time: '18:00 - 23:00',
    location: 'Central Park, New York',
    address: '59th to 110th St, New York, NY 10022',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    category: 'Music Festival',
    rating: 4.8,
    reviews: 2847,
    organizer: 'Live Nation Entertainment',
    description: `Get ready for the most anticipated music event of the summer! The Summer Music Festival 2025 brings together world-renowned artists, emerging talents, and music lovers from around the globe for an unforgettable experience.

This year's lineup features an incredible mix of genres including rock, pop, electronic, and indie music. With multiple stages running simultaneously, you'll have the chance to discover new favorites while enjoying performances from your beloved artists.

The festival grounds offer much more than just music - explore our artisan food village featuring cuisine from around the world, browse unique merchandise from local vendors, and relax in our dedicated chill-out zones with stunning views of Central Park.`,
    highlights: [
      '15+ International Artists',
      '3 Stages with Non-Stop Music',
      'Food & Beverage Village',
      'VIP Lounge Access Available',
      'Professional Photography Zone',
      'Eco-Friendly Festival Grounds'
    ],
    images: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop'
    ]
  };

  const ticketCategories = [
    {
      id: 'general',
      name: 'General Admission',
      price: 89,
      originalPrice: 120,
      description: 'Access to all festival areas and main stages',
      features: ['Standing area access', 'All day festival pass', 'Access to food courts'],
      available: 450,
      total: 1000,
      color: 'blue'
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 199,
      originalPrice: 250,
      description: 'Premium access with exclusive benefits',
      features: ['VIP lounge access', 'Priority entry', 'Complimentary drinks', 'Premium viewing areas'],
      available: 85,
      total: 200,
      color: 'purple',
      badge: 'Popular'
    },
    {
      id: 'platinum',
      name: 'Platinum Package',
      price: 399,
      originalPrice: 500,
      description: 'Ultimate festival experience with all perks',
      features: ['All VIP benefits', 'Meet & greet opportunities', 'Backstage access', 'Private bar', 'Exclusive merchandise'],
      available: 12,
      total: 50,
      color: 'amber',
      badge: 'Limited'
    }
  ];

  const handleTicketChange = (ticketId, change) => {
    setSelectedTickets(prev => {
      const currentCount = prev[ticketId] || 0;
      const newCount = Math.max(0, Math.min(10, currentCount + change));
      
      if (newCount === 0) {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [ticketId]: newCount };
    });
  };

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, count]) => {
      const ticket = ticketCategories.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * count : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
        <div className="relative h-full">
          {event.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${event.title} - ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
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
            {event.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
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
                isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Calendar className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">June 15, 2025</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Clock className="w-6 h-6 text-green-500 mb-2" />
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{event.time}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Users className="w-6 h-6 text-purple-500 mb-2" />
                <p className="text-sm text-gray-600">Attendees</p>
                <p className="font-semibold">2,500+</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">{event.rating} ({event.reviews})</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line">
                {event.description}
              </div>
              
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
            </div>

            {/* Google Maps Integration */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Event Location</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">{event.location}</p>
                  <p className="text-gray-600">{event.address}</p>
                </div>
              </div>
              
              {/* Google Maps Embed */}
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-inner">
                <iframe
                  title="Event Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(event.address)}&zoom=15`}
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
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Ticket Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
                
                <div className="space-y-4">
                  {ticketCategories.map((ticket, index) => {
                    const count = selectedTickets[ticket.id] || 0;
                    const availabilityPercent = (ticket.available / ticket.total) * 100;
                    
                    return (
                      <div
                        key={ticket.id}
                        className="relative border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all duration-300 animate-slideIn"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {ticket.badge && (
                          <div className={`absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r ${
                            ticket.badge === 'Popular' ? 'from-purple-500 to-pink-500' : 'from-amber-500 to-orange-500'
                          } text-white text-xs font-bold rounded-full`}>
                            {ticket.badge}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{ticket.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
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
                            {ticket.originalPrice && (
                              <span className="text-xs text-green-600 font-semibold">
                                Save ${ticket.originalPrice - ticket.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-1 mb-3">
                          {ticket.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {ticket.features.length > 2 && (
                            <p className="text-xs text-purple-600 font-semibold ml-6">
                              +{ticket.features.length - 2} more benefits
                            </p>
                          )}
                        </div>

                        {/* Availability Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{ticket.available} available</span>
                            <span>{Math.round(availabilityPercent)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${
                                availabilityPercent > 50
                                  ? 'from-green-400 to-green-600'
                                  : availabilityPercent > 20
                                  ? 'from-yellow-400 to-yellow-600'
                                  : 'from-red-400 to-red-600'
                              } transition-all duration-500`}
                              style={{ width: `${availabilityPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTicketChange(ticket.id, -1)}
                              disabled={count === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                count === 0
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{count}</span>
                            <button
                              onClick={() => handleTicketChange(ticket.id, 1)}
                              disabled={count >= 10 || ticket.available === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                count >= 10 || ticket.available === 0
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-purple-600 text-white hover:bg-purple-700'
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
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white animate-slideUp">
                  <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    {Object.entries(selectedTickets).map(([ticketId, count]) => {
                      const ticket = ticketCategories.find(t => t.id === ticketId);
                      return (
                        <div key={ticketId} className="flex justify-between text-sm">
                          <span>{ticket.name} × {count}</span>
                          <span className="font-semibold">${ticket.price * count}</span>
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
                      {getTotalTickets()} {getTotalTickets() === 1 ? 'ticket' : 'tickets'} selected
                    </p>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Book Now Button */}
                  <button
                    onClick={() => navigate('/bookings')}
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
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-slideUp">
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
                  <span className="text-2xl font-bold text-purple-600">${getTotalAmount()}</span>
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventDetailsPage;