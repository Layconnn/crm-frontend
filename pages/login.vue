<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" id="email" type="email" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" id="password" type="password" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div class="flex justify-between items-center">
            <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-md"><template v-if="loading"><div class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Log In</template></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '~/services/loginService';
import { useUserStore } from '~/store/userStore'; // Import the user store

// Page meta definition to disable the layout on the login page
definePageMeta({
  layout: false, // This will ensure the default layout is not used
});

// Define reactive data for email and password
const email = ref('');
const password = ref('');
const loading = ref(false); // Fix here: make loading a reactive ref

// Get the router and user store in the setup function
const router = useRouter();
const userStore = useUserStore();

// Handle login logic
const handleLogin = async () => {
  try {
    loading.value = true; // Fix here: use .value to change loading
    const data = await loginUser(email.value, password.value);

    if (data.userId && data.token) {
      userStore.setUser({
        email: data.email,
        userId: data.userId,
        token: data.token,
      });

      router.push(`/dashboard/${data.userId}`);
    } else {
      loading.value = false; // Fix here: use .value to change loading
      alert('Login failed. Please try again.');
    }
  } catch (error) {
    alert('Login failed. Please check your credentials and try again.');
    console.error('Login error:', error);
    loading.value = false; // Fix here: use .value to change loading
  } finally{
    loading.value = false
  }
};
</script>
