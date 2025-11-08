import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import EventListingPage from './pages/EventLists';
import EventDetails from './pages/EventDetails';
import BookingFlow from './pages/Bookings';
import AdminDashboard from './pages/AdminDashboard'; // ✅ Import added

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventListingPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/bookings" element={<BookingFlow />} />
          <Route path="/admindashboard" element={<AdminDashboard />} /> {/* ✅ New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
