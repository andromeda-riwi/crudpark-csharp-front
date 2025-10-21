// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import OperatorsView from '@/views/OperatorsView.vue';
import MembershipsView from '@/views/MembershipsView.vue';
import RatesView from '@/views/RatesView.vue';

const routes = [
    { path: '/', name: 'Dashboard', component: DashboardView },
    { path: '/operators', name: 'Operators', component: OperatorsView },
    { path: '/memberships', name: 'Memberships', component: MembershipsView },
    { path: '/rates', name: 'Rates', component: RatesView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;