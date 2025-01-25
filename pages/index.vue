<template>
  <main class="w-full px-6 py-8 flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-300">
    <div class="w-full max-w-2xl bg-white p-10 rounded-xl shadow-xl transform transition hover:scale-105 duration-300">
      <!-- Branding -->
      <div class="text-center mb-8">
        <div class="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-full shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-16 h-16 text-blue-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.25 3.75L8.75 6.25M3.75 11.25L6.25 8.75M3.75 3.75L11.25 11.25M14.25 8.75L20.25 14.25M8.75 14.25L6.25 16.75M16.75 20.25L20.25 16.75"
            />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span class="text-blue-600">My CRM</span>
        </h1>
        <p class="text-gray-600 mb-8 text-lg">
          Manage your customers, tasks, and sales pipeline with ease and precision. 
          A solution tailored to grow your business and streamline operations.
        </p>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-6">
        <NuxtLink
          to="/login"
          class="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg text-center font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg text-center font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105"
        >
          Register
        </NuxtLink>
      </div>

      <!-- Features Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">
          Why Choose Us?
        </h2>
        <ul class="space-y-4 text-gray-600">
          <li class="flex items-center gap-4">
            <span class="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✔</span>
            A user-friendly, intuitive interface that saves you time.
          </li>
          <li class="flex items-center gap-4">
            <span class="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✔</span>
            Seamless management of customer data with secure, reliable storage.
          </li>
          <li class="flex items-center gap-4">
            <span class="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✔</span>
            Real-time reporting and insights to track your business growth.
          </li>
        </ul>
      </div>

      <!-- Monetary Context Section -->
      <div class="mt-12 text-center">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">
          Empower Your Business Today
        </h3>
        <p class="text-lg text-gray-500 mb-6">
          With My CRM, you're not just organizing your data — you're increasing your profits. 
          Our platform is designed to help you close more deals, improve customer retention, and make smarter business decisions.
        </p>
        <div class="text-lg font-bold text-blue-600">
          Start managing your sales pipeline now and watch your revenue soar!
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// Disable the default layout
definePageMeta({
  layout: false, // This will ensure the default layout is not used
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
