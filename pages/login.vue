<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 max-sm:w-80">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
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
        <div class="mb-6">
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
        <div class="flex justify-between items-center">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white p-3 rounded-md"
          >
            <template v-if="loading">
              <div
                class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"
              ></div>
            </template>
            <template v-else>Log In</template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "~/services/loginService";
import { useUserStore } from "~/store/userStore";
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

definePageMeta({
  layout: false,
});

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const loading = ref(false);

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  emailError.value = email.value.trim() === "" ? "Email is required." : "";
  passwordError.value = password.value.trim() === "" ? "Password is required." : "";

  // Prevent login attempt if there are validation errors
  if (emailError.value || passwordError.value) return;

  try {
    loading.value = true;
    const data = await loginUser(email.value, password.value);

    if (data.userId && data.token) {
      userStore.setUser({
        email: data.email,
        userId: data.userId,
        token: data.token,
      });

      router.push(`/dashboard/${data.userId}`);
    } else {
      showToast('Log In Failed.', 'error')
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast('Invalid Credentials.', 'error')
  } finally {
    loading.value = false;
  }
};
</script>
