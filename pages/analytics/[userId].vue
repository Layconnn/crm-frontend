<template>
  <div class="p-8 bg-gray-50 min-h-screen max-sm:px-0">
    <h2 class="text-4xl font-semibold text-blue-600 mb-6 text-center">CRM Analytics</h2>
    <p class="mb-8 text-gray-600 text-center">Analyze your tasks, contacts, and sales performance with detailed visualizations.</p>

    <!-- Skeleton Loader for Loading State -->
    <div v-if="loading" class="space-y-8">
      <!-- Summary Section Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-gray-300 animate-pulse p-6 shadow-xl rounded-lg">
          <div class="h-4 bg-gray-400 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        </div>
        <div class="bg-gray-300 animate-pulse p-6 shadow-xl rounded-lg">
          <div class="h-4 bg-gray-400 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        </div>
        <div class="bg-gray-300 animate-pulse p-6 shadow-xl rounded-lg">
          <div class="h-4 bg-gray-400 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        </div>
      </div>

      <!-- Task Analytics Section Skeleton -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <div class="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
        <div class="h-64 bg-gray-300 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-400 rounded w-1/3 mt-4"></div>
      </div>

      <!-- Contact Analytics Section Skeleton -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <div class="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
        <div class="h-64 bg-gray-300 rounded animate-pulse"></div>
      </div>

      <!-- Sales Analytics Section Skeleton -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <div class="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
        <div class="h-64 bg-gray-300 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-400 rounded w-1/3 mt-4"></div>
      </div>
    </div>

    <!-- Data Loaded Section -->
    <div v-if="analyticsData" class="space-y-8">
      <!-- Summary Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-xl rounded-lg transform transition duration-300 hover:scale-105">
          <h4 class="font-semibold text-lg">Total Tasks</h4>
          <p class="text-3xl font-bold">{{ dashboardData?.taskCount }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 shadow-xl rounded-lg transform transition duration-300 hover:scale-105">
          <h4 class="font-semibold text-lg">Total Contacts</h4>
          <p class="text-3xl font-bold">{{ dashboardData?.contactCount }}</p>
        </div>
        <div class="bg-gradient-to-r from-yellow-400 to-red-500 text-white p-6 shadow-xl rounded-lg transform transition duration-300 hover:scale-105">
          <h4 class="font-semibold text-lg">Total Sales Value</h4>
          <p class="text-3xl font-bold">{{ formatCurrency(analyticsData.salesAnalytics.totalSalesValue) }}</p>
        </div>
      </div>

      <!-- Task Analytics Section -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <h3 class="text-xl font-semibold text-blue-600 mb-2">Task Analytics</h3>
        <p class="text-gray-600">Here’s the breakdown of tasks based on their status and priority.</p>
        <BarChart v-if="analyticsData.taskAnalytics" :chartData="taskChartData" />
        <p class="mt-4 text-lg">Task Completion Rate: <span class="font-bold text-blue-600">{{ analyticsData.taskAnalytics.taskCompletionRate.toFixed(1) }}%</span></p>
      </div>

      <!-- Contact Analytics Section -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <h3 class="text-xl font-semibold text-blue-600 mb-2">Contact Analytics</h3>
        <p class="text-gray-600">Here’s a breakdown of contacts across various companies.</p>
        <PieChart v-if="analyticsData.contactAnalytics" :chartData="contactChartData" />
      </div>

      <!-- Sales Analytics Section -->
      <div class="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <h3 class="text-xl font-semibold text-blue-600 mb-2">Sales Analytics</h3>
        <p class="text-gray-600">Explore your sales performance by stage and priority.</p>
        <BarChart v-if="analyticsData.salesAnalytics" :chartData="salesChartData" />
        <p class="mt-4 text-lg">Total Sales Value: <span class="font-bold text-blue-600">{{ formatCurrency(analyticsData.salesAnalytics.totalSalesValue) }}</span></p>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue';
import { fetchAnalyticsData } from '@/services/analyticsService';
import { fetchDashboardData } from '~/services/dashboardService';
import BarChart from '@/components/charts/barChart.vue';
import PieChart from '@/components/charts/pieChart.vue';

const analyticsData = ref(null);
const loading = ref(true);
const error = ref(null);
const dashboardData = ref(null);

const taskChartData = ref(null);
const contactChartData = ref(null);
const salesChartData = ref(null);

// Function to format numbers as currency with commas
const formatCurrency = (value) => {
  return new Intl.NumberFormat().format(value);
};

const loadAnalytics = async () => {
  try {
    dashboardData.value = await fetchDashboardData();
    const data = await fetchAnalyticsData();
    analyticsData.value = data;

    // Prepare data for charts
    taskChartData.value = {
      labels: data.taskAnalytics.tasksByStatus.map(item => item._id),
      datasets: [{
        label: 'Tasks by Status',
        data: data.taskAnalytics.tasksByStatus.map(item => item.count),
        backgroundColor:  [
          'rgba(255, 99, 132, 0.2)',  // Completed tasks color
          'rgba(255, 159, 64, 0.2)'   // Pending tasks color
        ],
        borderColor: [
          'rgb(255, 99, 132)',  // Completed tasks border color
          'rgb(255, 159, 64)'   // Pending tasks border color
        ],
        borderWidth: 1
      }]
    };

    contactChartData.value = {
      labels: data.contactAnalytics.data.map(item => item._id),
      datasets: [{
        label: 'Contacts per Company',
        data: data.contactAnalytics.data.map(item => item.contactCount),
        backgroundColor: generateColors(data.contactAnalytics.data.length)
      }]
    };

    salesChartData.value = {
      labels: data.salesAnalytics.salesByStage.map(item => item._id),
      datasets: [{
        label: 'Sales by Stage',
        data: data.salesAnalytics.salesByStage.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',  // Negotiation color
          'rgba(255, 159, 64, 0.2)',   // Qualified color
          'rgba(255, 205, 86, 0.2)',   // Closed Won color
          'rgba(75, 192, 192, 0.2)'    // Prospect color
        ],
        borderColor: [
          'rgb(255, 99, 132)',  // Negotiation border color
          'rgb(255, 159, 64)',   // Qualified border color
          'rgb(255, 205, 86)',   // Closed Won border color
          'rgb(75, 192, 192)'    // Prospect border color
        ],
        borderWidth: 1
      }]
    };

  } catch (err) {
    error.value = "Failed to load analytics data.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Function to generate a unique color for each company in the pie chart
const generateColors = (count) => {
  const colors = [];
  const colorPalette = [
  '#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#8E24AA', '#5C6BC0',
  '#FFEB3B', '#F44336', '#9C27B0', '#03A9F4', '#FF9800', '#00BCD4',
  '#8BC34A', '#CDDC39', '#673AB7', '#607D8B', '#D32F2F', '#C2185B',
  '#1976D2', '#0288D1'
];

  
  for (let i = 0; i < count; i++) {
    colors.push(colorPalette[i % colorPalette.length]);  // Loop through the color palette if there are more companies than colors
  }
  return colors;
};

onMounted(loadAnalytics);
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
