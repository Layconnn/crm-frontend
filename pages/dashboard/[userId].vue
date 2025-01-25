<template>
  <div class="p-6 bg-gray-100 min-h-screen max-sm:px-2">
    <!-- Dashboard Overview Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <template v-if="loading">
        <!-- Skeleton Loaders -->
        <div
          class="animate-pulse bg-gradient-to-r from-gray-300 to-gray-200 p-6 rounded-xl shadow-lg"
          v-for="n in 4"
          :key="n"
        >
          <div class="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
          <div class="h-10 bg-gray-400 rounded w-1/4"></div>
        </div>
      </template>
      <template v-else>
        <!-- Data Boxes -->
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <h2 class="text-lg font-semibold text-white">Total Tasks</h2>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData?.taskCount }}
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <h2 class="text-lg font-semibold text-white">Completed Tasks</h2>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData?.completedTaskCount }}
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <h2 class="text-lg font-semibold text-white">Total Contacts</h2>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData?.contactCount }}
          </p>
        </div>
        <div
          class="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <h2 class="text-lg font-semibold text-white">High Priority Tasks</h2>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData?.highPriorityTaskCount }}
          </p>
        </div>
      </template>
    </div>

    <!-- Task Summary by Status  -->
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Task Summary by Status
      </h3>
      <template v-if="loading && !taskSummaryByStatus">
        <!-- Skeleton Loaders -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
        </div>
      </template>
      <!-- No summary status found message -->
      <div
        v-if="!loading && taskSummaryByStatus.length === 0"
        class="text-gray-500 text-center my-6"
      >
        No Task Summary by status found
      </div>
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="status in taskSummaryByStatus"
            :key="status._id"
            class="bg-gradient-to-r from-blue-300 to-blue-500 p-4 rounded-lg shadow-md"
          >
            <p class="text-lg text-white">
              {{ status._id }}:
              <span class="font-semibold">{{ status.count }} tasks</span>
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Task Summary by Priority  -->
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Task Summary by Priority
      </h3>
      <template v-if="loading && !taskSummaryByPriority">
        <!-- Skeleton Loaders -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
          <div class="animate-pulse h-10 bg-gray-400 rounded"></div>
        </div>
      </template>
      <div
        v-if="!loading && taskSummaryByPriority.length === 0"
        class="text-gray-500 text-center my-6"
      >
        No Task Summary by Priority found
      </div>
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="priority in taskSummaryByPriority"
            :key="priority._id"
            class="bg-gradient-to-r from-purple-300 to-purple-500 p-4 rounded-lg shadow-md"
          >
            <p class="text-lg text-white">
              {{ priority._id }}:
              <span class="font-semibold">{{ priority.count }} tasks</span>
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Recent Activities -->

    <div v-if="recentActivities" class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <!-- <template v-if="loading"> -->
      <!-- Skeleton Loaders -->

      <!-- <div class="animate-pulse h-4 bg-gray-400 rounded w-1/6 mb-4"></div>
        <div class="animate-pulse h-10 bg-gray-400 rounded w-1/4"></div>
      </template> -->
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Recent Activities
      </h3>

      <!-- Tasks Table -->
