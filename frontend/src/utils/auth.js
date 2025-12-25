// Centralized authentication utility

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("authUser");
  
  // Check if both token and user exist and are valid
  if (! token || token.trim() === "" || !user) {
    return false;
  }
  
  try {
    // Validate that user is valid JSON
    JSON.parse(user);
    return true;
  } catch (err) {
    // Invalid user data
    return false;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const getAuthUser = () => {
  try {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null;
  }
};

export const setAuth = (token, user) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON. stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};