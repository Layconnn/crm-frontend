<template>
 <div class="bg-white p-8 rounded-lg shadow-lg mb-6 max-w-[37.5rem]">
  <h2 class="text-2xl font-semibold text-blue-600 mb-6">Add New Contact</h2>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
      <input
        type="text"
        id="firstName"
        v-model="contact.firstName"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
        required
      />
    </div>

    <div>
      <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
      <input
        type="text"
        id="lastName"
        v-model="contact.lastName"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
        required
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        v-model="contact.email"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
        required
      />
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
      <input
        type="tel"
        id="phone"
        v-model="contact.phone"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
        required
      />
    </div>

    <div>
      <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
      <input
        type="text"
        id="company"
        v-model="contact.company"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
        required
      />
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
      <textarea
        id="notes"
        v-model="contact.notes"
        class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg resize-none"
        rows="4"
        required
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full mt-4 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-lg"
    >
    <template v-if="loading"><div class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Save Contact</template>
    </button>
  </form>
</div>
</template>


<script setup>
import { ref } from 'vue';
import { createContact } from '~/services/contactService';
import { useUserStore } from '~/store/userStore';
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

const emit = defineEmits(['contact-created']); // Declare the event
const router = useRouter();
const userStore = useUserStore();
const token = userStore.token;
const loading = ref(false);

const contact = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
});

const submitForm = async () => {
  loading.value = true
  if (!token) {
    loading.value = false
    alert('You must be logged in to save contacts.');
    router.push('/login');
    return;
  }

  const newContact = { ...contact.value };

  try {
    await createContact(newContact);
    contact.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      notes: '',
    };
    // Emit the event
    console.log('Event contact-created emitted');
    emit('contact-created');
  } catch (error) {
    console.error('Error saving contact:', error);
    loading.value = false
    showToast(error)
    alert('There was an error saving the contact.');
  } finally{
    loading.value = false
    showToast('Contact Created!')
  }
};
</script>


