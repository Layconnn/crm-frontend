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

export const fetchTasks = async () => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/tasks`);
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    throw error;
  }
};

export const fetchTaskById = async (id) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/tasks/${id}`);
  } catch (error) {
    console.error(`Error in fetchTaskById (ID: ${id}):`, error);
    throw error;
  }
};

export const createTask = async (newTaskData) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/tasks`, {
      method: 'POST',
      body: JSON.stringify(newTaskData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
};

export const updateTask = async (id, updatedTaskData) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTaskData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error in updateTask (ID: ${id}):`, error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig();
    return await authorizedFetch(`${apiBaseUrl}/tasks/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error in deleteTask (ID: ${id}):`, error);
    throw error;
  }
};
