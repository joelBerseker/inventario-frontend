import "./assets/css/base.css";
import "./assets/css/mod-bootstrap.css";
import "./assets/css/mod-other.css";
import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

//import store from './store'

// Detecta si hay un modo de reinicio en la URL
if (import.meta.env.RESET_STORE) {
  // Llama a una mutación o acción para restablecer los datos en la store
  store.commit("resetData"); // Asume que tienes una mutación llamada 'resetData'
}
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

var token = store.state.token;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  axios.defaults.headers.common["Authorization"] = "Hola";
}

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");
