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

  if (!token) {
    throw new Error('No authorization token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': options.headers?.['Content-Type'] || 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    handleUnauthorized(response); // Check for 401 or other errors
  }

  return response.json();
};

// API Call Functions
export const fetchContacts = async () => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/contacts`);
  } catch (error) {
    console.error('Error in fetchContacts:', error);
    throw error;
  }
};

export const fetchContactById = async (id) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/contacts/${id}`);
  } catch (error) {
    console.error(`Error in fetchContactById (ID: ${id}):`, error);
    throw error;
  }
};

export const createContact = async (contactData) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in createContact:', error);
    throw error;
  }
};

export const updateContact = async (id, updatedData) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error in updateContact (ID: ${id}):`, error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/contacts/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error in deleteContact (ID: ${id}):`, error);
    throw error;
  }
};
