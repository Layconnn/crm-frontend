<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="name"
            id="name"
            type="name"
            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2"
            :class="{ 'border-red-500': nameError }"
          />
          <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2"
            :class="{ 'border-red-500': emailError }"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2"
            :class="{ 'border-red-500': passwordError }"
          />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
        </div>
        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2"
            :class="{ 'border-red-500': confirmPasswordError }"
          />
          <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
        </div>
        <div class="flex justify-between items-center">
          <button type="submit" class="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700">
            <template v-if="loading">
              <div
                class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"
              ></div>
            </template>
            <template v-else>Register</template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { registerUser } from '~/services/registerService';
import { useUserStore } from '~/store/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toastify from 'toastify-js';

const showToast = (message, type = 'success') => {
  Toastify({
    text: message,
    duration: 1000,
    close: true,
    gravity: 'bottom',
    position: 'right',
    backgroundColor: type === 'success' ? '#4caf50' : '#f44336', // Green for success, red for error
  }).showToast();
};

// Define reactive data for inputs and error messages
const name = ref('')
const email = ref('');
const password = ref('');
const loading = ref(false);
const confirmPassword = ref('');
const nameError = ref('')
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

definePageMeta({
  layout: false,
});

const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  // Reset errors
  nameError.value = name.value.trim() === '' ? 'Name is required.' : '';
  emailError.value = email.value.trim() === '' ? 'Email is required.' : '';
  passwordError.value = password.value.trim() === '' ? 'Password is required.' : '';
  confirmPasswordError.value = confirmPassword.value.trim() === '' ? 'Confirm password is required.' : '';

  // Check for mismatched passwords
  if (!nameError.value && !emailError.value && !passwordError.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match.';
  }

  // Prevent submission if there are errors
  if (!nameError.value && emailError.value || passwordError.value || confirmPasswordError.value){
    return;
  }

  try {
    loading.value = true
    const userData = await registerUser(name.value, email.value, password.value);

    userStore.setUser({
      name: name.value,
      email: email.value,
      token: userData.token,
      userId: userData.userId,
    });

    router.push(`/dashboard/${userData.userId}`);
  } catch (error) {
    loading.value = false
    console.log('ERROR REGISTERING:', error)
  } finally{
    loading.value = false
  }
};
</script>
