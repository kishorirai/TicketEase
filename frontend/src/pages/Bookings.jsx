import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { createBooking } from "./api";
import { isAuthenticated, getAuthUser } from "../utils/auth";

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get event and selected tickets from location state (passed from EventDetails)
  const { event, selectedTickets } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    console.log("[Bookings] Checking authentication and data");
    console.log("Is Authenticated:", isAuthenticated());
    console.log("Event:", event);
    console.log("Selected Tickets:", selectedTickets);

    if (!isAuthenticated()) {
      console.log("[Bookings] User not authenticated, redirecting to /auth");
      navigate("/auth", {
        state: {
          redirectTo: "/bookings",
          payload: { event, selectedTickets },
        },
      });
      return;
    }

    if (!event || !selectedTickets || Object.keys(selectedTickets).length === 0) {
      console.log("[Bookings] Missing event or tickets data, redirecting to /events");
      navigate("/events");
    }
  }, [event, selectedTickets, navigate]);

  // Load user data from auth
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      console.log("[Bookings] Loading user data:", user);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  // Don't render if no event or tickets
  if (!event || ! selectedTickets) {
    return null;
  }

  // Calculate booking details
  const getBookingItems = () => {
    return Object.entries(selectedTickets).map(([ticketId, quantity]) => {
      const ticket = event.ticket_types?. find(
        (t) => String(t._id || t.id) === String(ticketId)
      );
      return {
        ticketTypeId: ticketId,
        name: ticket?.name || "Unknown",
        price: ticket?.price || 0,
        quantity: quantity,
        subtotal: (ticket?.price || 0) * quantity,
      };
    });
  };

  const bookingItems = getBookingItems();
  const totalAmount = bookingItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTickets = bookingItems.reduce((sum, item) => sum + item.quantity, 0);

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "TBA", time: "TBA" };
    try {
      const eventDate = new Date(dateString);
      return {
        date: eventDate. toLocaleDateString("en-US", {
          year: "numeric",
          month:  "long",
          day: "numeric",
        }),
        time: eventDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (err) {
      return { date: "Invalid Date", time: "" };
    }
  };

  const { date:  eventDate, time: eventTime } = formatDateTime(event.date);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e. target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) setError(null);
  };

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let value = e.target.value. replace(/\s/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setFormData((prev) => ({
      ...prev,
      cardNumber: value,
    }));
    if (error) setError(null);
  };

  // Format expiry date
  const handleExpiryChange = (e) => {
    let value = e.target.value. replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setFormData((prev) => ({
      ...prev,
      expiryDate: value,
    }));
    if (error) setError(null);
  };

  // Validate form
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.cardNumber.replace(/\s/g, "").length === 16 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length === 3
    );
  };

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("[Bookings] ========== BOOKING PROCESS STARTED ==========");
      console.log("[Bookings] Event ID:", event._id);
      console.log("[Bookings] Selected Tickets:", selectedTickets);

      // Prepare booking data for backend
      const bookingData = {
        eventId: event._id,
        items: Object.entries(selectedTickets).map(([ticketId, quantity]) => ({
          ticketTypeId: ticketId,
          quantity: quantity,
        })),
      };

      console.log("[Bookings] Booking Request Data:", JSON.stringify(bookingData, null, 2));

      // Call booking API
      const response = await createBooking(bookingData);

      console.log("[Bookings] ========== BOOKING API RESPONSE ==========");
      console.log("[Bookings] Full Response:", response);
      console.log("[Bookings] Response Type:", typeof response);
      console.log("[Bookings] Has booking property:", !!response.booking);
      console.log("[Bookings] Booking Data:", response.booking);

      // Validate response
      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.booking) {
        console.error("[Bookings] Invalid response structure:", response);
        throw new Error("Booking data missing from server response");
      }

      console.log("[Bookings] ✅ Booking created successfully!");
      console.log("[Bookings] Booking ID:", response. booking._id);

      setSuccess(true);

      // Store booking data in sessionStorage as backup
      const bookingSuccessData = {
        booking:  response.booking,
        event: event,
      };

      sessionStorage.setItem('lastBooking', JSON.stringify(bookingSuccessData));
      console.log("[Bookings] Stored booking in sessionStorage");

      // Navigate to success page
      console.log("[Bookings] Navigating to /bookings/success");
      
      // Small delay to show success message
      setTimeout(() => {
        navigate("/bookings/success", {
          state: bookingSuccessData,
          replace: true,
        });
      }, 1000);

    } catch (err) {
      console.error("[Bookings] ========== BOOKING ERROR ==========");
      console.error("[Bookings] Error:", err);
      console.error("[Bookings] Error Message:", err.message);
      console.error("[Bookings] Error Status:", err.status);
      console.error("[Bookings] Error Body:", err.body);
      
      // User-friendly error messages
      let errorMessage = "Failed to create booking. Please try again.";
      
      if (err.message.includes("Not enough tickets")) {
        errorMessage = err.message;
      } else if (err.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => navigate("/auth"), 2000);
      } else if (err.status === 404) {
        errorMessage = "Event not found. Please try another event.";
      } else if (err.message) {
        errorMessage = err. message;
      }
      
      setError(errorMessage);
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Complete Your{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Booking
          </span>
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <p className="text-green-700 font-semibold">
              Booking successful!  Redirecting to confirmation...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left:  Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                      required
                      disabled={loading || success}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@example. com"
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus: ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                      placeholder="1234 5678 9012 3456"
                      required
                      disabled={loading || success}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        maxLength="5"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus: ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                        placeholder="MM/YY"
                        required
                        disabled={loading || success}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                        placeholder="123"
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Your payment information is secure and encrypted. We never store
                      your card details.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Event Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Event Details</h3>
                  {event.images && event.images[0] && (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200? text=Event";
                      }}
                    />
                  )}
                  <h4 className="font-bold text-lg mb-3">{event.title}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{eventTime}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {bookingItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">${item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/30 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Subtotal</span>
                      <span className="font-semibold">${totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm">Service Fee</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-3xl font-bold">${totalAmount}</span>
                    </div>
                    <p className="text-xs text-white/80 mt-2">
                      {totalTickets} {totalTickets === 1 ?  "ticket" : "tickets"}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={! isFormValid() || loading || success}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                      ! isFormValid() || loading || success
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-purple-600 hover: bg-gray-100 hover:scale-105 shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </span>
                    ) : success ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Booking Confirmed!
                      </span>
                    ) : (
                      `Pay $${totalAmount}`
                    )}
                  </button>
                  <p className="text-xs text-center text-white/80 mt-3">
                    🔒 Secure payment · Instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        . animate-shake {
          animation:  shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Bookings;