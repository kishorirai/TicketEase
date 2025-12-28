// small fetch wrapper for the backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage. getItem('authToken');
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
    const err = new Error(data?.error || res. statusText || 'Request failed');
    err.status = res. status;
    err.body = data;
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

// ========================================
// Event-specific helper functions
// ========================================

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

// ========================================
// Landing Page / Conference specific helpers
// ========================================

/**
 * Fetch featured events for the carousel
 * @param {number} limit - Maximum number of featured events to fetch
 * @returns {Promise<Array>} Array of featured events
 */
export const fetchFeaturedEvents = async (limit = 5) => {
  try {
    const response = await fetchEvents();
    const events = Array.isArray(response) ? response : (response.events || []);
    // Return first 'limit' events
    // If you have a 'featured' field in your Event model, filter by it: 
    // const featuredEvents = events.filter(e => e. featured);
    // return featuredEvents.slice(0, limit);
    return events.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
};

/**
 * Get unique cities from all events with event counts
 * @returns {Promise<Array>} Array of city objects with name and event count
 */
export const fetchCities = async () => {
  try {
    const response = await fetchEvents();
    const events = Array.isArray(response) ? response : (response.events || []);
    
    // Extract unique cities and count events per city
    const cityMap = {};
    events.forEach(event => {
      if (event.city) {
        if (!cityMap[event.city]) {
          cityMap[event.city] = { 
            name: event.city, 
            events: 0 
          };
        }
        cityMap[event.city]. events++;
      }
    });
    
    // Convert to array
    const cities = Object.values(cityMap);
    
    // Sort cities by event count (descending) and return
    return cities.sort((a, b) => b.events - a.events);
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

/**
 * Fetch events by city
 * @param {string} city - City name to filter by
 * @returns {Promise<Array>} Array of events in that city
 */
export const fetchEventsByCity = (city) => {
  return fetchEvents({ city });
};

/**
 * Fetch events by location (venue)
 * @param {string} location - Location/venue name to filter by
 * @returns {Promise<Array>} Array of events at that location
 */
export const fetchEventsByLocation = (location) => {
  return fetchEvents({ location });
};

/**
 * Fetch events by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Array of events in that category
 */
export const fetchEventsByCategory = (category) => {
  return fetchEvents({ category });
};

/**
 * Fetch events by date
 * @param {string} date - Date to filter by (YYYY-MM-DD format)
 * @returns {Promise<Array>} Array of events on that date
 */
export const fetchEventsByDate = (date) => {
  return fetchEvents({ date });
};

/**
 * Search events by query string (multi-criteria)
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching events
 */
export const searchEvents = (query) => {
  return fetchEvents({ search: query });
};

// ========================================
// Booking-specific helper functions
// ========================================

export const createBooking = (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const fetchUserBookings = () => {
  return api.get('/bookings/my');
};

export const fetchBookingById = (id) => {
  return api.get(`/bookings/${id}`);
};

// ========================================
// Auth-specific helper functions
// ========================================

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

/**
 * Get currently logged in user
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('authUser');
  return userStr ?  JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  return !!getToken();
};

export default api;