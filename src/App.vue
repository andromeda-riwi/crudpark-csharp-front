<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-primary text-white vh-100" style="width: 250px;">
      <router-link to="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <i class="bi bi-p-square-fill fs-3 me-2"></i>
        <span class="fs-5 fw-semibold">CrudPark Admin</span>
      </router-link>

      <hr class="border-light opacity-50" />

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
              to="/"
              class="nav-link text-white"
              active-class="active-link"
          >
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </router-link>
        </li>
        <li>
          <router-link
              to="/operators"
              class="nav-link text-white"
              active-class="active-link"
          >
            <i class="bi bi-people-fill me-2"></i> Operadores
          </router-link>
        </li>
        <li>
          <router-link
              to="/memberships"
              class="nav-link text-white"
              active-class="active-link"
          >
            <i class="bi bi-card-checklist me-2"></i> Mensualidades
          </router-link>
        </li>
        <li>
          <router-link
              to="/rates"
              class="nav-link text-white"
              active-class="active-link"
          >
            <i class="bi bi-tags-fill me-2"></i> Tarifas
          </router-link>
        </li>
      </ul>

      <hr class="border-light opacity-50" />
      <div class="text-center small opacity-75">
        <i class="bi bi-hospital me-1"></i> Salud Linux © 2025
      </div>
    </div>

    <!-- Main content -->
    <main class="flex-grow-1 p-4 bg-light">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// sin lógica, solo estructura
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Estado activo mejorado */
.active-link {
  background-color: rgba(255, 255, 255, 0.25) !important;
  font-weight: 600;
  color: #fff !important;
  border-radius: 0.5rem;
}

/* Hover */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

/* Mantener tamaño y apariencia uniforme */
.nav-link {
  transition: background-color 0.2s ease, color 0.2s ease;
  padding: 0.6rem 1rem;
}
</style>