<div class="mb-8">
  <h4 class="text-lg font-bold text-gray-800 mb-2">Tasks</h4>
  <!-- Table Wrapper with Horizontal Scroll -->
  <div class="overflow-x-auto scrollbar-hide">
    <div class="min-w-[850px]">
      <!-- Table Header -->
      <div class="grid grid-cols-5 gap-4 font-medium bg-gray-200 p-4 rounded">
        <div>Title</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Updated At</div>
        <div class="justify-self-end">Actions</div>
      </div>

      <!-- Loading Placeholder -->
      <template v-if="loading">
        <div
          class="grid grid-cols-5 gap-4 font-medium bg-gray-200 p-4 rounded mb-4 animate-pulse"
        >
          <div class="h-4 bg-gray-400 rounded w-3/4"></div>
          <div class="h-4 bg-gray-400 rounded w-3/4"></div>
          <div class="h-4 bg-gray-400 rounded w-3/4"></div>
          <div class="h-4 bg-gray-400 rounded w-3/4"></div>
          <div class="h-4 bg-gray-400 rounded w-3/4 justify-self-end"></div>
        </div>
      </template>

      <!-- No tasks found message -->
      <div
        v-if="
          !loading &&
          !recentActivities.data.some((activity) => activity.type === 'task')
        "
        class="text-gray-500 text-center my-6"
      >
        No tasks found
      </div>

      <!-- Table Content -->
      <div
        v-if="
          recentActivities.data.some((activity) => activity.type === 'task')
        "
      >
        <template v-if="!loading && recentActivities.data.length > 0">
          <div
            v-for="activity in recentActivities.data.filter(
              (activity) => activity.type === 'task'
            )"
            :key="activity._id"
            class="grid grid-cols-5 gap-4 items-center border-b p-4 hover:bg-gray-50"
          >
            <div>{{ activity.title }}</div>
            <div>{{ activity.status }}</div>
            <div>{{ activity.priority }}</div>
            <div>{{ formatDate(activity.updatedAt) }}</div>
            <div class="justify-self-end">
              <!-- Example placeholder for actions -->
              <button
                @click="viewTask(activity._id)"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>


      <!-- Contacts Table -->
      <div>
  <h4 class="text-lg font-bold text-gray-800 mb-2">Contacts</h4>

  <!-- Scrollable Container -->
  <div class="overflow-x-auto scrollbar-hide">
    <!-- Table Header -->
    <div class="grid grid-cols-4 min-w-[850px] gap-4 font-medium bg-gray-200 p-4 rounded">
      <div>First Name</div>
      <div>Last Name</div>
      <div>Email</div>
      <div class="justify-self-end">Actions</div>
    </div>

    <!-- Loading State -->
    <template v-if="loading">
      <div
        class="grid grid-cols-4 min-w-[850px] gap-4 font-medium bg-gray-200 p-4 rounded mb-4 animate-pulse"
      >
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-3/4"></div>
        <div class="h-4 bg-gray-400 rounded w-3/4 justify-self-end"></div>
      </div>
    </template>

    <!-- No Contacts Found -->
    <div>
      <div
        v-if="
          !loading &&
          !recentActivities.data.some(
            (activity) => activity.type === 'contact'
          )
        "
        class="text-gray-500 text-center my-6"
      >
        No contacts found
      </div>
    </div>

    <!-- Contacts Table -->
    <div
      v-if="
        recentActivities.data.some(
          (activity) => activity.type === 'contact'
        )
      "
    >
      <template v-if="!loading && recentActivities.data.length > 0">
        <div
          v-for="activity in recentActivities.data.filter(
            (activity) => activity.type === 'contact'
          )"
          :key="activity._id"
          class="grid grid-cols-4 min-w-[850px] gap-4 items-center border-b p-4 hover:bg-gray-50"
        >
          <div>{{ activity.firstName }}</div>
          <div>{{ activity.lastName }}</div>
          <div
            class="truncate overflow-hidden whitespace-nowrap text-ellipsis"
            :title="activity.email"
          >
            {{ activity.email }}
          </div>
          <button
            @click="viewContact(activity._id)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 max-w-[4rem] justify-self-end"
          >
            View
          </button>
        </div>
      </template>
    </div>
  </div>
