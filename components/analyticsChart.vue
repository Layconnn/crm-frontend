<script setup>
import { defineProps } from "vue";
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "vue-chart-3";

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale);

const props = defineProps(["chartData", "chartOptions"]);
</script>

<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
</template>