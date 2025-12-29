import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import EventListingPage from './pages/EventLists';
import EventDetailsPage from './pages/EventDetails';
import BookingsPage from './pages/Bookings';
import TicketEaseAuth from './pages/Authpage';
import BookingSuccess from './pages/BookingSuccess';
import Profile from './pages/Profile';

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
          <Route path="/bookings/success" element={<BookingSuccess />} />
          <Route path="/auth" element={<TicketEaseAuth />} />
          <Route path="/Authpage" element={<Navigate to="/auth" replace />} />
          <Route path="/profile" element={<Profile />} />   

        </Routes>
      </div>
    </Router>
  );
}

export default App;