import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Lock, Calendar, MapPin, Ticket, Download, Share2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

// You may want to import your navigation/hooks if needed
// import { useNavigate, useParams } from 'react-router-dom';

// Helper: Format date as YYYY-MM-DD
const formatDate = (date) => date ? date.slice(0, 10) : "";

// Example fetch functions; adjust paths as needed for your API
const fetchEventDetails = async (eventId) => {
  const res = await fetch(`/api/events/${eventId}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
};
const fetchCurrentBooking = async () => {
  // Implement fetching the user's "current" booking/state if needed
  // For now, just a placeholder:
  return null;
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

const BookingFlow = ({ eventId, ticketsSelected }) => {
  // eventId: pass via props or from router param
  // ticketsSelected: {ticketId: quantity, ...} from previous ticket select page
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [event, setEvent] = useState(null);
  const [showDataError, setShowDataError] = useState('');
  // const [booking, setBooking] = useState(null); // If editing/viewing previous booking

  // Load event details from backend
  useEffect(() => {
    fetchEventDetails(eventId)
      .then(data => setEvent(data))
      .catch(() => setShowDataError("Could not load event details."));
  }, [eventId]);

  // Generate confetti
  useEffect(() => {
    if (showSuccess) {
      const pieces = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
      }));
      setConfettiPieces(pieces);
    }
  }, [showSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    }
    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }
    // Format phone
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (step === 2) {
      if (!formData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (formData.expiryDate.length < 5) {
        newErrors.expiryDate = 'Invalid expiry date';
      }
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSelectedTickets = () => {
    // Event's ticket_types: [{id, name, price, ...}]
    if (!event || !event.ticket_types || !ticketsSelected) return [];
    return event.ticket_types
      .filter(ticket => ticketsSelected[ticket.id])
      .map(ticket => ({
        ...ticket,
        quantity: ticketsSelected[ticket.id]
      }));
  };

  const calcTotal = () => {
    return getSelectedTickets().reduce((sum, t) => sum + t.price * t.quantity, 0);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Payload for booking API
      const bookingPayload = {
        eventId,
        tickets: getSelectedTickets().map(({id, quantity}) => ({ id, quantity })),
        contact: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        payment: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName
        }
      };
      const resp = await createBooking(bookingPayload);
      setBookingId(resp.bookingId || ('BK' + Math.random().toString(36).substr(2, 9).toUpperCase()));
      setShowSuccess(true);
      setIsProcessing(false);
    } catch (e) {
      setErrors({ global: 'Booking failed. Please try again!' });
      setIsProcessing(false);
    }
  };

  const downloadQRCode = () => {
    // Generate QR code png for download (simulated)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = '#000';
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.5) ctx.fillRect(i * 20, j * 20, 18, 18);
      }
    }

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${bookingId}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // --------- Render ---------
  if (showDataError) {
    return <div className="text-center py-32 text-2xl text-red-500">{showDataError}</div>
  }

  if (!event) {
    return <div className="text-center py-32 text-2xl text-gray-500">Loading event details…</div>
  }

  if (showSuccess) {
    // Shows the booking confirmation
    const selectedTickets = getSelectedTickets();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti */}
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 animate-confetti"
            style={{
              left: `${piece.left}%`,
              top: '-10px',
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
        <div className="max-w-2xl w-full animate-scaleIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              <div className="relative bg-green-500 rounded-full p-6">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Your tickets have been successfully booked
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Booking ID: <span className="font-mono font-bold text-purple-600">{bookingId}</span>
            </p>
          </div>
          {/* Event Summary Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="relative h-40 overflow-hidden">
              <img
                src={event?.images?.[0]}
                alt={event?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl font-bold">{event?.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-800">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{event.location}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-600" />
                  Your Tickets
                </h3>
                <div className="space-y-3">
                  {selectedTickets.map((ticket, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{ticket.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {ticket.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800">${ticket.price * ticket.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
                  <span className="text-xl font-bold text-gray-800">Total Amount Paid</span>
                  <span className="text-3xl font-bold text-green-600">${calcTotal()}</span>
                </div>
              </div>
            </div>
          </div>
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Your Entry Pass</h3>
            <p className="text-gray-600 mb-6">Present this QR code at the venue entrance</p>
            {/* QR Code Placeholder */}
            <div className="inline-block bg-white p-6 rounded-2xl shadow-inner mb-6">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
          {/* Confirmation Email Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-semibold">
              📧 A confirmation email has been sent to <span className="font-bold">{formData.email}</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Please check your inbox for ticket details and event information
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(-10px) rotateZ(0deg); opacity: 1;}
            100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0;}
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-confetti { animation: confetti linear forwards;}
          .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        `}</style>
      </div>
    );
  }

  const selectedTickets = getSelectedTickets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-110'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`font-semibold ${currentStep >= step ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step === 1 ? 'Personal Details' : 'Payment'}
                    </p>
                  </div>
                </div>
                {step < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
            <p className="text-purple-100">Just a few more details to secure your tickets</p>
          </div>
          {errors.global && (<div className="p-4 text-red-500 font-bold bg-red-50">{errors.global}</div>)}
          <div className="p-8">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slideIn">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.firstName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-purple-500'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.lastName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-purple-500'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                    placeholder="1234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Tickets will be sent via SMS</p>
                </div>
              </div>
            )}
            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slideIn">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Payment Details</h3>
                </div>
                {/* Security Badge */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Secure Payment</p>
                    <p className="text-sm text-green-600">Your payment information is encrypted and secure</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all font-mono ${
                      errors.cardNumber
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all font-mono ${
                        errors.expiryDate
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-purple-500'
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all font-mono ${
                        errors.cvv
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-purple-500'
                      }`}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.cardName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                    placeholder="JOHN DOE"
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>
              </div>
            )}
            {/* Order Summary */}
            <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4">Order Summary</h4>
              <div className="space-y-2">
                {selectedTickets.map((ticket, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>
                      {ticket.name} × {ticket.quantity}
                    </span>
                    <span className="font-semibold">${ticket.price * ticket.quantity}</span>
                  </div>
                ))}
                <div className="border-t-2 border-purple-200 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-purple-600">${calcTotal()}</span>
                </div>
              </div>
            </div>
            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 2 ? (
                  <>
                    Pay ${calcTotal()}
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
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px);}
          to { opacity: 1; transform: translateX(0);}
        }
        .animate-slideIn { animation: slideIn 0.4s ease-out;}
      `}</style>
    </div>
  );
};

export default BookingFlow;