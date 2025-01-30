<template>
  <div class="p-6 max-sm:p-2">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Tasks</h1>

    <div>
      <h1 class="text-2xl font-bold mb-4">Task List</h1>

      <!-- Scrollable Container -->
      <div class="overflow-x-auto scrollbar-hide mb-20 max-sm:mb-4">
        <!-- Task Table Header -->
        <div
          class="grid grid-cols-6 min-w-[850px] gap-4 font-medium bg-gray-200 p-4 rounded"
        >
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Due Date</div>
          <div class="justify-self-end">Actions</div>
        </div>

        <!-- Task List -->
        <div>
          <!-- Skeleton Loader -->
          <template v-if="loading">
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

          <!-- No tasks found message -->
          <div
            v-else-if="tasks.length === 0"
            class="text-gray-500 text-center my-6"
          >
            No tasks found
          </div>

          <!-- Task Data -->
          <template v-else>
            <div
              v-for="task in tasks"
              :key="task._id"
              class="grid grid-cols-6 min-w-[850px] gap-4 items-center border-b p-4 hover:bg-gray-50"
            >
              <div>{{ task.title }}</div>
              <div
                class="truncate overflow-hidden whitespace-nowrap text-ellipsis"
                :title="task.description"
              >
                {{ task.description }}
              </div>
              <div>{{ task.status }}</div>
              <div>{{ task.priority }}</div>
              <div
                class="truncate overflow-hidden whitespace-nowrap text-ellipsis"
                :title="task.dueDate"
              >
                {{ formatDate(task.dueDate) }}
              </div>
              <div class="justify-self-end relative">
                <button
                  @click="showActions(task._id)"
                  class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Actions
                </button>
                <div
                  v-if="task._id === activeTaskId"
                  ref="actionModal"
                  class="absolute bg-white shadow-lg rounded mt-2 p-2 border z-10"
                >
                  <button
                    @click="openEditModal(task)"
                    class="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 w-full mb-2"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTaskData(task._id)"
                    class="px-2 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200 w-full"
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
                  v-if="activeTaskId"
                  @click="closeActions"
                  class="fixed inset-0 bg-transparent"
                ></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Create Task Form -->
    <div class="bg-white p-8 rounded-lg shadow-lg mb-6 max-w-[37.5rem]">
      <h2 class="text-2xl font-semibold text-blue-600 mb-6">Create New Task</h2>
      <form @submit.prevent="createTaskData" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
          >
          <input
            type="text"
            id="title"
            v-model="newTaskData.title"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            :class="{ 'border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="mt-2 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            v-model="newTaskData.description"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg resize-none"
            :class="{ 'border-red-500': errors.description }"
            rows="4"
          ></textarea>
          <p v-if="errors.description" class="mt-2 text-sm text-red-600">
            {{ errors.description }}
          </p>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700"
            >Status</label
          >
          <select
            id="status"
            v-model="newTaskData.status"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            :class="{ 'border-red-500': errors.status }"
          >
            <option value=""></option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <p v-if="errors.status" class="mt-2 text-sm text-red-600">
            {{ errors.status }}
          </p>
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700"
            >Priority</label
          >
          <select
            id="priority"
            v-model="newTaskData.priority"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            :class="{ 'border-red-500': errors.priority }"
          >
            <option value=""></option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <p v-if="errors.priority" class="mt-2 text-sm text-red-600">
            {{ errors.priority }}
          </p>
        </div>

        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700"
            >Due Date</label
          >
          <input
            type="date"
            id="dueDate"
            v-model="newTaskData.dueDate"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            :class="{ 'border-red-500': errors.dueDate }"
          />
          <p v-if="errors.dueDate" class="mt-2 text-sm text-red-600">
            {{ errors.dueDate }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full mt-4 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-lg"
        >
          <template v-if="createLoading"
            ><div
              class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"
            ></div
          ></template>
          <template v-else>Create Task</template>
        </button>
      </form>
    </div>

   

    <!-- Edit Task Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <div class="bg-white rounded p-6 w-96 max-sm:w-[20rem]">
        <h2 class="text-lg font-bold mb-4">Edit Task</h2>
        <form @submit.prevent="submitEdit">
          <div class="mb-4">
            <label for="title" class="block font-medium mb-1">Title</label>
            <input
              v-model="editTaskData.title"
              type="text"
              id="title"
              class="w-full border rounded px-3 py-2 border-blue-200 outline-none"
              required
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block font-medium mb-1"
              >Description</label
            >
            <textarea
              v-model="editTaskData.description"
              id="description"
              class="w-full border rounded px-3 py-2 resize-none h-[10rem] border-blue-200 outline-none"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="status" class="block font-medium mb-1">Status</label>
            <select
              v-model="editTaskData.status"
              id="status"
              class="w-full border rounded px-3 py-2 border-blue-200 outline-none"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="priority" class="block font-medium mb-1"
              >Priority</label
            >
            <select
              v-model="editTaskData.priority"
              id="priority"
              class="w-full border rounded px-3 py-2 border-blue-200 outline-none"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="dueDate" class="block font-medium mb-1">Due Date</label>
            <input
              v-model="editTaskData.dueDate"
              type="date"
              id="dueDate"
              class="w-full border rounded px-3 py-2 border-blue-200 outline-none"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <template v-if="loadingEdit"
                ><div
                  class="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"
                ></div
              ></template>
              <template v-else>Save Changes</template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // For redirection
import { toRaw } from "vue"; // For debugging
import { useUserStore } from "~/store/userStore"; // Import user store
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/taskService"; // Import task service functions
import { useRoute } from "vue-router"; // Import useRoute to access route params
import Toastify from "toastify-js";

const showToast = (message, type = "success") => {
  Toastify({
    text: message,
    duration: 1000,
    close: true,
    gravity: "bottom",
    position: "right",
    backgroundColor: type === "success" ? "#4caf50" : "#f44336", // Green for success, red for error
  }).showToast();
};

const route = useRoute(); // Access the current route
const userId = route.params.userId; // Access the userId from the route
console.log("User ID:", userId); // Log the userId to verify

const router = useRouter(); // For redirection
const userStore = useUserStore(); // Access user store

const tasks = ref([]); // Task list
const loading = ref(true); // user Loading state
const deleteLoading = ref(false); // delete Loading state
const createLoading = ref(false); // create Loading state
const loadingEdit = ref(false); // edit Loading state
const showEditModal = ref(false); // Modal visibility
const activeTaskId = ref(null); // Active task actions menu
const newTaskData = ref({
  title: "",
  description: "",
  dueDate: "",
  priority: "Low",
  status: "Pending",
}); // Data for creating a new task
const editTaskData = ref({}); // Data for editing a task
const errors = ref({
  title: "",
  description: "",
  status: "",
  priority: "",
  dueDate: "",
});

// Handle errors
const handleError = (error) => {
  console.error("Error:", error.message);
  alert("An error occurred. Please try again later.");
};

// Check if the user is authenticated
const checkAuthentication = () => {
  const token = userStore.token;
  if (!token) {
    router.push("/login"); // Redirect to login if not authenticated
    return false;
  }
  fetchTasksData();
};

// Fetch all tasks
const fetchTasksData = async () => {
  try {
    tasks.value = await fetchTasks();

    console.log("Tasks Fetched (Raw):", toRaw(tasks.value)); // Log raw tasks
    tasks.value.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, {
        Title: task.title,
        Description: task.description,
        DueDate: formatDate(task.dueDate),
        Priority: task.priority,
        Status: task.status,
        CreatedAt: task.createdAt,
      });
    });
  } catch (error) {
    handleError(error);
    showToast("Unkwown Error.", "error");
  } finally {
    loading.value = false;
    showToast("Tasks Fetched!");
  }
};

