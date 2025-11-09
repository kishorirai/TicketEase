import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Adjust for your backend port/host as needed

export const fetchEvents = () => axios.get(`${API_BASE}/events`);

// ADD THIS EXPORT:
export const fetchEventDetails = (eventId) =>
  axios.get(`${API_BASE}/events/${eventId}`).then(res => res.data);