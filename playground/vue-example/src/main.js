import { createApp } from 'vue'
import App from './App.vue'

/* #if IS_LINUX */
console.log('Initializing Vue app in Linux environment');
/* #else */
console.log('Initializing Vue app in standard environment');
/* #endif */

// Create and mount the Vue application
const app = createApp(App);

// Add any global configurations here if needed
/* #if IS_LINUX */
app.config.performance = true;
/* #endif */

// Mount the app to the #app element in index.html
app.mount('#app');