const API_URL = "/api";

// Helper function for API calls
async function apiCall(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API Error");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Auth APIs
const AuthAPI = {
  signup: (name, email, password, phone, role) =>
    apiCall("/auth/signup", "POST", { name, email, password, phone, role }),

  login: (email, password) =>
    apiCall("/auth/login", "POST", { email, password }),

  adminLogin: (username, password) =>
    apiCall("/auth/admin-login", "POST", { username, password }),
};

// Listing APIs
const ListingAPI = {
  getAll: () => apiCall("/listings", "GET"),

  getById: (id) => apiCall(`/listings/${id}`, "GET"),

  create: (data) => apiCall("/listings", "POST", data),

  update: (id, data) => apiCall(`/listings/${id}`, "PATCH", data),

  delete: (id) => apiCall(`/listings/${id}`, "DELETE"),
};

// Lead APIs
const LeadAPI = {
  getAll: () => apiCall("/leads", "GET"),

  create: (name, phone, listingId) =>
    apiCall("/leads", "POST", { name, phone, listingId }),

  updateStatus: (id, status) =>
    apiCall(`/leads/${id}`, "PATCH", { status }),

  delete: (id) => apiCall(`/leads/${id}`, "DELETE"),
};

// Auth State
let currentUser = null;

function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

function getAuthToken() {
  return localStorage.getItem("token");
}

function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  if (!currentUser) {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  }
  return currentUser;
}

function logout() {
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}

function isLoggedIn() {
  return !!getAuthToken();
}
