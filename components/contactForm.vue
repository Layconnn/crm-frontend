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
         :class="{ 'border-red-500': errors.firstName }"
       />
       <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">{{ errors.firstName }}</p>
     </div>
 
     <div>
       <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
       <input
         type="text"
         id="lastName"
         v-model="contact.lastName"
         class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
         :class="{ 'border-red-500': errors.lastName }"
       />
       <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">{{ errors.lastName }}</p>
     </div>
 
     <div>
       <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
       <input
         type="email"
         id="email"
         v-model="contact.email"
         class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
         :class="{ 'border-red-500': errors.email }"
       />
       <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
     </div>
 
     <div>
       <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
       <input
         type="tel"
         id="phone"
         v-model="contact.phone"
         class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
         :class="{ 'border-red-500': errors.phone }"
       />
       <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
     </div>
 
     <div>
       <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
       <input
         type="text"
         id="company"
         v-model="contact.company"
         class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
         :class="{ 'border-red-500': errors.company }"
       />
       <p v-if="errors.company" class="text-red-600 text-sm mt-1">{{ errors.company }}</p>
     </div>
 
     <div>
       <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
       <textarea
         id="notes"
         v-model="contact.notes"
         class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg resize-none"
         rows="4"
        :class="{ 'border-red-500': errors.notes }"
       ></textarea>
       <p v-if="errors.notes" class="text-red-600 text-sm mt-1">{{ errors.notes }}</p>
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
 
 // Toast function
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
 
 // Emit event for contact creation
 const emit = defineEmits(['contact-created']);
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
 
 // Validation errors
 const errors = ref({
   firstName: '',
   lastName: '',
   email: '',
   phone: '',
   company: '',
   notes: '',
 });
 
 const validateForm = () => {
   let valid = true;
 
   // Validate required fields
   errors.value.firstName = contact.value.firstName.trim() === '' ? 'First name is required.' : '';
   errors.value.lastName = contact.value.lastName.trim() === '' ? 'Last name is required.' : '';
   errors.value.email = contact.value.email.trim() === '' ? 'Email is required.' : '';
   errors.value.phone = contact.value.phone.trim() === '' ? 'Phone number is required.' : '';
   errors.value.company = contact.value.company.trim() === '' ? 'Company name is required.' : '';
   errors.value.notes = contact.value.notes.trim() === '' ? 'Notes are required.' : '';
 
   // Check if there are any errors
   for (const key in errors.value) {
     if (errors.value[key]) {
       valid = false;
      //  showToast(errors.value[key], 'error'); // Show toast for each error
     }
   }
 
   return valid;
 };
 
 const submitForm = async () => {
   loading.value = true;
 
   if (!token) {
     loading.value = false;
     alert('You must be logged in to save contacts.');
     router.push('/login');
     return;
   }
 
   if (!validateForm()) {
     loading.value = false; // Stop loading if validation fails
     return;
   }
 
   const newContact = { ...contact.value };
 
   try {
     await createContact(newContact);
 
     // Reset form and emit success
     contact.value = {
       firstName: '',
       lastName: '',
       email: '',
       phone: '',
       company: '',
       notes: '',
     };
     emit('contact-created');
     showToast('Contact Created!', 'success');
   } catch (error) {
     console.error('Error saving contact:', error);
     showToast('There was an error saving the contact.', 'error');
   } finally {
     loading.value = false;
   }
 };
 </script>
 