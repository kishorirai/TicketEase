import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, Bell, Shield, LogOut, ChevronRight, Ticket, MapPin, Clock, Download, Star, Heart, Mail, Phone, Edit2, Save, X, Loader2, AlertCircle, Trash2, UserX, Building2, Globe } from 'lucide-react';
import { getAuthUser, clearAuth, isAuthenticated } from '../utils/auth';
import { fetchUserBookings, fetchEvents } from './api';

// Compatibility aliases
const getCurrentUser = getAuthUser;
const logout = clearAuth;

export default function TicketEaseProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    eventReminders: true,
    promotions: true
  });
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email:  '',
    phone: '',
    location: '',
    company: '',
    website: '',
    dateOfBirth: '',
    gender: ''
  });

  const [tempUserInfo, setTempUserInfo] = useState(userInfo);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'VISA',
      lastFour: '4532',
      holder: 'ALEX MORGAN',
      expiry: '12/25',
      isDefault: true
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Load user data and bookings
  useEffect(() => {
    const loadUserData = async () => {
      if (! isAuthenticated()) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const user = getCurrentUser();
        if (user) {
          setUserInfo({
            name: user.name || '',
            email: user.email || '',
            phone: user. phone || '',
            location: user.location || '',
            company: user.company || '',
            website: user.website || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || ''
          });
          setTempUserInfo({
            name: user.name || '',
            email: user.email || '',
            phone: user. phone || '',
            location: user.location || '',
            company: user.company || '',
            website: user.website || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || ''
          });

          // Update payment method holder name
          setPaymentMethods(prev => prev.map(card => ({
            ...card,
            holder: user.name?. toUpperCase() || 'CARD HOLDER'
          })));
        }

        // Fetch user bookings
        const bookingsData = await fetchUserBookings();
        const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData. bookings || []);

        // Separate upcoming and past events
        const now = new Date();
        const upcoming = [];
        const past = [];
        const transactionsList = [];

        bookings.forEach(booking => {
          const eventDate = new Date(booking.event?. date);
          const bookingData = {
            id: booking._id,
            name: booking. event?.title || 'Event',
            date: formatDate(booking.event?.date),
            time: formatTime(booking.event?. date),
            location: booking.event?.city || booking.event?.location || 'TBA',
            image: booking.event?.images?.[0] || '🎫',
            status: booking.status || 'confirmed',
            totalAmount: booking.totalAmount || 0,
            tickets: booking.tickets || [],
            eventId: booking.event?._id
          };

          if (eventDate >= now) {
            upcoming.push(bookingData);
          } else {
            past.push({
              ...bookingData,
              rating: 5
            });
          }

          transactionsList.push({
            name: booking.event?.title || 'Event',
            amount: `₹${booking.totalAmount || 0}`,
            date: formatDate(booking.createdAt || booking.bookingDate),
            status: booking.paymentStatus || 'completed'
          });
        });

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setTransactions(transactionsList);

        // Load saved events
        const savedEventIds = JSON.parse(localStorage. getItem('likedEvents') || '[]');
        if (savedEventIds.length > 0) {
          const allEvents = await fetchEvents();
          const events = Array.isArray(allEvents) ? allEvents : (allEvents.events || []);
          const saved = events
            .filter(event => savedEventIds.includes(event._id))
            .map(event => ({
              id: event._id,
              name: event.title,
              date: formatDate(event.date),
              price: getMinPrice(event),
              image: event.images?.[0] || '🎫'
            }));
          setSavedEvents(saved);
        }

        // Load notification preferences
        const savedNotifications = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
        if (Object.keys(savedNotifications).length > 0) {
          setNotifications(savedNotifications);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'TBA';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'TBA';
    }
  };

  const getMinPrice = (event) => {
    if (event.ticket_types && event.ticket_types.length > 0) {
      return `₹${Math.min(...event.ticket_types.map(t => t.price))}`;
    }
    return event.price ?  `₹${event.price}` : 'Free';
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setTempUserInfo(userInfo);
    }
    setIsEditing(! isEditing);
  };

  const handleSave = () => {
    const user = getCurrentUser();
    const updatedUser = { ...user, ...tempUserInfo };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    
    setUserInfo(tempUserInfo);
    setIsEditing(false);
    showNotificationMessage('✅ Profile updated successfully!');
  };

  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]:  !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
    showNotificationMessage(`${notifications[key] ? 'Disabled' : 'Enabled'} ${key} notifications`);
  };

  const handleLogout = () => {
    logout();
    showNotificationMessage('👋 Logged out successfully');
    setTimeout(() => navigate('/auth'), 1000);
  };

  const handleDeactivateAccount = () => {
    logout();
    showNotificationMessage('⚠️ Account deactivated');
    setTimeout(() => navigate('/auth'), 1500);
  };

  const handleDeleteAccount = () => {
    logout();
    showNotificationMessage('🗑️ Account deleted');
    setTimeout(() => navigate('/auth'), 1500);
  };

  const handleAddCard = () => {
    // Validate card details
    if (!newCard.cardNumber || !newCard. cardHolder || !newCard.expiryDate || !newCard. cvv) {
      showNotificationMessage('⚠️ Please fill all card details');
      return;
    }

    // Add new card
    const card = {
      id: paymentMethods.length + 1,
      type: newCard. cardNumber.startsWith('4') ? 'VISA' : 'MASTERCARD',
      lastFour: newCard.cardNumber.slice(-4),
      holder: newCard. cardHolder. toUpperCase(),
      expiry: newCard.expiryDate,
      isDefault: false
    };

    setPaymentMethods([...paymentMethods, card]);
    setShowAddCardModal(false);
    setNewCard({ cardNumber: '', cardHolder: '', expiryDate:  '', cvv: '' });
    showNotificationMessage('💳 Card added successfully! ');
  };

  const handleRemoveCard = (cardId) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== cardId));
    showNotificationMessage('Card removed');
  };

  const handleSetDefaultCard = (cardId) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    showNotificationMessage('✅ Default card updated');
  };

  const handleDownloadTicket = (eventId) => {
    showNotificationMessage('📥 Downloading ticket...');
  };

  const handleBookEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleRemoveSaved = (eventId) => {
    const savedEventIds = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    const updated = savedEventIds.filter(id => id !== eventId);
    localStorage.setItem('likedEvents', JSON.stringify(updated));
    setSavedEvents(savedEvents.filter(e => e.id !== eventId));
    showNotificationMessage('Removed from saved events');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border-l-4 border-purple-600">
            <div className="bg-purple-100 rounded-full p-2">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-800">{notificationMessage}</p>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeactivateModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Deactivate Account? </h3>
              <p className="text-gray-600">Your account will be temporarily disabled. You can reactivate it anytime by logging in again.</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleDeactivateAccount}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all"
              >
                Yes, Deactivate Account
              </button>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Account?</h3>
              <p className="text-gray-600 mb-4">This action cannot be undone.  All your data, bookings, and saved events will be permanently deleted.</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                <strong>Warning:</strong> This is permanent and irreversible! 
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddCardModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value. replace(/\s/g, '')})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Card Holder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({...newCard, cardHolder: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus: border-purple-600 focus: outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={newCard.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value. replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setNewCard({...newCard, expiryDate: value});
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="3"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value. replace(/\D/g, '')})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddCard}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all mt-6"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TicketEase
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-xl">
                  {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{userInfo.name}</h2>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
                
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', icon: User, label: 'Overview' },
                  { id: 'tickets', icon: Ticket, label:  'My Tickets', badge: upcomingEvents.length },
                  { id: 'saved', icon: Heart, label: 'Saved Events', badge: savedEvents.length },
                  { id: 'payment', icon: CreditCard, label: 'Payment' },
                  { id: 'notifications', icon: Bell, label: 'Notifications' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          activeTab === item.id ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg: col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Profile Info Card - EXPANDED WITH MORE FIELDS */}
                <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                    <div className="flex gap-2">
                      {isEditing && (
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        onClick={isEditing ? handleSave : handleEditToggle}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transition-all"
                      >
                        {isEditing ? <Save className="w-4 h-4" /> :  <Edit2 className="w-4 h-4" />}
                        <span>{isEditing ? 'Save' : 'Edit'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempUserInfo.name}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, name: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus: border-purple-600 focus: outline-none transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">{userInfo.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempUserInfo.email}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, email: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus: border-purple-600 focus: outline-none transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">{userInfo.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempUserInfo.phone}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus: border-purple-600 focus: outline-none transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">{userInfo.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempUserInfo.location}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, location: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">{userInfo. location || 'Not provided'}</p>
                      )}
                    </div>


                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date of Birth
                      </label>
                      {isEditing ?  (
                        <input
                          type="date"
                          value={tempUserInfo.dateOfBirth}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, dateOfBirth: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">{userInfo.dateOfBirth || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          value={tempUserInfo.gender}
                          onChange={(e) => setTempUserInfo({...tempUserInfo, gender: e.target. value})}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl capitalize">{userInfo.gender || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Management Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Management</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowDeactivateModal(true)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all font-semibold group"
                    >
                      <div className="flex items-center gap-3">
                        <UserX className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-bold">Deactivate Account</p>
                          <p className="text-xs text-orange-500">Temporarily disable your account</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold group"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-bold">Delete Account</p>
                          <p className="text-xs text-red-500">Permanently delete your account and data</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Tab - Removed Stats Cards */}
            {activeTab === 'tickets' && (
              <div className="space-y-6 animate-fade-in">
                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="group bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 hover: shadow-lg transition-all duration-300 transform hover:scale-102">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform overflow-hidden">
                                {event.image. startsWith('http') ? (
                                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-3xl">{event.image}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-lg">{event.name}</h4>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                event. status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {event.status}
                              </span>
                              <button 
                                onClick={() => handleDownloadTicket(event.eventId)}
                                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transition-all shadow-md"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => navigate(`/events/${event.eventId}`)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No upcoming events</p>
                      <button
                        onClick={() => navigate('/events')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Browse Events
                      </button>
                    </div>
                  )}
                </div>

                {/* Past Events */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Past Events</h3>
                  {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
                      {pastEvents. map(event => (
                        <div key={event.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all transform hover:scale-105">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow overflow-hidden">
                              {event.image.startsWith('http') ? (
                                <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">{event.image}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{event.name}</h4>
                              <p className="text-sm text-gray-600">{event.date}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                {[...Array(event.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No past events yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Events Tab */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Saved Events</h3>
                {savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedEvents. map(event => (
                      <div key={event.id} className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                        <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                          {event.image.startsWith('http') ? (
                            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-5xl">{event.image}</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 mb-2">{event.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{event.date}</p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-lg font-bold text-purple-600">{event.price}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRemoveSaved(event.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleBookEvent(event.id)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transition-all text-sm"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No saved events</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Discover Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Tab - WITH FUNCTIONAL ADD CARD */}
            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h3>
                  <div className="space-y-4">
                    {paymentMethods.map((card) => (
                      <div key={card.id} className="relative">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all cursor-pointer">
                          {card.isDefault && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              Default
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-8">
                            <div className="w-12 h-8 bg-white bg-opacity-30 rounded"></div>
                            <span className="text-sm font-bold">{card.type}</span>
                          </div>
                          <div className="text-xl tracking-wider mb-4">•••• •••• •••• {card. lastFour}</div>
                          <div className="flex justify-between">
                            <div>
                              <div className="text-xs opacity-70">Card Holder</div>
                              <div className="font-semibold">{card. holder}</div>
                            </div>
                            <div>
                              <div className="text-xs opacity-70">Expires</div>
                              <div className="font-semibold">{card. expiry}</div>
                            </div>
                          </div>
                        </div>
                        {paymentMethods.length > 1 && (
                          <div className="flex gap-2 mt-2">
                            {! card.isDefault && (
                              <button
                                onClick={() => handleSetDefaultCard(card.id)}
                                className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all text-sm font-semibold"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveCard(card.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover: bg-red-100 transition-all text-sm font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => setShowAddCardModal(true)}
                      className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all font-semibold"
                    >
                      + Add New Card
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h3>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((transaction, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                          <div>
                            <h4 className="font-semibold text-gray-800">{transaction.name}</h4>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">{transaction.amount}</p>
                            <span className={`text-xs font-semibold ${
                              transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'push', label:  'Push Notifications', desc:  'Get instant alerts on your device' },
                    { key:  'sms', label: 'SMS Notifications', desc: 'Text message updates' },
                    { key:  'eventReminders', label: 'Event Reminders', desc: 'Reminders before your events' },
                    { key: 'promotions', label: 'Promotional Offers', desc: 'Special deals and discounts' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.label}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(item.key)}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                          notifications[item.key] ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                          notifications[item.key] ? 'transform translate-x-6' : ''
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
        . animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}