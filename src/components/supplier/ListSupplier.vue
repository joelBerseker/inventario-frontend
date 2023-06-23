<script>
import AddCustomer from "../customer/DetailCustomer.vue";
import MainContent from "@/components/my_components/MainContent.vue";
import axios from "axios";
import AuthService from "@/services/AuthService";

const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
  name: "Supplier",
  data() {
    return {
      newTask: "",
      tasks: [],
    };
  },
  created() {
    //this.getTasks();
    const credentials = {
      username: "admin",
      password: "jose123as",
    };
    console.log(credentials);
    AuthService.obtain_token(credentials);
  },
  methods: {
    async getTasks() {
      this.loading = true;
      var path = url + `products/products/`;
      console.log(path);
      axios.get(path).then(function (response) {
        // handle success
        console.log(response.data);
      });
    },
  },
});
</script>
<template>
  <!-- Modal -->
  <AddCustomer />
  <MainContent :title="'Clientes'" :icon="'bi bi-people'">
    <button
      type="button"
      class="btn btn-dark mb-2"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Agregar
    </button>
    <table class="table">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombres</th>
          <th>RUC</th>
          <th>Direccion</th>
          <th>Telefono</th>
          <th>Correo Electronico</th>
          <th>Ultimo ingresado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Jhon Mamani</td>
          <td>74578899911</td>
          <td>En la Esquina</td>
          <td>9544477711</td>
          <td>jhon@kun.com</td>
          <td>10-09-05</td>
          <td><button>EDITAR</button></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Jhon Mamani</td>
          <td>74578899911</td>
          <td>En la Esquina</td>
          <td>9544477711</td>
          <td>jhon@kun.com</td>
          <td>10-09-05</td>
          <td><button>EDITAR</button></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Jhon Mamani</td>
          <td>74578899911</td>
          <td>En la Esquina</td>
          <td>9544477711</td>
          <td>jhon@kun.com</td>
          <td>10-09-05</td>
          <td><button>EDITAR</button></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Jhon Mamani</td>
          <td>74578899911</td>
          <td>En la Esquina</td>
          <td>9544477711</td>
          <td>jhon@kun.com</td>
          <td>10-09-05</td>
          <td><button>EDITAR</button></td>
        </tr>
      </tbody>
    </table>
  </MainContent>
</template>

<style></style>
