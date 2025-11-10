import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Ticket,
  Download,
  Share2,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

// Fetch bookings for the current logged-in user
const fetchBookings = async () => {
  const res = await fetch("/api/bookings"); 
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json(); // [{id, event, tickets, status, qrCode, date, ...}]
};

const cancelBooking = async (bookingId) => {
  const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to cancel booking");
  return res.json();
};

const downloadQRCode = (qrCodeData, bookingId) => {
  // If you get QR code as an image URL, download that. If data, render PNG as below.
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 300;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, 300, 300);

 
  ctx.fillStyle = "#000";
  for (let i = 0; i < 15; i++) for (let j = 0; j < 15; j++)
    if (Math.random() > 0.5) ctx.fillRect(i * 20, j * 20, 16, 16);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${bookingId}-qr.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBookings()
      .then(setBookings)
      .catch(() => setError("Could not load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelBooking = async (bid) => {
    setCancelLoading(bid);
    try {
      await cancelBooking(bid);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bid ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (e) {
      alert("Error cancelling booking.");
    }
    setCancelLoading(false);
  };

  if (loading) return <div className="py-24 text-center text-lg text-gray-500">Loading your bookings…</div>;
  if (error) return <div className="py-24 text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-7 text-center text-purple-700">
          Your Bookings
        </h1>
        {bookings.length === 0 ? (
          <div className="text-center mt-16">
            <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl mb-3 font-semibold">No bookings found</h2>
            <p className="text-gray-500 mb-4">
              When you book tickets for events, they'll show up here!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden relative"
              >
                {/* Top status bar */}
                <div className="absolute top-4 right-4 z-10 text-right">
                  {booking.status === "confirmed" ? (
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs shadow">
                      Confirmed
                    </span>
                  ) : booking.status === "pending" ? (
                    <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold text-xs shadow">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs shadow">
                      Cancelled
                    </span>
                  )}
                </div>
                {/* Event info */}
                <div className="md:flex">
                  <div className="md:w-40 md:flex-shrink-0 h-40 overflow-hidden">
                    <img
                      src={booking.event.image || booking.event.images?.[0] || ""}
                      alt={booking.event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:flex-1 p-6">
                    <div className="mb-3 flex gap-2 items-center">
                      <h2 className="text-xl font-bold text-gray-800">{booking.event.title}</h2>
                      {booking.status === "confirmed" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {booking.status === "cancelled" && <X className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">
                          {booking.event.date?.slice(0, 10)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          {booking.event.time}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">{booking.event.location}</span>
                      </div>
                    </div>
                    {/* Tickets */}
                    <div className="mb-5">
                      <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-purple-600" /> Tickets
                      </h3>
                      <div className="space-y-2">
                        {booking.tickets.map((t, i) => (
                          <div key={i} className="flex justify-between text-sm text-gray-700">
                            <span>{t.name} × {t.quantity}</span>
                            <span className="font-bold">${t.price * t.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Paid:</span>
                      <span className="text-2xl font-bold text-purple-700">${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
                {/* Actions: QR, Share, Cancel */}
                <div className="px-6 pb-5 flex flex-wrap gap-2 justify-end">
                  {(booking.status === "confirmed" && booking.qrCode) && (
                    <>
                      <button
                        onClick={() => downloadQRCode(booking.qrCode, booking.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-md transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download QR
                      </button>
                      <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        <Share2 className="w-5 h-5" /> Share
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelLoading === booking.id}
                      className={`flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-all ${
                        cancelLoading === booking.id ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <X className="w-5 h-5" />
                      {cancelLoading === booking.id ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;