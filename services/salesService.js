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
  const token = userStore.token;

  console.log('Token:', token); // Debugging token

  if (!token) {
    throw new Error('No authorization token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`, // Attach token to the Authorization header
      ...options.headers,
    },
  });

  if (!response.ok) {
    handleUnauthorized(response);
  }

  return response.json();
};

// API Call Functions
export const fetchOpportunities = async () => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig(); // Access the base URL from runtime config
    return await authorizedFetch(`${apiBaseUrl}/sales-opportunities`);
  } catch (error) {
    console.error('Error in fetchOpportunities:', error);
    throw error;
  }
};

export const createOpportunity = async (opportunity) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/sales-opportunities`, {
      method: 'POST',
      body: JSON.stringify(opportunity),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    throw error;
  }
};

export const updateOpportunity = async (opportunity) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/sales-opportunities/${opportunity._id}`, {
      method: 'PUT',
      body: JSON.stringify(opportunity),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error in updateOpportunity (ID: ${opportunity._id}):`, error);
    throw error;
  }
};

export const deleteOpportunity = async (id) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    await authorizedFetch(`${apiBaseUrl}/sales-opportunities/${id}`, {
      method: 'DELETE',
    });
    return { success: true, message: 'Opportunity deleted successfully' };
  } catch (error) {
    console.error(`Error in deleteOpportunity (ID: ${id}):`, error);
    throw error;
  }
};
