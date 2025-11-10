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
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Ticket,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const fetchEventDetails = async (eventId) => {
  const res = await fetch(`/api/events/${eventId}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
};
const createBooking = async (bookingPayload) => {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingPayload),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
};

const formatDate = (date) => (date ? date.slice(0, 10) : "");
const calcTotal = (selectedTickets) =>
  selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0);
const getSelectedTickets = (event, ticketsSelected) => {
  if (!event || !event.ticket_types || !ticketsSelected) return [];
  return event.ticket_types
    .filter(ticket => ticketsSelected[ticket.id])
    .map(ticket => ({
      ...ticket,
      quantity: ticketsSelected[ticket.id]
    }));
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTickets, setSelectedTickets] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // booking form/flow
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingFormData, setBookingFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingProcessing, setBookingProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEventDetails(id)
      .then((data) => setEvent(data))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  }, [id]);

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

  // BOOKING FORM HANDLERS
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'cardNumber') {
      val = val.replace(/\D/g, '').substring(0, 16);
      val = val.replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      val = val.replace(/\D/g, '').substring(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    }
    if (name === 'cvv') {
      val = val.replace(/\D/g, '').substring(0, 3);
    }
    if (name === 'phone') {
      val = val.replace(/\D/g, '').substring(0, 10);
    }
    setBookingFormData(prev => ({ ...prev, [name]: val }));
    if (bookingErrors[name]) setBookingErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateBookingStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!bookingFormData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!bookingFormData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!bookingFormData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(bookingFormData.email)) newErrors.email = 'Email is invalid';
      if (!bookingFormData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (bookingFormData.phone.length < 10) newErrors.phone = 'Phone number must be 10 digits';
    }
    if (step === 2) {
      if (!bookingFormData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
      else if (bookingFormData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!bookingFormData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      else if (bookingFormData.expiryDate.length < 5) newErrors.expiryDate = 'Invalid expiry date';
      if (!bookingFormData.cvv) newErrors.cvv = 'CVV is required';
      else if (bookingFormData.cvv.length < 3) newErrors.cvv = 'CVV must be 3 digits';
      if (!bookingFormData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }
    setBookingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingNext = () => {
    if (validateBookingStep(bookingStep)) {
      if (bookingStep === 2) handleBookingSubmit();
      else setBookingStep(s => s + 1);
    }
  };
  const handleBookingBack = () => setBookingStep(s => s - 1);

  const handleBookingSubmit = async () => {
    setBookingProcessing(true);
    try {
      const selectedTicketsArr = getSelectedTickets(event, selectedTickets);
      const bookingPayload = {
        event_id: event.id,
        user_name: `${bookingFormData.firstName} ${bookingFormData.lastName}`,
        quantity: getTotalTickets(),
        tickets: selectedTicketsArr.map(({ id, quantity, price }) => ({ id, quantity, price })),
        contact: {
          firstName: bookingFormData.firstName,
          lastName: bookingFormData.lastName,
          email: bookingFormData.email,
          phone: bookingFormData.phone
        },
        payment: {
          cardNumber: bookingFormData.cardNumber.replace(/\s/g, ''),
          expiryDate: bookingFormData.expiryDate,
          cvv: bookingFormData.cvv,
          cardName: bookingFormData.cardName
        }
      };
      await createBooking(bookingPayload);
      setBookingProcessing(false);
      setShowBookingForm(false);
      navigate("/bookings");
    } catch (e) {
      setBookingErrors({ global: 'Booking failed. Please try again!' });
      setBookingProcessing(false);
    }
  };

  const formattedDate = event?.date ? event.date.slice(0, 10) : "";

  if (loading) return (
    <div className="text-center py-32 text-2xl text-gray-500">
      Loading event details…
    </div>
  );
  if (error || !event) return (
    <div className="text-center py-32 text-2xl text-red-500">
      Event not found.
    </div>
  );

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
                  idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
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
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={<Calendar className="w-6 h-6 text-blue-500 mb-2" />} label="Date" value={formattedDate} />
              <InfoCard icon={<Clock className="w-6 h-6 text-green-500 mb-2" />} label="Time" value={event.time || ""} />
              <InfoCard icon={<Users className="w-6 h-6 text-purple-500 mb-2" />} label="Attendees" value={event.attendees || ""} />
              <InfoCard icon={<Star className="w-6 h-6 text-yellow-500 mb-2" />} label="Rating" value={`${event.rating} (${event.reviews})`} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line">
                {event.description}
              </div>
              {event.highlights?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Event Highlights</h3>
                  <HighlightsList highlights={event.highlights} />
                </div>
              )}
            </div>
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
                  onProceed={() => {
                    setShowBookingForm(true);
                    setBookingStep(1);
                    setBookingErrors({});
                  }}
                />
              )}
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
      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-50 animate-fadeIn">
          <div
            className="
              bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col
              relative overflow-hidden
              max-h-[96vh] h-fit
            "
            style={{ minHeight: "420px" }}
          >
            <div
              className="flex justify-between items-center px-6 pt-5 pb-3 border-b"
              style={{ minHeight: "68px" }}>
              <h3 className="text-xl font-bold">Complete Booking</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {bookingErrors.global && (
              <div className="mb-1 mx-6 text-red-500 font-bold bg-red-50 py-2 px-4 rounded">
                {bookingErrors.global}
              </div>
            )}
            <div
              className="flex-1 overflow-y-auto px-6 pt-2 pb-32 space-y-4"
              style={{ minHeight: "260px" }}
            >
              {bookingStep === 1 && (
                <PersonalDetailsStep
                  formData={bookingFormData}
                  errors={bookingErrors}
                  onInputChange={handleBookingInputChange}
                />
              )}
              {bookingStep === 2 && (
                <PaymentStep
                  formData={bookingFormData}
                  errors={bookingErrors}
                  onInputChange={handleBookingInputChange}
                />
              )}
              <OrderSummary selectedTickets={getSelectedTickets(event, selectedTickets)} />
            </div>
            <div className="absolute left-0 right-0 bottom-0 px-6 pb-4 pt-2 bg-white border-t flex gap-3">
              {bookingStep > 1 && (
                <button
                  onClick={handleBookingBack}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={handleBookingNext}
                disabled={bookingProcessing}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  bookingProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl'
                }`}
              >
                {bookingProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : bookingStep === 2 ? (
                  <>
                    Pay ${calcTotal(getSelectedTickets(event, selectedTickets))}
                    <Lock className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI helpers
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
      {icon}
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function HighlightsList({ highlights }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  return (
    <div className="space-y-4">
      {ticketCategories.length === 0 && (
        <div className="text-gray-500">
          Ticket categories not available.
        </div>
      )}
      {ticketCategories.map((ticket) => {
        const count = selectedTickets[ticket.id] || 0;
        const available = ticket.available ?? ticket.remaining ?? 0;
        const total = ticket.total ?? ticket.total_seats ?? 1;
        const availabilityPercent = total > 0 ? (available / total) * 100 : 0;
        return (
          <div
            key={ticket.id}
            className="relative border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{ticket.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {ticket.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">${ticket.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold text-gray-800">${ticket.price}</span>
                </div>
              </div>
            </div>
            {ticket.features?.length > 0 && (
              <div className="space-y-1 mb-3">
                {ticket.features.map((feature, idx) => (
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
                  onClick={() => handleTicketChange(ticket.id, -1)}
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
                  onClick={() => handleTicketChange(ticket.id, 1)}
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
          const ticket = ticketCategories.find((t) => String(t.id) === String(ticketId));
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
          {getTotalTickets()} {getTotalTickets() === 1 ? "ticket" : "tickets"} selected
        </p>
      </div>
      <button
        onClick={onProceed}
        className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
      >
        Proceed to Checkout
      </button>
      <p className="text-xs text-center text-white/80 mt-3">
        🔒 Secure payment · Instant confirmation
      </p>
    </div>
  );
}

function PersonalDetailsStep({ formData, errors, onInputChange }) {
  return (
    <div className="space-y-2 animate-slideIn">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">Personal Info</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field
          name="firstName"
          label="First Name *"
          placeholder="John"
          value={formData.firstName}
          onChange={onInputChange}
          error={errors.firstName}
        />
        <Field
          name="lastName"
          label="Last Name *"
          placeholder="Doe"
          value={formData.lastName}
          onChange={onInputChange}
          error={errors.lastName}
        />
      </div>
      <Field
        type="email"
        name="email"
        label={<> <Mail className="w-4 h-4 inline mr-1" /> Email * </>}
        placeholder="john.doe@example.com"
        value={formData.email}
        onChange={onInputChange}
        error={errors.email}
      />
      <Field
        type="tel"
        name="phone"
        label={<> <Phone className="w-4 h-4 inline mr-1" /> Phone * </>}
        placeholder="1234567890"
        value={formData.phone}
        onChange={onInputChange}
        error={errors.phone}
        helper="SMS will be sent"
      />
    </div>
  );
}

function PaymentStep({ formData, errors, onInputChange }) {
  return (
    <div className="space-y-2 animate-slideIn">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">Payment Details</h3>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-2 flex items-center gap-2">
        <Lock className="w-5 h-5 text-green-600" />
        <div>
          <span className="font-semibold text-green-800">Secure Payment</span>
        </div>
      </div>
      <Field
        name="cardNumber"
        label="Card Number *"
        placeholder="1234 5678 9012 3456"
        value={formData.cardNumber}
        onChange={onInputChange}
        error={errors.cardNumber}
        inputMode="numeric"
        className="font-mono"
      />
      <div className="grid grid-cols-2 gap-2">
        <Field
          name="expiryDate"
          label="Expiry *"
          placeholder="MM/YY"
          value={formData.expiryDate}
          onChange={onInputChange}
          error={errors.expiryDate}
          inputMode="numeric"
          className="font-mono"
        />
        <Field
          name="cvv"
          label="CVV *"
          placeholder="123"
          value={formData.cvv}
          onChange={onInputChange}
          error={errors.cvv}
          inputMode="numeric"
          className="font-mono"
        />
      </div>
      <Field
        name="cardName"
        label="Cardholder Name *"
        placeholder="JOHN DOE"
        value={formData.cardName}
        onChange={onInputChange}
        error={errors.cardName}
      />
    </div>
  );
}

function Field({ name, label, value, onChange, error, type = "text", placeholder = "", helper = "", className = "", ...rest }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        {...rest}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none transition-all ${className}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500'}`}
        placeholder={placeholder}
      />
      {error && (<p className="text-red-500 text-xs mt-1">{error}</p>)}
      {helper && (<p className="text-xs text-gray-500 mt-1">{helper}</p>)}
    </div>
  );
}

function OrderSummary({ selectedTickets = [] }) {
  return (
    <div className="mt-2 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3">
      <h4 className="font-bold text-base mb-2">Order Summary</h4>
      <div className="space-y-1">
        {selectedTickets.map((ticket, idx) => (
          <div key={idx} className="flex justify-between text-gray-700">
            <span>{ticket.name} × {ticket.quantity}</span>
            <span className="font-semibold">${ticket.price * ticket.quantity}</span>
          </div>
        ))}
        <div className="border-t-2 border-purple-200 pt-2 mt-2 flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="text-xl font-bold text-purple-600">${calcTotal(selectedTickets)}</span>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;