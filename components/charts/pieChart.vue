<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    chartData: Object
  });
  
  const chartCanvas = ref(null);
  
  onMounted(() => {
    new Chart(chartCanvas.value, {
        type: 'doughnut',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
  </script>
  