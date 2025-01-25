<template>
  <div class="p-6 max-w-7xl mx-auto max-sm:p-2">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Sales Opportunities</h1>

    <!-- Create Opportunity Form -->
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-[37.5rem]">
      <h2 class="text-2xl font-semibold text-blue-600 mb-6">Create New Opportunity</h2>
      <form @submit.prevent="createOpportunityData" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            v-model="newOpportunity.title"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="newOpportunity.description"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg resize-none"
            rows="4"
            placeholder="Provide a brief description of the opportunity"
          ></textarea>
        </div>

        <div>
          <label for="stage" class="block text-sm font-medium text-gray-700">Stage</label>
          <select
            id="stage"
            v-model="newOpportunity.stage"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          >
            <option value="Prospect">Prospect</option>
            <option value="Qualified">Qualified</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>

        <div>
          <label for="value" class="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="number"
            id="value"
            v-model="newOpportunity.value"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          />
        </div>

        <div>
          <label for="expectedCloseDate" class="block text-sm font-medium text-gray-700">Expected Close Date</label>
          <input
            type="date"
            id="expectedCloseDate"
            v-model="newOpportunity.expectedCloseDate"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          />
        </div>

        <div>
          <label for="expectedCloseDate" class="block text-sm font-medium text-gray-700">Created By</label>
          <input
            type="object"
            id="createdBy"
            v-model="newOpportunity.createdBy"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          />
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            v-model="newOpportunity.priority"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full mt-4 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-lg outline-none"
        >
        <template v-if="createLoading"><div class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Create Opportunity</template>
        </button>
      </form>
    </div>

    <!-- Opportunities List -->
    <div v-if="loading" class="mt-8">
  <h2 class="text-2xl font-semibold text-gray-900 mb-6">Existing Opportunities</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="index in 3"  
      :key="'skeleton-' + index"
      class="bg-gray-200 p-6 rounded-lg shadow-lg animate-pulse"
    >
      <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>  <!-- Title skeleton -->
      <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>  <!-- Stage and Priority skeleton -->
      <div class="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>  <!-- Value skeleton -->
      <div class="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>  <!-- Date skeleton -->
      <div class="h-10 bg-blue-600 rounded-md mb-2 w-full"></div> <!-- Update Button skeleton -->
      <div class="h-10 bg-red-600 rounded-md w-full"></div>  <!-- Delete Button skeleton -->
    </div>
  </div>
</div>
    <div v-if="error" class="text-center text-red-500 mt-8">Error loading opportunities</div>

    <!-- Modal for Editing Opportunity -->
    <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 z-[100] max-sm:w-[350px] max-sm:p-4">
        <h3 class="text-2xl font-semibold text-blue-600 mb-6">Edit Opportunity</h3>
        <form @submit.prevent="submitEditOpportunity">
          <div>
            <label for="editTitle" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="editTitle"
              v-model="editOpportunity.title"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              required
            />
          </div>

          <div>
            <label for="editDescription" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="editDescription"
              v-model="editOpportunity.description"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg resize-none"
              rows="4"
              placeholder="Provide a brief description of the opportunity"
            ></textarea>
          </div>

          <div>
            <label for="editStage" class="block text-sm font-medium text-gray-700">Stage</label>
            <select
              id="editStage"
              v-model="editOpportunity.stage"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              required
            >
              <option value="Prospect">Prospect</option>
              <option value="Qualified">Qualified</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <label for="editValue" class="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              id="editValue"
              v-model="editOpportunity.value"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              required
            />
          </div>

          <div>
            <label for="editExpectedCloseDate" class="block text-sm font-medium text-gray-700">Expected Close Date</label>
            <input
              type="date"
              id="editExpectedCloseDate"
              v-model="editOpportunity.expectedCloseDate"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              required
            />
          </div>

          <div>
            <label for="editPriority" class="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="editPriority"
              v-model="editOpportunity.priority"
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button
            type="submit"
            class="w-full mt-4 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg outline-none"
          >
          <template v-if="loadingEdit"><div class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Save</template>
          </button>
        

        <button
          @click="closeModal"
          class="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full outline-none"
        >
          Close
        </button>
          </div>
          
         
      </form>
      </div>
    </div>

    <div v-if="!loading && !error && opportunities.length > 0" class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Existing Opportunities</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="opportunity in opportunities"
          :key="opportunity._id"
          class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h3 class="text-lg font-semibold text-gray-800">{{ opportunity.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ opportunity.stage }} - {{ opportunity.priority }}</p>
          <p class="text-lg font-bold text-indigo-600 mt-2">{{ formatCurrency(opportunity.value) }}</p>
          <p class="text-sm text-gray-600 mt-2">Expected Close: {{ formatDate(opportunity.expectedCloseDate) }}</p>
          <button
            @click="openModal(opportunity)"
            class="mt-4 mb-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full outline-none"
          >
            Update Opportunity
          </button>
          <button
          @click="confirmDelete(opportunity)"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full outline-none"
        >
          Delete Opportunity
        </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96  max-sm:w-[300px]">
        <h3 class="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
        <p class="text-sm text-gray-600 mt-2">
          Are you sure you want to delete the opportunity "{{ selectedOpportunity?.title }}"? This action cannot be undone.
        </p>
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 outline-none"
          >
            No
          </button>
          <button
            @click="deleteOpportunityData"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 outline-none"
          >
          <template v-if="deleteLoading"><div class="w-5 h-5 border-2 border-red-600 border-b-transparent rounded-full inline-block animate-spin"></div></template> <template v-else>Yes, Delete</template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // For redirection
