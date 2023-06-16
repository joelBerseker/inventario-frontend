import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store'


import axios from 'axios';
//var token = store.state.token;
var token = "xd"
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  axios.defaults.headers.common['Authorization'] = null;
}


const app = createApp(App)

app.use(router)

app.mount('#app')

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"