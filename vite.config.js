// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Importa el módulo 'path' de Node.js

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            // Aquí está la configuración del alias.
            // Le decimos que '@' es un alias para '/src'.
            '@': path.resolve(__dirname, './src'),
        },
    },
});