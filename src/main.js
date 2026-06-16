import "./assets/css/base.css";
import "./assets/css/mod-bootstrap.css";
import "./assets/css/mod-other.css";
import "./assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import VueApexCharts from "vue3-apexcharts";

// Detecta si hay un modo de reinicio en la URL
if (import.meta.env.RESET_STORE) {
  store.commit("resetData");
}

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

var token = store.state.token;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  delete axios.defaults.headers.common["Authorization"];
}

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueApexCharts);

app.mount("#app");