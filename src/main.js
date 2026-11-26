import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { initializeAnalytics } from './analytics.js';

createApp(App).mount('#app');

initializeAnalytics();
