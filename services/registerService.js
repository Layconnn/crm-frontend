import { useUserStore } from '../store/userStore'; // Adjust the path as necessary
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig to access environment variables

export const registerUser = async (email, password) => {
  try {
    const { public: { apiBaseUrl } } = useRuntimeConfig(); // Access the base URL from runtime config
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || 'Registration failed';
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Use the Pinia store to update user state
    const userStore = useUserStore();
    userStore.setUser({
      token: data.token,
      email: data.email, // Assuming the API returns email or other user data
      userId: data.userId, // Assuming the API now returns userId
      ...data, // Include any other user-related data returned by the API
    });

    return data; // Return user data including userId and token
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
