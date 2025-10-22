<template>
  <div>
    <h1 class="mb-4">Gestión de Tarifas</h1>
    <div v-if="isLoading" class="alert alert-info">Cargando tarifas...</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger" v-html="errorMessage"></div>

    <div class="card">
      <div class="card-header fw-bold">Precios por Tipo de Vehículo</div>
      <div class="card-body">
        <p class="text-muted">Modifica los valores de cobro para cada tipo de vehículo. Los cambios se aplicarán inmediatamente.</p>
        <table class="table table-hover align-middle">
          <thead>
          <tr>
            <th>Tipo de Vehículo</th>
            <th>Valor/Hora</th>
            <th>Valor/Fracción</th>
            <th>Tope Diario</th>
            <th>Gracia (min)</th>
            <th class="text-end">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="rate in rateCatalog" :key="rate.id">
            <td><strong>{{ rate.nombre }}</strong></td>
            <td>{{ rate.valorHora }}</td>
            <td>{{ rate.valorFraccion }}</td>
            <td>{{ rate.topeDiario }}</td>
            <td>{{ rate.tiempoGraciaMinutos }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-primary" @click="showEditModal(rate)">
                <i class="bi bi-pencil-fill"></i> Editar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Editar Tarifa -->
    <div class="modal fade" id="rateModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Tarifa: {{ currentRate.nombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRate">
              <div class="row">
                <div class="col-md-6 mb-3"><label>Valor por Hora</label><input type="number" step="100" v-model.number="currentRate.valorHora" class="form-control" required></div>
                <div class="col-md-6 mb-3"><label>Valor por Fracción</label><input type="number" step="50" v-model.number="currentRate.valorFraccion" class="form-control"></div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3"><label>Tope Diario</label><input type="number" step="1000" v-model.number="currentRate.topeDiario" class="form-control"></div>
                <div class="col-md-6 mb-3"><label>Tiempo de Gracia (min)</label><input type="number" v-model.number="currentRate.tiempoGraciaMinutos" class="form-control" required></div>
              </div>
            </form>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button type="button" class="btn btn-primary" @click="saveRate">Guardar Cambios</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiClient';
import { Modal } from 'bootstrap';

const rateCatalog = ref([]);
const currentRate = ref({});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
let modalInstance = null;
const apiBaseUrl = '/api/configuracion/tarifas/catalogo'; // Apuntamos directamente al catálogo

const fetchData = async () => {
  isLoading.value = true; successMessage.value = ''; errorMessage.value = '';
  try {
    const response = await apiClient.get(apiBaseUrl);
    rateCatalog.value = response.data;
  } catch (e) {
    errorMessage.value = 'Error al cargar los datos de tarifas.';
  } finally {
    isLoading.value = false;
  }
};

const showEditModal = (rate) => {
  currentRate.value = { ...rate };
  modalInstance.show();
};

const saveRate = async () => {
  errorMessage.value = ''; successMessage.value = '';
  const url = `${apiBaseUrl}/${currentRate.value.id}`;
  try {
    await apiClient.put(url, currentRate.value);
    successMessage.value = `Tarifa '${currentRate.value.nombre}' actualizada con éxito.`;
    modalInstance.hide();
    await fetchData();
  } catch (e) {
    errorMessage.value = 'Error al guardar los cambios en la tarifa.';
  }
};

onMounted(() => {
  fetchData();
  modalInstance = new Modal(document.getElementById('rateModal'));
});
</script>