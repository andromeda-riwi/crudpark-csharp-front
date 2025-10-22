<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h2">Dashboard en Tiempo Real</h1>
      <button class="btn btn-sm btn-outline-primary" @click="fetchData" :disabled="isLoading">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </div>
    <div v-if="isLoading" class="alert alert-info">Cargando datos del dashboard...</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <!-- Tarjetas de Métricas Principales -->
    <div class="row" v-if="!isLoading && metrics">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100 border-start border-primary border-4">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col me-2"><div class="text-xs fw-bold text-primary text-uppercase mb-1">Vehículos Dentro</div><div class="h5 mb-0 fw-bold text-gray-800">{{ metrics.vehiculosDentro }}</div></div>
              <div class="col-auto"><i class="bi bi-car-front-fill fs-2 text-gray-300"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100 border-start border-success border-4">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col me-2"><div class="text-xs fw-bold text-success text-uppercase mb-1">Ingresos del Día</div><div class="h5 mb-0 fw-bold text-gray-800">{{ formatCurrency(metrics.ingresosHoy) }}</div></div>
              <div class="col-auto"><i class="bi bi-cash-coin fs-2 text-gray-300"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100 border-start border-info border-4">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col me-2"><div class="text-xs fw-bold text-info text-uppercase mb-1">Mensualidades Activas</div><div class="h5 mb-0 fw-bold text-gray-800">{{ metrics.mensualidadesActivas }}</div></div>
              <div class="col-auto"><i class="bi bi-card-checklist fs-2 text-gray-300"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card h-100 border-start border-warning border-4">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col me-2"><div class="text-xs fw-bold text-warning text-uppercase mb-1">Próximas a Vencer (7 días)</div><div class="h5 mb-0 fw-bold text-gray-800">{{ metrics.mensualidadesProximasAVencer }}</div></div>
              <div class="col-auto"><i class="bi bi-alarm-fill fs-2 text-gray-300"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficas y Tarifas -->
    <div class="row" v-if="!isLoading">
      <!-- Gráfica de Ingresos -->
      <div class="col-lg-12">
        <div class="card mb-4">
          <div class="card-header fw-bold">Ingresos Últimos 7 Días</div>
          <div class="card-body">
            <Bar :data="chartData" :options="chartOptions" style="height: 300px"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import apiClient from '@/services/apiClient';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Estado Reactivo
const metrics = ref(null);
const weeklyIncome = reactive({ labels: [], data: [] });
const isLoading = ref(true);
const errorMessage = ref('');

// --- DATOS PARA LA GRÁFICA ---
const chartData = computed(() => ({
  labels: weeklyIncome.labels,
  datasets: [
    {
      label: 'Ingresos',
      backgroundColor: '#0d6efd',
      borderColor: '#0a58ca',
      borderWidth: 1,
      data: weeklyIncome.data
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// --- FIN DATOS GRÁFICA ---

// Funciones de utilidad
const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value || 0);

// Carga de datos
const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [metricsRes, weeklyIncomeRes] = await Promise.all([
      apiClient.get('/api/Dashboard/metrics'),
      apiClient.get('/api/Dashboard/ingresos-semanales')
    ]);

    metrics.value = metricsRes.data;
    weeklyIncome.labels = weeklyIncomeRes.data.labels;
    weeklyIncome.data = weeklyIncomeRes.data.data;

  } catch (error) {
    errorMessage.value = 'No se pudieron cargar los datos del dashboard. Verifique que el backend esté corriendo y los endpoints del dashboard estén implementados.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.text-xs { font-size: .8rem; }
.text-gray-300 { color: #dddfeb !important; }
.text-gray-800 { color: #5a5c69 !important; }
</style>