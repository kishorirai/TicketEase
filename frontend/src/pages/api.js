import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchEvents = () => axios.get(`${API_BASE}/events`);

export const fetchEventDetails = (eventId) =>
  axios.get(`${API_BASE}/events/${eventId}`).then((res) => res.data);
