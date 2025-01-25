<template>
  <div class="transition-all duration-500 ease-in-out">
    <h2 class="text-xl font-bold mb-4">Contact List</h2>

  <!-- Scrollable Container -->
  <div class="overflow-x-auto scrollbar-hide">
    <!-- Table Header -->
    <div class="grid grid-cols-6 min-w-[850px] gap-4 font-medium bg-gray-200 p-4 rounded">
      <div>First Name</div>
      <div>Last Name</div>
      <div>Email</div>
      <div>Phone</div>
      <div>Company</div>
      <div class="justify-self-end">Actions</div>
    </div>

    <!-- Skeleton Loader -->
    <template v-if="loading">
      <div
        class="grid grid-cols-6 min-w-[850px] gap-4 font-medium bg-gray-200 p-4 rounded mb-4 animate-pulse"
      >
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-full"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2"></div>
        <div class="h-4 bg-gray-400 rounded w-full"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2 justify-self-end"></div>
      </div>
      <div
        v-for="n in 5"
        :key="'skeleton-' + n"
        class="grid grid-cols-6 min-w-[850px] gap-4 items-center border-b p-4 hover:bg-gray-50 animate-pulse"
      >
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-full"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2"></div>
        <div class="h-4 bg-gray-400 rounded w-full"></div>
        <div class="h-8 bg-gray-400 rounded w-1/2 justify-self-end"></div>
      </div>
    </template>

    <!-- No contacts found message -->
    <div v-if="!loading && contacts.length === 0" class="text-gray-500 text-center my-6">
      No contacts found
    </div>

    <!-- List of Contacts -->
    <template v-if="!loading">
      <div
        v-for="contact in contacts"
        :key="contact._id"
        class="grid grid-cols-6 min-w-[850px] gap-4 items-center border-b p-4 hover:bg-gray-50"
      >
        <div>{{ contact.firstName }}</div>
        <div>{{ contact.lastName }}</div>
        <div class="truncate overflow-hidden whitespace-nowrap text-ellipsis" :title="contact.email">
          {{ contact.email }}
        </div>
        <div>{{ contact.phone }}</div>
        <div class="truncate overflow-hidden whitespace-nowrap text-ellipsis" :title="contact.company">
          {{ contact.company }}
        </div>
        <div class="justify-self-end relative">
          <button
            @click="showActions(contact._id)"
            class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 ml-auto"
          >
            Actions
          </button>
          <div
            v-if="contact._id === activeContactId"
            ref="actionMenu"
            class="absolute bg-white shadow-lg rounded mt-2 p-2 border z-10"
          >
            <button
              @click="editContact(contact)"
              class="block px-4 py-2 text-center text-blue-600 bg-blue-100 rounded hover:bg-blue-200 w-full mb-2"
            >
              Edit
            </button>
            <button
              @click="deleteContact(contact._id)"
              class="block px-4 py-2 text-center text-red-600 bg-red-100 rounded hover:bg-red-200 w-full"
            >
              <template v-if="deleteLoading">
                <div
                  class="w-5 h-5 border-2 border-red-600 border-b-transparent rounded-full inline-block animate-spin"
                ></div>
              </template>
              <template v-else>Delete</template>
            </button>
          </div>
          <!-- Backdrop -->
          <div
            v-if="activeContactId"
            @click="closeActions"
            class="fixed inset-0 bg-transparent"
          ></div>
        </div>
      </div>
    </template>
  </div>

    <!-- Edit Modal -->
    <div
      v-if="isModalOpen"
      class="fixed transition-all duration-500 ease-in-out inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-20"
    >
      <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">Edit Contact</h3>

        <form @submit.prevent="submitEdit">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >First Name</label
              >
              <input
                v-model="editContactData.firstName"
                type="text"
                id="name"
                class="mt-1 p-2 w-full border rounded-md border-blue-200 outline-none"
                required
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Lirst Name</label
              >
              <input
                v-model="editContactData.lastName"
                type="text"
                id="name"
                class="mt-1 p-2 w-full border rounded-md border-blue-200 outline-none"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                v-model="editContactData.email"
                type="email"
                id="email"
                class="mt-1 p-2 w-full border rounded-md border-blue-200 outline-none"
                required
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700"
                >Phone</label
              >
              <input
                v-model="editContactData.phone"
                type="tel"
                id="phone"
                class="mt-1 p-2 w-full border rounded-md border-blue-200 outline-none"
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Company</label
              >
              <input
                v-model="editContactData.company"
                type="text"
                id="name"
                class="mt-1 p-2 w-full border rounded-md border-blue-200 outline-none"
                required
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Notes</label
              >
              <textarea
                v-model="editContactData.notes"
                type="text"
                id="name"
                class="mt-1 p-2 w-full border border-blue-200 rounded-md resize-none h-[5rem] outline-none"
                required
              />
            </div>

            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
              <template v-if="loadingEdit"><div class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Save Changes</template>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchContacts,
  deleteContact as apiDeleteContact,
  updateContact,
} from "@/services/contactService";
import { useUserStore } from "~/store/userStore";
import { useRouter } from "vue-router";
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

export default {
  data() {
    return {
      contacts: [],
      isModalOpen: false,
      activeContactId: null,
      editContactData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
        id: "",
      },
      loading: false,
      deleteLoading: ref(false), // delete Loading state
      loadingEdit: ref(false), // edit Loading state
    };
  },
  methods: {
    // Check if the user is authenticated
    async checkAuthentication() {
      const router = useRouter();
      const userStore = useUserStore();
      const token = userStore.token;
      if (!token) {
        router.push("/login"); // Redirect to login if not authenticated
        return false;
      }
      this.fetchContacts();
      showToast('Contacts Fetched!')
    },
    async fetchContacts() {
      try {
        this.loading = true;
        const contacts = await fetchContacts(); // Token injection handled in service
        this.contacts = contacts;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        const router = useRouter();
        const userStore = useUserStore();

        if (error.message === "Session expired. Please log in again.") {
          userStore.logout(router); // Logout and redirect
        } else {
          router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },

    editContact(contact) {
      this.editContactData = { ...contact }; // Pre-fill the modal
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.editContactData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
        _id: "",
      };
    },

    async submitEdit() {
      this.loadingEdit = true
      if (!this.editContactData._id) {
        console.error("Error: Contact ID is undefined.");
        return;
      }

      try {
        await updateContact(this.editContactData._id, this.editContactData);
        this.fetchContacts(); // Refresh contact list
        this.closeModal(); // Close modal
        this.activeContactId = null;
      } catch (error) {
        console.error("Error saving contact:", error);
        this.loadingEdit = false
        showToast(error)
      } finally{
        this.loadingEdit = false
        showToast('Contact Editted!')
      }
    },

    async deleteContact(_id) {
      this.deleteLoading = true
      try {
        await apiDeleteContact(_id);
        this.contacts = this.contacts.filter((contact) => contact._id !== _id); // Update the contact list
        this.activeContactId = null;
      } catch (error) {
        console.error("Error deleting contact:", error);
        this.deleteLoading = false
      } finally{
        this.deleteLoading = false
        showToast('Contact Deleted')
      }
    },

    // Toggle the action menu for a specific contact
    showActions(contactId) {
      if (this.activeContactId === contactId) {
        // Close the action menu if it's already open
        this.activeContactId = null;
      } else {
        // Open the action menu for the specified contact
        this.activeContactId = contactId;
      }
    },

    // Close the action menu (e.g., when clicking outside)
    closeActions() {
      this.activeContactId = null;
    },
  },
  mounted() {
    this.checkAuthentication();
  },
};
</script>