// Converts dd/mm/yyyy to yyyy-mm-dd
const formatToISODate = (dateString) => {
  if (!dateString) return null;

  // Check if the input is already in ISO format (yyyy-mm-dd)
  const isoFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoFormatRegex.test(dateString)) {
    return dateString; // Return as is if already in ISO format
  }

  // Convert dd/mm/yyyy to yyyy-mm-dd if needed
  const [day, month, year] = dateString.split("/");
  if (day && month && year) {
    return `${year}-${month}-${day}`;
  }

  console.error("Invalid date format:", dateString);
  return null;
};

// Create a new task
const createTaskData = async () => {
  // Validate fields
  if (!newTaskData.value.title) {
    errors.value.title = "Title is required.";
  }
  if (!newTaskData.value.description) {
    errors.value.description = "Description is required.";
  }
  if (!newTaskData.value.status) {
    errors.value.status = "Status is required.";
  }
  if (!newTaskData.value.priority) {
    errors.value.priority = "Priority is required.";
  }
  if (!newTaskData.value.dueDate) {
    errors.value.dueDate = "Due date is required.";
  }

  if (
    !newTaskData.value.title ||
    !newTaskData.value.description ||
    !newTaskData.value.status ||
    !newTaskData.value.priority ||
    !newTaskData.value.dueDate
  ) {
    return;
  }

  try {
    createLoading.value = true;

    // Format the dueDate to ISO before sending
    const taskToSubmit = {
      ...newTaskData.value,
      dueDate: formatToISODate(newTaskData.value.dueDate),
    };

    // Debug logs
    console.log("Original Due Date:", newTaskData.value.dueDate);
    console.log("Formatted Due Date:", taskToSubmit.dueDate);
    console.log("Submitting Task:", taskToSubmit);

    const response = await createTask(taskToSubmit);
    console.log("Task Created Successfully:", response);

    // Refresh the tasks and reset the form
    await fetchTasksData();
    newTaskData.value = {
      title: "",
      description: "",
      status: "Pending",
      priority: "Low",
      dueDate: "",
    };
  } catch (error) {
    createLoading.value = false;
    console.error("Error creating task:", error);
    showToast("Failed to create task.", "error");
  } finally {
    createLoading.value = false;
    showToast("Task Created!");
  }
};