import { useUserStore } from '~/store/userStore'; // Import the store
import { fetchOpportunities, createOpportunity, updateOpportunity, deleteOpportunity } from '~/services/salesService'; // Import service functions
import { useRoute } from 'vue-router'; // Import useRoute to access route params
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

const route = useRoute(); // Access the current route
const userId = route.params.userId; // Access the userId from the route
console.log('User ID:', userId); // Log the userId to verify
const user = useUserStore.user; // Access the user name from the store

const router = useRouter(); // To redirect if not authenticated

const newOpportunity = ref({
  title: '',
  description: '',
  stage: 'Prospect',
  value: null,
  expectedCloseDate: '',
  priority: 'Medium',
  createdBy: userId, // Assign the userId to the createdBy field
});

const editOpportunity = ref({}); // For editing an existing opportunity
const loading = ref(false);
const deleteLoading = ref(false); // delete Loading state
const createLoading = ref(false); // create Loading state
const loadingEdit = ref(false); // edit Loading state
const error = ref(false);
const showModal = ref(false); // Controls the modal visibility
const showDeleteModal = ref(false);
const selectedOpportunity = ref(null);

// Opportunities list
const opportunities = ref([]);
console.log('Opportunties:', opportunities.value)



// Access user store for token
const userStore = useUserStore();

// Check if the user is authenticated by checking the token in the store
const checkAuthentication = () => {
  const token = userStore.token;
  if (!token) {
    // If no token exists, redirect to login page
    router.push('/login');
    return;
  }
};

// Fetch opportunities from API
const fetchOpportunitiesData = async () => {
  loading.value = true;
  try {
    checkAuthentication(); // Ensure authentication before API call
    opportunities.value = await fetchOpportunities();
    console.log('Opportunties:', opportunities.value)
  } catch (err) {
    error.value = true;
    console.error('Error fetching opportunities:', err);
    showToast(err)
  } finally {
    loading.value = false;
    showToast('Opportunities Fetched!')
  }
};




// Create new opportunity
const createOpportunityData = async () => {
  createLoading.value = true
  selectedOpportunity.value = null;
  if (!newOpportunity.value.title || !newOpportunity.value.value || !newOpportunity.value.expectedCloseDate) {
    alert("Please fill in all required fields.");
    return;
  }
  try {
    // Create the new opportunity
    await createOpportunity(newOpportunity.value);
    
    // Reset newOpportunity form fields
    newOpportunity.value = { 
      title: '', 
      description: '', 
      stage: 'Prospect', 
      value: null, 
      expectedCloseDate: '', 
      priority: 'Medium', 
      createdBy: userId 
    };

    // Fetch the latest data after creation
    await fetchOpportunitiesData();  // Ensure this fetches the latest list of opportunities

  } catch (err) {
    error.value = true;
    createLoading.value = false
    console.error('Error creating opportunity:', err);
  } finally{
    createLoading.value = false
    showToast('Opportunities Created!')
  }
};

// Open the modal to edit an opportunity
const openModal = (opportunity) => {
  editOpportunity.value = { ...opportunity }; // Copy the opportunity data to the modal form
  showModal.value = true; // Show the modal
};

// Close the modal
const closeModal = () => {
  showModal.value = false; // Close the modal
};

// Submit the edited opportunity
const submitEditOpportunity = async () => {
  selectedOpportunity.value = null;
  loadingEdit.value = true
  try {
    checkAuthentication(); // Ensure authentication before API call
    await updateOpportunity(editOpportunity.value); // Update the opportunity using the service
    closeModal(); // Close the modal after successful update
    fetchOpportunitiesData(); // Refresh the opportunities list
  } catch (err) {
    console.error('Error updating opportunity:', err);
    loadingEdit.value = false
    alert('Failed to update opportunity. Please try again later.');
  } finally {
    loadingEdit.value = false
    showToast('Opportunity Ediited!')
  }
};

// Confirm and delete the selected opportunity
const confirmDelete = (opportunity) => {
  selectedOpportunity.value = opportunity;
  showDeleteModal.value = true;
};

// Cancel deletion
const cancelDelete = () => {
  selectedOpportunity.value = null;
  showDeleteModal.value = false;
};

// Delete the selected opportunity
const deleteOpportunityData = async () => {
  deleteLoading.value = true
  try {
    checkAuthentication(); // Ensure authentication before API call
    
    // Delete opportunity using the service
    await deleteOpportunity(selectedOpportunity.value._id); 
    
    // Close the modal and clear the selected opportunity
    showDeleteModal.value = false;
    selectedOpportunity.value = null;
    
    // Fetch the latest data after deletion
    await fetchOpportunitiesData(); // Fetch latest opportunities list to reflect the deletion

  } catch (err) {
    console.error('Error deleting opportunity:', err);
    deleteLoading.value = false
    alert('Failed to delete opportunity. Please try again later.');
  } finally {
    deleteLoading.value = false
    showToast('Opportunity Deleted')
  }
};

// Format date as MM/DD/YYYY
const formatDate = (date) => {
  const parsedDate = new Date(date);
  return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;
};

// Format value as currency
const formatCurrency = (value) => {
  if (value !== null && value !== undefined) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  return value;
};

// Fetch opportunities when the component is mounted
onMounted(() => {
  userStore.loadUser(); // Ensure user data is loaded
    fetchOpportunitiesData(); // Fetch opportunities
});
</script>
