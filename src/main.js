import { createApp } from 'vue'
import router from '@/router'
import './style.css'
import App from './App.vue'
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';

// Vue.extend(BootstrapVue)

const app = createApp(App)
axios.defaults.baseURL = "http://localhost:8080"

app.use(router)
app.mount('#app')

app.config.globalProperties.axios = axios;