// Delete a task
const deleteTaskData = async (taskId) => {
  try {
    deleteLoading.value = true;
    await deleteTask(taskId);
    await fetchTasksData(); // Refresh tasks after deletion
    activeTaskId.value = null;
  } catch (error) {
    deleteLoading.value = false;
    handleError(error);
    showToast("Failed to delete!", "error");
  } finally {
    deleteLoading.value = false;
    showToast("Task Deleted!");
  }
};

// Open edit modal with task data
const openEditModal = (task) => {
  editTaskData.value = { ...task };
  showEditModal.value = true;
};

// Close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
};

// Close the actions menu (used for click-outside behavior)
const closeActions = () => {
  activeTaskId.value = null;
};

// Submit edited task
const submitEdit = async () => {
  loadingEdit.value = true;
  try {
    await updateTask(editTaskData.value._id, editTaskData.value);
    await fetchTasksData(); // Refresh tasks after update
    closeEditModal();
    activeTaskId.value = null;
  } catch (error) {
    loadingEdit.value = false;
    handleError(error);
    showToast("Failed to edit task!", "error");
  } finally {
    loadingEdit.value = false;
    showToast("Task Editted!");
  }
};

// Toggle actions menu visibility
const showActions = (taskId) => {
  activeTaskId.value = activeTaskId.value === taskId ? null : taskId;
};

// Format date (mm/dd/yyyy)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

// Fetch tasks when component is mounted
onMounted(() => {
  userStore.loadUser(); // Ensure user data is loaded
  if (checkAuthentication()) {
    fetchTasksData();
  }
});
</script>
