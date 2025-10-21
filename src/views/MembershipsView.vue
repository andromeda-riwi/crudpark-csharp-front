<template>
  <div>
    <h1 class="mb-4">Gestión de Mensualidades</h1>
    <div v-if="isLoading" class="alert alert-info">Cargando...</div>
    <div v-if="errorMessage" class="alert alert-danger" v-html="errorMessage"></div>
    <div class="mb-3">
      <button class="btn btn-primary" @click="showCreateModal"><i class="bi bi-plus-circle"></i> Registrar Mensualidad</button>
    </div>
    <div class="card">
      <div class="card-body">
        <table class="table table-hover">
          <thead><tr><th>Cliente</th><th>Placa</th><th>Email</th><th>Inicio</th><th>Fin</th><th>Activo</th><th class="text-end">Acciones</th></tr></thead>
          <tbody>
          <tr v-for="mem in memberships" :key="mem.id">
            <td>{{ mem.nombreCliente }}</td><td>{{ mem.placaVehiculo }}</td><td>{{ mem.correoCliente }}</td>
            <td>{{ formatDate(mem.fechaInicio) }}</td><td>{{ formatDate(mem.fechaFin) }}</td>
            <td><span :class="mem.activo ? 'badge bg-success' : 'badge bg-secondary'">{{ mem.activo ? 'Sí' : 'No' }}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-secondary me-2" @click="showEditModal(mem)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteMembership(mem.id)">Eliminar</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal fade" id="membershipModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">{{ isEditing ? 'Editar Mensualidad' : 'Crear Mensualidad' }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <form @submit.prevent="saveMembership">
              <div class="mb-3"><label>Nombre Cliente</label><input v-model="currentMembership.nombreCliente" class="form-control" required></div>
              <div class="mb-3"><label>Placa Vehículo</label><input v-model="currentMembership.placaVehiculo" class="form-control" required></div>
              <div class="mb-3"><label>Email</label><input type="email" v-model="currentMembership.correoCliente" class="form-control"></div>
              <div class="row">
                <div class="col-md-6 mb-3"><label>Fecha Inicio</label><input type="date" v-model="currentMembership.fechaInicio" class="form-control" required></div>
                <div class="col-md-6 mb-3"><label>Fecha Fin</label><input type="date" v-model="currentMembership.fechaFin" class="form-control" required></div>
              </div>
              <div class="form-check mb-3"><input type="checkbox" v-model="currentMembership.activo" class="form-check-input"><label class="form-check-label">Activa</label></div>
            </form>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button type="button" class="btn btn-primary" @click="saveMembership">Guardar</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiClient';
import { Modal } from 'bootstrap';

const memberships = ref([]);
const currentMembership = ref({});
const isEditing = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
let modalInstance = null;

const formatDate = (dateString) => {
  if (!dateString) return '';
  // La API envía una fecha como '2025-10-20T00:00:00'.
  // Tomamos solo la parte de la fecha '2025-10-20'.
  const [year, month, day] = dateString.split('T')[0].split('-');
  // La devolvemos en el formato correcto sin conversiones de zona horaria.
  return `${day}/${month}/${year}`;
};

// Función para formatear la fecha para el <input type="date"> (formato AAAA-MM-DD)
const toInputDate = (dateString) => {
  if (!dateString) return '';
  // El input type="date" necesita 'AAAA-MM-DD'.
  // Simplemente tomamos esa parte del string que viene de la API.
  return dateString.split('T')[0];
}

const fetchMemberships = async () => {
  isLoading.value = true; errorMessage.value = '';
  try {
    const response = await apiClient.get('/Mensualidades');
    memberships.value = response.data;
  } catch (error) { errorMessage.value = 'Error al cargar las mensualidades.'; }
  finally { isLoading.value = false; }
};

const showCreateModal = () => {
  isEditing.value = false;
  currentMembership.value = {
    nombreCliente: '', placaVehiculo: '', correoCliente: '',
    fechaInicio: toInputDate(new Date()), fechaFin: '', activo: true
  };
  modalInstance.show();
};

const showEditModal = (mem) => {
  isEditing.value = true;
  currentMembership.value = {
    ...mem,
    fechaInicio: toInputDate(mem.fechaInicio),
    fechaFin: toInputDate(mem.fechaFin)
  };
  modalInstance.show();
};

const saveMembership = async () => {
  errorMessage.value = '';
  const url = isEditing.value ? `/Mensualidades/${currentMembership.value.id}` : '/Mensualidades';
  const method = isEditing.value ? 'put' : 'post';
  try {
    await apiClient[method](url, currentMembership.value);
    await fetchMemberships();
    modalInstance.hide();
  } catch (error) { handleApiError(error); }
};

const deleteMembership = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta mensualidad?')) return;
  try {
    await apiClient.delete(`/Mensualidades/${id}`);
    await fetchMemberships();
  } catch (error) { errorMessage.value = 'Error al eliminar la mensualidad.'; }
};

const handleApiError = (error) => {
  if (error.response?.status === 400 && error.response.data?.errors) {
    const messages = Object.values(error.response.data.errors).flat();
    errorMessage.value = 'Por favor, corrija los siguientes errores:<br/>- ' + messages.join('<br/>- ');
  } else {
    errorMessage.value = 'Error al guardar. Verifique los datos e intente de nuevo.';
  }
};

onMounted(() => {
  fetchMemberships();
  modalInstance = new Modal(document.getElementById('membershipModal'));
});
</script>