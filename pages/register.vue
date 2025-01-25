<template>
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" id="email" type="email" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" id="password" type="password" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input v-model="confirmPassword" id="confirmPassword" type="password" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div class="flex justify-between items-center">
            <button type="submit" class="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700">Register</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import { registerUser } from '~/services/registerService';
import { useUserStore } from '~/store/userStore'; // Import the user store
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Define reactive data for email, password, and confirmPassword
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Page meta definition to disable the layout on the registration page
definePageMeta({
  layout: false, // This will ensure the default layout is not used
});

// Handle register logic
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }

  try {
    const userData = await registerUser(email.value, password.value); // Get user data including userId

    // Use the Pinia store to set the user and token
    const userStore = useUserStore();
    userStore.setUser({
      email: email.value,
      token: userData.token, // Store token from the response
      userId: userData.userId, // Store userId from the response
    });

    // Redirect to the dashboard with the userId in the URL
    const router = useRouter();
    router.push(`/dashboard/${userData.userId}`);
  } catch (error) {
    alert('Registration failed. Please try again.');
  }
};
</script>

  