import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//import store from './store'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios';

const app = createApp(App)

app.use(router)

app.mount('#app')
