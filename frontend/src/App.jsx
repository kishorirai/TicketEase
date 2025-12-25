import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import EventListingPage from './pages/EventLists';
import EventDetailsPage from './pages/EventDetails';
import BookingsPage from './pages/Bookings';
import AdminDashboard from './pages/AdminDashboard';
import TicketEaseAuth from './pages/Authpage';
import BookingSuccess from './pages/BookingSuccess';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventListingPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          
          {/* Success page route - CORRECT PATH */}
          <Route path="/bookings/success" element={<BookingSuccess />} />
          
          {/* Redirect old routes for backwards compatibility */}
          <Route path="/bookingsuccess" element={<Navigate to="/bookings/success" replace />} />
          <Route path="/bookings/bookingsuccess" element={<Navigate to="/bookings/success" replace />} />
          
          <Route path="/admindashboard" element={<AdminDashboard />} />

          {/* canonical auth route used by EventDetails */}
          <Route path="/auth" element={<TicketEaseAuth />} />

          {/* keep /Authpage working for older links by redirecting to /auth */}
          <Route path="/Authpage" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;