<template>
    <div>
      <h2 class="text-2xl font-bold">Analytics</h2>
      <p>View your CRM analytics here.</p>
    </div>
  </template>
  

  <script setup>
import { useRoute } from 'vue-router'; // Import useRoute to access route params

const route = useRoute(); // Access the current route
const userId = route.params.userId; // Access the userId from the route
console.log('User ID:', userId); // Log the userId to verify
</script>