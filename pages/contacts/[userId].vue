<template>
  <div class="space-y-8 transition-all duration-500 ease-in-out">
    <h1 class="text-3xl font-bold">Manage Contacts</h1>
    <ContactList ref="contactListRef" />
    <ContactForm @contact-created="refreshContacts" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '~/store/userStore';
import { useRouter, useRoute } from 'vue-router';
import ContactForm from '~/components/contactForm.vue';
import ContactList from '~/components/contactList.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const userId = route.params.userId; // Access the userId from the route

// Reference to the ContactList component
const contactListRef = ref(null);

// Check if user is authenticated
const checkAuthentication = async () => {
  const token = userStore.token;
  if (!token) {
    router.push('/login'); // Redirect to login
    return false;
  }
  return true;
};

// Refresh contacts after a new contact is created
const refreshContacts = async () => {
  if (contactListRef.value) {
    console.log('Refreshing contacts...');
    await contactListRef.value.fetchContacts();
  } else {
    console.warn('contactListRef is not available, retrying...');
    await nextTick(); // Wait for next DOM update
    if (contactListRef.value) {
      await contactListRef.value.fetchContacts();
    } else {
      console.error('Failed to refresh contacts: contactListRef still unavailable');
    }
  }
};

// Ensure child components are mounted before interacting with them
onMounted(async () => {
  if (await checkAuthentication()) {
    await nextTick(); // Wait until DOM updates and `contactListRef` is available
    console.log('User ID:', userId); // Log userId for debugging
    refreshContacts(); // Load contacts initially
  }
});
</script>