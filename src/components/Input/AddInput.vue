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
                type="email"
                class="form-control"
                multiple
                name="emails"
                id="emails"
                list="drawfemails"
                required
                size="64"
                :readonly="isEmailSelected"
                @change="selectEmail"
                v-model="factura.cliente"
              />

              <datalist id="drawfemails">
                <option
                  v-for="email in emailOptions"
                  :key="email"
                  :value="email"
                >
                  {{ email }}
                </option>
              </datalist>

            </div>

            <!-- Detalle de la factura -->
            <h2>Detalle de la Factura</h2>
            <div
              v-for="(item, index) in factura.detalle"
              :key="index"
              class="detalle-item"
            >
              <div class="row">
                <div class="form-group col-sm-6 col-md-6">
                  <label :for="'producto_' + index">Producto:</label>
                  <input
                    type="text"
                    v-model="item.producto"
                    class="form-control"
                    :id="'producto_' + index"
                    required
                  />
                </div>
                <div class="form-group col-sm-3 col-md-3">
                  <label :for="'cantidad_' + index">Cantidad:</label>
                  <input
                    type="number"
                    v-model="item.cantidad"
                    class="form-control"
                    :id="'cantidad_' + index"
                    required
                  />
                </div>
                <div class="form-group col-sm-3 col-md-3">
                  <label :for="'precio_' + index">Precio:</label>
                  <input
                    type="number"
                    v-model="item.precio"
                    class="form-control"
                    :id="'precio_' + index"
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
import { ref, onMounted } from 'vue';
import emailsData from '../Input/emails.json';

export default {
  name: "App",
  setup() {
    const emailOptions = ref([]);
    const isEmailSelected = ref(false);
    
    const factura = ref({
      numero: "",
      fecha: "",
      cliente: "",
      detalle: [{ producto: "", cantidad: "", precio: "" }],
    });
    onMounted(() => {
      // Simulando una llamada asíncrona para obtener los datos de los correos electrónicos
      fetchEmailsData()
        .then((data) => {
          emailOptions.value = data;
        })
        .catch((error) => {
          console.error('Error al obtener los correos electrónicos:', error);
        });
    });

    const fetchEmailsData = () => {
      // Devuelve una promesa que resuelve los datos de los correos electrónicos
      return new Promise((resolve, reject) => {
        // Aquí puedes realizar la llamada a la API o importar los datos del archivo JSON
        // En este ejemplo, simplemente utilizamos los datos importados del archivo JSON
        resolve(emailsData);
      });
    };

    const agregarItem = () => {
      factura.value.detalle.push({ producto: "", cantidad: "", precio: "" });
    };

    const guardarFactura = () => {
      // Aquí puedes realizar la lógica para guardar la factura en la base de datos
      console.log(factura.value);
    };
    const selectEmail = () => {
      isEmailSelected.value = true;
    };

    return {
      factura,
      agregarItem,
      guardarFactura,
      emailOptions,
      selectEmail,
      isEmailSelected,
    };
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
