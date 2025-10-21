<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold">
          <i class="bi bi-p-square-fill text-primary"></i> CrudPark Admin
        </router-link>
        <div class="navbar-collapse collapse">
          <ul class="navbar-nav flex-grow-1">
            <li class="nav-item">
              <router-link to="/" class="nav-link text-dark"><i class="bi bi-speedometer2"></i> Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/operators" class="nav-link text-dark"><i class="bi bi-people-fill"></i> Operadores</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/memberships" class="nav-link text-dark"><i class="bi bi-card-checklist"></i> Mensualidades</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/rates" class="nav-link text-dark"><i class="bi bi-tags-fill"></i> Tarifas</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <div class="container">
    <main role="main" class="pb-3">
      <!-- Aquí es donde Vue Router renderizará la vista actual -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Usamos <script setup> que es la forma moderna y más limpia de escribir componentes Vue
</script>

<style>
/* Estos estilos ahora son globales para toda la SPA */
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";

body { background-color: #f8f9fa; }
.navbar { background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,.08); }
.card { box-shadow: 0 2px 8px rgba(0,0,0,.05); border: none; }
</style>