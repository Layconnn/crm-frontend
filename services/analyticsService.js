import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

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

// API Call Functions for Analytics
export const fetchAnalyticsData = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/analytics`);
};

export const fetchTaskAnalytics = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/analytics/tasks`);
};

export const fetchContactAnalytics = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/analytics/contacts`);
};

export const fetchSalesAnalytics = async () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig();
  return authorizedFetch(`${apiBaseUrl}/analytics/sales`);
};
