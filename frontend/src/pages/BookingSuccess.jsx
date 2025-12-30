import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Smartphone, Calendar, MapPin, Clock, ArrowLeft, Home } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  
  // Get booking and event data from location state (passed from Bookings page)
  const { booking, event } = location.state || {};

  // Redirect if no booking data
  useEffect(() => {
    if (!booking || !event) {
      console.log("[BookingSuccess] No booking/event data, redirecting to events");
      navigate("/events");
    }
  }, [booking, event, navigate]);

  // If no data, don't render anything (will redirect)
  if (!booking || ! event) {
    return null;
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "TBA", time: "TBA" };
    try {
      const eventDate = new Date(dateString);
      return {
        date: eventDate. toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: eventDate.toLocaleTimeString('en-US', { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      };
    } catch (err) {
      return { date: "Invalid Date", time: "" };
    }
  };

  const { date:  eventDate, time: eventTime } = formatDateTime(event.date);

  // Calculate total tickets
  const totalTickets = booking.items?. reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Get user email
  const userEmail = localStorage.getItem("authUser") 
    ? JSON.parse(localStorage.getItem("authUser")).email 
    : "your email";

  // Handle download ticket
  const handleDownload = () => {
    // Create a simple text-based ticket
    const ticketContent = `
╔════════════════════════════════════════╗
║           TICKETEASE                   ║
║        EVENT TICKET                    ║
╚════════════════════════════════════════╝

Booking ID: ${booking._id}
Status: ${booking.status || 'Confirmed'}

EVENT DETAILS
─────────────────────────────────────────
${event.title}
${event.subtitle || ''}

Date: ${eventDate}
Time:  ${eventTime}
Venue: ${event.location || 'TBA'}
${event.address || ''}

TICKET DETAILS
─────────────────────────────────────────
${booking.items?.map(item => 
  `${item.name} × ${item.quantity} - $${item.price * item.quantity}`
).join('\n')}

Total Amount: $${booking.totalAmount}
Total Tickets: ${totalTickets}

─────────────────────────────────────────
Please present this ticket at the venue
Booking Date: ${new Date(booking.createdAt).toLocaleString()}

Thank you for booking with TicketEase!
Support:  support@ticketease.com
    `;

    // Create and download file
    const blob = new Blob([ticketContent], { type:  'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document. createElement('a');
    a.href = url;
    a. download = `TicketEase-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle email ticket
  const handleEmailTicket = () => {
    const subject = encodeURIComponent(`Your Ticket for ${event.title}`);
    const body = encodeURIComponent(`
Hi,

Your booking has been confirmed! 

Booking ID: ${booking._id}
Event: ${event.title}
Date: ${eventDate}
Time: ${eventTime}
Total Amount: $${booking.totalAmount}

Thank you for choosing TicketEase!
    `);
    
    window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tickets have been successfully booked</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Event Details */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold flex-1">{event.title}</h2>
              {event.category && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  {event.category}
                </span>
              )}
            </div>
            {event.subtitle && (
              <p className="text-purple-100 mb-4">{event.subtitle}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{eventTime}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}{event.address ? `, ${event.address}` : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-mono font-semibold text-gray-900 text-sm">{booking._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {booking.status || 'Confirmed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tickets</span>
                <span className="font-semibold text-gray-900">{totalTickets}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">Ticket Breakdown: </p>
                {booking.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-gray-700 font-semibold">Total Amount</span>
                <span className="font-bold text-green-600 text-xl">${booking.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Your Entry Code</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center">
              {!showQR ? (
                <>
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <button 
                      onClick={() => setShowQR(true)}
                      className="text-purple-600 font-medium hover:text-purple-700 transition"
                    >
                      Click to Show QR Code
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Show this QR code at the venue entrance
                  </p>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 200 200" className="w-48 h-48 border-4 border-purple-200 rounded-lg">
                    <rect width="200" height="200" fill="white"/>
                    {[...Array(20)].map((_, i) => 
                      [...Array(20)].map((_, j) => {
                        // Create a more realistic QR pattern based on booking ID
                        const hash = (i * 20 + j + booking._id. length) % 5;
                        return hash === 0 || hash === 1 ? (
                          <rect 
                            key={`${i}-${j}`}
                            x={i * 10} 
                            y={j * 10} 
                            width="10" 
                            height="10" 
                            fill="black"
                          />
                        ) : null;
                      })
                    )}
                  </svg>
                  <p className="text-xs text-gray-500 text-center mt-3 font-mono">
                    ID: {booking._id. substring(0, 12)}...
                  </p>
                  <button
                    onClick={() => setShowQR(false)}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                  >
                    Hide QR Code
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-xl font-semibold hover: bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover: scale-105"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button 
            onClick={handleEmailTicket}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Email Ticket
          </button>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Confirmation email sent!</span>
              <br />
              Your tickets have been sent to <span className="font-medium text-blue-700">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => navigate("/events")}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            <Home className="w-5 h-5" />
            Browse Events
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-200 transition"
          >
            View My Bookings →
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at <a href="mailto:support@ticketease.com" className="text-purple-600 hover:text-purple-700 font-medium">support@ticketease.com</a>
          </p>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        . animate-bounce {
          animation:  bounce 1s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}