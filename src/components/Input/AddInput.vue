<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Agregar Entrada
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarFactura">
            <!-- Cabecera de la factura -->
            <div class="form-group">
              <label for="numero">Número de Factura:</label>
              <input
                type="text"
                v-model="factura.numero"
                class="form-control"
                id="numero"
                required
              />
            </div>
            <div class="form-group">
              <label for="fecha">Fecha:</label>
              <input
                type="date"
                v-model="factura.fecha"
                class="form-control"
                id="fecha"
                required
              />
            </div>
            <div class="form-group">
              <label for="emails">PROVEEDOR:</label>
              <input
                type="text"
                class="form-control"
                name="emails"
                id="emails"
                autocomplete="off"
                v-model="factura.cliente"
              />
              <select
                class="form-select"
                :readonly="isEmailSelected"
                v-model="factura.cliente"
                required
              >
                <option v-for="email in items" v-bind:key="email">
                  {{ email }}
                </option>
              </select>
            </div>

            <!-- Detalle de la factura -->
            <h2>Detalle de la Factura</h2>

            <div class="row">
              <div class="col-4">
                <label>Producto:</label>
              </div>
              
              <div class="col-2">
                <label>Precio Compra:</label>
              </div>
              <div class="col-2">
                <label>Precio Venta:</label>
              </div>
              <div class="col-2">
                <label>Cantidad:</label>
              </div>
              <div class="col-2">
                <label>Subtotal:</label>
              </div>
            </div>

            <div
              v-for="(item, index) in factura.detalle"
              :key="index"
              class="detalle-item"
            >
              <div class="row">
                <div class="form-group col-sm-4 col-md-4">
                  <input
                    type="text"
                    v-model="item.producto"
                    class="form-control"
                    :id="'producto_' + index"
                    required
                  />
                </div>

                <div class="form-group col-sm-2 col-md-2">
                  <input
                    type="number"
                    v-model="item.precio"
                    class="form-control"
                    :id="'precio_' + index"
                    required
                  />
                </div>
                <div class="form-group col-sm-2 col-md-2">
                  <input
                    type="number"
                    v-model="item.compra"
                    class="form-control"
                    :id="'precio_' + index"
                    required
                  />
                </div>
                <div class="form-group col-sm-2 col-md-2">
                  <input
                    type="number"
                    v-model="item.cantidad"
                    class="form-control"
                    :id="'cantidad_' + index"
                    required
                  />
                </div>
                <div class="form-group col-sm-2 col-md-2">
                  <input
                    type="number"
                    v-model="item.sub"
                    class="form-control"
                    :id="'cantidad_' + index"
                    required
                  />
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-primary" @click="agregarItem">
              Agregar Producto
            </button>

            <!-- Botones de acción -->
            <div class="mt-4">
              <button type="submit" class="btn btn-success">
                Guardar Factura
              </button>
              <button type="button" class="btn btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import emailsData from "../Input/emails.json";

export default {
  name: "App",
  data() {
    return {
      factura: {
        numero: "",
        fecha: "",
        cliente: "",
        detalle: [{ producto: "", cantidad: "", precio: "", compra: "",sub:"" }],
      },
      emailOptions: [],
      isEmailSelected: false,
    };
  },
  computed: {
    items() {
      return emailsData.filter((item) => {
        return item.toLowerCase().includes(this.factura.cliente.toLowerCase());
      });
    },
  },

  async created() {
    this.fetchEmailsData()
      .then((data) => {
        this.emailOptions = data;
      })
      .catch((error) => {
        console.error("Error al obtener los correos electrónicos:", error);
      });
  },
  methods: {
    fetchEmailsData() {
      // Devuelve una promesa que resuelve los datos de los correos electrónicos
      return new Promise((resolve, reject) => {
        // Aquí puedes realizar la llamada a la API o importar los datos del archivo JSON
        // En este ejemplo, simplemente utilizamos los datos importados del archivo JSON
        console.log(emailsData);
        resolve(emailsData);
      });
    },

    agregarItem() {
      this.factura.detalle.push({
        producto: "",
        cantidad: "",
        precio: "",
        compra: "",
        sub:""
      });
    },

    guardarFactura() {
      // Aquí puedes realizar la lógica para guardar la factura en la base de datos
      console.log(this.factura);
    },
    selectEmail() {
      this.isEmailSelected = true;
    },
  },
  filteredList() {
    return fruits.filter((fruit) =>
      fruit.toLowerCase().includes(input.value.toLowerCase())
    );
  },
};
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
}

.detalle-item {
  margin-bottom: 1rem;
}
</style>
