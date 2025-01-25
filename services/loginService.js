import { useUserStore } from '../store/userStore';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig to access environment variables

export const loginUser = async (email, password) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig(); // Access the base URL from runtime config
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // Use userStore to manage user and token state
    const userStore = useUserStore();
    userStore.setUser(data); // This will store token, email, userId

    console.log('User data from login:', data);

    return data; // Return user data including token, userId, and email
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
