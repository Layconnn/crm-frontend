<template>
  <div class="relative">
    <!-- Navigation Bar -->
    <nav class="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-20 shadow-lg flex justify-between items-center max-sm:z-[10]">
      <h1 class="text-xl font-bold">CRM App</h1>

      <!-- Hamburger Button (Visible on Small Screens) -->
      <button
        class="sm:hidden p-2 bg-blue-500 rounded text-white hover:bg-blue-700"
        @click="toggleMenu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Logout button (Desktop & Tablet) -->
      <button
        @click="handleLogout"
        class="hidden sm:block p-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>

    <!-- Main Container -->
    <div class="flex pt-16">
      <!-- Sidebar (Desktop) -->
      <aside class="w-1/4 bg-gray-100 h-screen p-4 fixed top-16 left-0 z-10 flex flex-col justify-between max-sm:hidden">
        <ul>
          <li v-for="link in links" :key="link.name">
            <NuxtLink
              :to="link.path"
              :class="getLinkClass(link.path)"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
        <!-- Logout button (Desktop) -->
        <button
          @click="handleLogout"
          class="block p-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 self-center"
        >
          Logout
        </button>
      </aside>

      <!-- Hamburger Menu (Mobile) -->
      <transition name="slide-fade">
        <div
          v-if="isMenuOpen"
          class="fixed h-fill-available top-16 left-0 w-3/4 bg-gray-100 p-4 z-10 sm:hidden max-sm:z-[1] flex flex-col justify-between"
        >
          <ul>
            <li v-for="link in links" :key="link.name">
              <NuxtLink
                :to="link.path"
                :class="getLinkClass(link.path)"
                @click="closeMenu"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
          <!-- Logout button (Mobile) at the bottom -->
          <button
            @click="handleLogout"
            class="block p-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 self-baseline"
          >
            Logout
          </button>
        </div>
      </transition>

      <!-- Main Content -->
      <main class="w-full sm:w-3/4 px-6 py-8 ml-auto bg-gray-50 max-sm:p-4">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '~/store/userStore';
import { useRoute, useRouter } from 'vue-router';  // Import useRouter
import { ref, computed } from 'vue';

export default {
  name: 'DefaultLayout',
  layout: false,
  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();  // Get the router instance
    const isMenuOpen = ref(false);

    // Define navigation links dynamically based on user ID
    const links = computed(() => {
      const userId = userStore.userId;
      if (!userId) return []; // Return empty if userId is not available

      return [
        { name: 'Dashboard', path: `/dashboard/${userId}` },
        { name: 'Contacts', path: `/contacts/${userId}` },
        { name: 'Tasks', path: `/tasks/${userId}` },
        { name: 'Sales Pipeline', path: `/sales/${userId}` },
        { name: 'Analytics', path: `/analytics/${userId}` },
      ];
    });

    // Toggle menu visibility
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    // Close the menu
    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    // Determine the class for active links
    const getLinkClass = (path) => {
      const isActive = route.path === path; // Check if the current path matches the link path
      return isActive
        ? 'block p-2 bg-blue-500 text-white rounded' // Active link styles
        : 'block p-2 hover:bg-gray-200'; // Default styles
    };

    // Handle logout functionality
    const handleLogout = () => {
      userStore.logout(router);  // Pass the router instance here
    };

    return { userStore, links, getLinkClass, isMenuOpen, toggleMenu, closeMenu, handleLogout };
  },
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
