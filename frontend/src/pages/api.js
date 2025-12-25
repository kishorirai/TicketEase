// small fetch wrapper for the backend
const API_BASE = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('authToken');
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ... headers,
    },
  };

  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = text ?  JSON.parse(text) : null;
  } catch (err) {
    // non-json response
    throw new Error(`Invalid JSON response: ${text}`);
  }
  if (!res.ok) {
    const err = new Error(data?. error || res.statusText || 'Request failed');
    err.status = res.status;
    err. body = data;
    throw err;
  }
  return data;
}

const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method:  'PUT', body }),
  del: (path, body) => request(path, { method: 'DELETE', body }),
};

// Event-specific helper functions
export const fetchEvents = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString ? `/events?${queryString}` : '/events';
  return api.get(path);
};

export const fetchEventById = (id) => {
  return api.get(`/events/${id}`);
};

export const createEvent = (eventData) => {
  return api.post('/events', eventData);
};

export const updateEvent = (id, eventData) => {
  return api.put(`/events/${id}`, eventData);
};

export const deleteEvent = (id) => {
  return api.del(`/events/${id}`);
};

// Booking-specific helper functions
export const createBooking = (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const fetchUserBookings = () => {
  return api.get('/bookings/my');
};

export const fetchBookingById = (id) => {
  return api.get(`/bookings/${id}`);
};

// Auth-specific helper functions
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData) => {
  return api.post('/auth/signup', userData);  
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export default api;