</div>

    </div>

    <!-- Modal for viewing task or contact -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-[28rem] relative max-sm:w-[350px]">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Header -->
        <h2
          class="text-2xl font-bold mb-6 border-b pb-2"
          :class="{
            'text-blue-600': selectedActivity.type === 'task',
            'text-green-600': selectedActivity.type === 'contact',
          }"
        >
          {{
            selectedActivity.type === "task"
              ? "Task Details"
              : "Contact Details"
          }}
        </h2>

        <!-- Content -->
        <div class="space-y-4">
          <div v-if="selectedActivity.type === 'task'">
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Title:</span>
              <span class="text-gray-800 font-semibold">
                {{ selectedActivity.title }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Status:</span>
              <span
                class="p-2 rounded-[0.5rem] text-white text-sm"
                :class="{
                  'bg-green-500': selectedActivity.status === 'Completed',
                  'bg-yellow-500': selectedActivity.status === 'Pending',
                  'bg-red-500': selectedActivity.status === 'Overdue',
                }"
              >
                {{ selectedActivity.status }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Priority:</span>
              <span
                class="p-2 rounded-[0.5rem] text-white text-sm"
                :class="{
                  'bg-red-600': selectedActivity.priority === 'High',
                  'bg-yellow-600': selectedActivity.priority === 'Medium',
                  'bg-green-600': selectedActivity.priority === 'Low',
                }"
              >
                {{ selectedActivity.priority }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Updated At:</span>
              <span class="text-gray-600">{{
                formatDate(selectedActivity.updatedAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Due Date:</span>
              <span class="text-red-600">{{
                formatDate(selectedActivity.dueDate)
              }}</span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Description:</span>
              <span class="text-gray-600 max-w-[15rem] text-right">{{
                selectedActivity.description
              }}</span>
            </div>
          </div>

          <div v-if="selectedActivity.type === 'contact'">
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">First Name:</span>
              <span class="text-gray-800 font-semibold">
                {{ selectedActivity.firstName }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Last Name:</span>
              <span class="text-gray-800 font-semibold">
                {{ selectedActivity.lastName }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Email:</span>
              <span class="text-gray-600 truncate">{{
                selectedActivity.email
              }}</span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Phone:</span>
              <span class="text-gray-600">{{ selectedActivity.phone }}</span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Company:</span>
              <span class="text-gray-600">{{ selectedActivity.company }}</span>
            </div>
            <div class="flex items-center justify-between mb-8">
              <span class="font-medium text-gray-700">Notes:</span>
              <span class="text-gray-600 max-w-[15rem] text-right">{{
                selectedActivity.notes
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines -->
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Deadlines
      </h3>

      <!-- Grid for Upcoming Deadlines -->
      <div class="grid grid-cols-2 gap-4 font-medium bg-gray-200 p-4 rounded">
        <!-- Column Headers -->
        <div>Task Title</div>
        <div>Due Date</div>
      </div>

      <template v-if="loading">
        <div
          class="grid grid-cols-2 gap-4 font-medium bg-gray-200 p-4 rounded mb-4 animate-pulse"
        >
          <div class="h-4 bg-gray-400 rounded w-1/2"></div>
          <div class="h-4 bg-gray-400 rounded w-1/2"></div>
        </div>
      </template>

      <!-- No Deadlines found message -->
      <div
        v-if="!loading && upcomingDeadlines.length === 0"
        class="text-gray-500 text-center my-6"
      >
        No Deadlines found
      </div>

      <template v-if="!loading && upcomingDeadlines.data.length > 0">
        <!-- Loop through tasks and display them in the grid -->
        <div
          v-for="task in upcomingDeadlines.data"
          :key="task._id"
          class="grid grid-cols-2 gap-4 items-center border-b p-4 hover:bg-gray-50"
        >
          <div>{{ task.title }}</div>
          <!-- Task title under Task Title column -->
          <div class="text-red-600">{{ formatDate(task.dueDate) }}</div>
          <!-- Due date under Due Date column -->
        </div>
      </template>
    </div>

    <!-- Contact Summary -->
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Contact Summary</h3>

      <!-- Grid for Contact Summary -->
      <div class="grid grid-cols-2 gap-4 font-medium bg-gray-200 p-4 rounded">
        <!-- Column Headers -->
        <div>Company</div>
        <div>No. of Contacts</div>
      </div>

      <!-- Skeleton Loaders -->
      <template v-if="loading">
        <div
          class="grid grid-cols-2 gap-4 font-medium bg-gray-200 p-4 rounded mb-4 animate-pulse"
        >
          <div class="h-4 bg-gray-400 rounded w-1/2"></div>
          <div class="h-4 bg-gray-400 rounded w-1/2"></div>
        </div>
      </template>

      <!-- No Contact found message -->
      <template
        v-if="!loading && (!contactSummary || contactSummary.length === 0)"
      >
        <div class="text-gray-500 text-center my-6">No Contact found</div>
      </template>

      <template v-if="!loading && contactSummary && contactSummary.length > 0">
        <!-- Loop through contact summary data and display in grid -->
        <div
          v-for="contacts in contactSummary"
          :key="contacts.company"
          class="grid grid-cols-2 gap-4 items-center border-b p-4 hover:bg-gray-50"
        >
          <div>{{ contacts.company }}</div>
          <!-- Company name -->
          <div>{{ contacts.count }}</div>
          <!-- Number of contacts -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"; // For redirection
import { useUserStore } from "~/store/userStore"; // Import the user store
import {
  fetchDashboardData,
  fetchTaskSummaryByStatus,
  fetchTaskSummaryByPriority,
  fetchRecentActivities,
  fetchUpcomingDeadlines,
  fetchContactSummary,
} from "@/services/dashboardService";
import { useRoute } from "vue-router"; // Import useRoute to access route params
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

console.log("User ID:", userId); // Log the userId to verify
const router = useRouter(); // For redirection

const userStore = useUserStore(); // Access user store

const dashboardData = ref(null);
const taskSummaryByStatus = ref(null);
const taskSummaryByPriority = ref(null);
const upcomingDeadlines = ref(null);
const contactSummary = ref([]);
const recentActivities = ref({ data: [] }); // Initialize as an empty array to avoid undefined errors
const showModal = ref(false);
const selectedActivity = ref(null);
const loading = ref(true);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

const handleError = (error) => {
  console.error("Error:", error.message);
  alert(
    "Failed to fetch data. Please check your connection or try again later."
  );
};

const viewTask = async (taskId) => {
  try {
    // Fetch and update recentActivities
    recentActivities.value = await fetchRecentActivities();

    // Check if recentActivities.data is defined and is an array
    // if (
    //   !recentActivities.value?.data ||
    //   !Array.isArray(recentActivities.value.data)
    // ) {
    //   console.error("recentActivities.data is undefined or not an array");
    //   return;
    // }

    // Find the task using .find() instead of .some()
    const task = recentActivities.value.data.find(
      (activity) => activity._id === taskId
    );

    if (task) {
      selectedActivity.value = task; // Ensure selectedActivity is a ref
      showModal.value = true; // Ensure showModal is a ref
      console.log("selectedActivity:", selectedActivity);
      console.log("showModal:", showModal);
    } else {
      console.error("Task not found");
    }
  } catch (error) {
    console.error("Error in viewTask:", error);
  }
};

const closeModal = () => {
  showModal.value = false; // Close the modal
};

const viewContact = async (contactId) => {
  try {
    // Fetch and update recentActivities (replace with your actual method for fetching contacts)
    recentActivities.value = await fetchRecentActivities();

    // Check if recentActivities.data is defined and is an array
    // if (
    //   !recentActivities.value?.data ||
    //   !Array.isArray(recentActivities.value.data)
    // ) {
    //   console.error("recentActivities.data is undefined or not an array");
    //   return;
    // }

    // Find the contact
    const contact = recentActivities.value.data.find(
      (contact) => contact._id === contactId
    );

    if (contact) {
      selectedActivity.value = contact; // Ensure selectedContact is a ref
      showModal.value = true; // Ensure showModal is a ref
    } else {
      console.error("Contact not found");
    }
  } catch (error) {
    console.error("Error in viewContact:", error);
  }
};

// Fetch dashboard data and related information
const fetchData = async () => {
  try {
    loading.value = true;
    dashboardData.value = await fetchDashboardData();
    taskSummaryByStatus.value = await fetchTaskSummaryByStatus();
    taskSummaryByPriority.value = await fetchTaskSummaryByPriority();
    recentActivities.value = await fetchRecentActivities();
    upcomingDeadlines.value = await fetchUpcomingDeadlines();
    contactSummary.value = await fetchContactSummary(); // Correctly assign the fetched data
  } catch (error) {
    handleError(error); // Display a user-friendly error message
    showToast(error);
  } finally {
    loading.value = false; // Ensure loading state is always reset
    showToast('Data Fetched!')
  }
};

// Check authentication when component is mounted
onMounted(() => {
  showToast('Logged in successfully!')
  try {
    userStore.loadUser();
    if (!userStore.token) {
      console.warn("No token found, redirecting to login...");
      router.push("/login");
    } else {
      console.log("User authenticated, fetching data...");
      fetchData();
    }
  } catch (error) {
    console.error("Error during authentication check:", error);
    router.push("/login");
  }
});

</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* WebKit */
}
</style>
