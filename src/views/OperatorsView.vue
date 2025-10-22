<template>
  <div>
    <h1 class="mb-4">Gestión de Operadores</h1>
    <div v-if="isLoading" class="alert alert-info">Cargando...</div>
    <div v-if="errorMessage" class="alert alert-danger" v-html="errorMessage"></div>
    <div class="mb-3">
      <button class="btn btn-primary" @click="showCreateModal"><i class="bi bi-plus-circle"></i> Crear Nuevo Operador</button>
    </div>
    <div class="card">
      <div class="card-body">
        <table class="table table-hover">
          <thead><tr><th>Nombre</th><th>Email</th><th>Estado Activo</th><th class="text-end">Acciones</th></tr></thead>
          <tbody>
          <tr v-for="op in operators" :key="op.id">
            <td>{{ op.nombre }}</td><td>{{ op.email }}</td>
            <td><span :class="op.activo ? 'badge bg-success' : 'badge bg-secondary'">{{ op.activo ? 'Activo' : 'Inactivo' }}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-secondary me-2" @click="showEditModal(op)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteOperator(op.id)">Eliminar</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear/Editar -->
    <div class="modal fade" id="operatorModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">{{ isEditing ? 'Editar Operador' : 'Crear Operador' }}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <form @submit.prevent="saveOperator">
              <div class="mb-3"><label>Nombre del Operador</label><input type="text" v-model="currentOperator.nombre" class="form-control" required></div>
              <div class="mb-3"><label>Email</label><input type="email" v-model="currentOperator.email" class="form-control" required></div>
              <div class="mb-3">
                <label>{{ isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña' }}</label>
                <input type="password" v-model="currentOperator.password" class="form-control" :required="!isEditing" placeholder="Dejar en blanco para no cambiar">
              </div>
              <div class="form-check mb-3"><input type="checkbox" v-model="currentOperator.activo" class="form-check-input"><label class="form-check-label">Está Activo</label></div>
            </form>
          </div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button type="button" class="btn btn-primary" @click="saveOperator">Guardar</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiClient';
import { Modal } from 'bootstrap';

const operators = ref([]);
const currentOperator = ref({});
const isEditing = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
let modalInstance = null;

const fetchOperators = async () => {
  isLoading.value = true; errorMessage.value = '';
  try {
    const response = await apiClient.get('/api/Operadores');
    operators.value = response.data;
  } catch (error) { errorMessage.value = 'Error al cargar operadores.'; }
  finally { isLoading.value = false; }
};

const showCreateModal = () => {
  isEditing.value = false;
  currentOperator.value = { nombre: '', email: '', password: '', activo: true };
  modalInstance.show();
};

const showEditModal = (op) => {
  isEditing.value = true;
  currentOperator.value = { ...op, password: '' };
  modalInstance.show();
};

const saveOperator = async () => {
  errorMessage.value = '';
  const url = isEditing.value ? `/api/Operadores/${currentOperator.value.id}` : '/api/Operadores';
  const method = isEditing.value ? 'put' : 'post';

  const requestBody = { ...currentOperator.value };
  if (!requestBody.password) delete requestBody.password;

  try {
    await apiClient[method](url, requestBody);
    await fetchOperators();
    modalInstance.hide();
  } catch (error) {
    handleApiError(error);
  }
};

const deleteOperator = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este operador?')) return;
  try {
    await apiClient.delete(`/api/Operadores/${id}`);
    await fetchOperators();
  } catch (error) {
    errorMessage.value = 'Error al eliminar el operador.';
  }
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
  fetchOperators();
  modalInstance = new Modal(document.getElementById('operatorModal'));
});
</script>