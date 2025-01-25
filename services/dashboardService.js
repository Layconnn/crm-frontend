import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig to access environment variables

// Handle 401 Unauthorized Responses
const handleUnauthorized = (response) => {
  if (response.status === 401) {
    const userStore = useUserStore();
    const router = useRouter();
    userStore.logout(router); // Logout user and redirect to login
    throw new Error('Session expired. Please log in again.');
  }
};

// Utility Function for Authorized Fetch Requests
const authorizedFetch = async (url, options = {}) => {
  const userStore = useUserStore();
  const token = userStore.token || JSON.parse(localStorage.getItem('user'))?.token;
  console.log("Authorization Token:", token);

  if (!token) {
    throw new Error('No authorization token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  console.log("Fetch Response Status:", response.status);
  if (response.status === 401) {
    handleUnauthorized(response);
  }

  if (!response.ok) {
    console.error("Fetch Error Response:", await response.text());
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Fetch Response Data:", data); // Log the fetched data
  return data;
};

// API Call Functions
export const fetchDashboardData = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/dashboard/summary`);
};

export const fetchTaskSummaryByStatus = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/dashboard/tasks-summary/status`);
};

export const fetchTaskSummaryByPriority = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/dashboard/tasks-summary/priority`);
};

export const fetchRecentActivities = async (limit = 10, page = 1) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/dashboard/recent-activity?limit=${limit}&page=${page}`);
};

export const fetchUpcomingDeadlines = async (limit = 5, page = 1) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/dashboard/upcoming-deadlines?limit=${limit}&page=${page}`);
};

export const fetchContactSummary = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  try {
    const response = await authorizedFetch(`${apiBaseUrl}/dashboard/contacts-summary`);
    console.log("Contact Summary Response:", response); // Log the response for debugging
    return response; // Return the response
  } catch (error) {
    console.error("Error fetching contact summary:", error);
    throw error; // Re-throw the error for proper error handling
  }
};
