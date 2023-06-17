<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">AGREGAR PRODUCTO</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <label for="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            v-model="product.name"
            required
          /><br /><br />

          <label for="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            v-model="product.description"
            required
          ></textarea
          ><br /><br />

          <label for="codigo">Código:</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            v-model="product.code"
            required
          /><br /><br />

          <label for="precio">Precio de Venta:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            step="0.01"
            v-model="product.price"
            required
          /><br /><br />

          <label for="inventario">Cantidad en Inventario:</label>
          <input
            type="number"
            id="inventario"
            name="inventario"
            v-model.number="product.count"
            required
          /><br /><br />

          <label for="nivel_minimo">Nivel Mínimo:</label>
          <input
            type="number"
            id="nivel_minimo"
            name="nivel_minimo"
            v-model="product.min"
            required
          /><br /><br />

          <label for="nivel_maximo">Nivel Máximo:</label>
          <input
            type="number"
            id="nivel_maximo"
            v-model="product.max"
            name="nivel_maximo"
            required
          /><br /><br />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" @click="ProductAdd"  class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;
export default defineComponent({
  name: "Product",
  data() {
    return {
      loading: false,
      newTask: "",
      product: {
        name: "",
        description: "",
        code: "",
        price: 0,
        count: 0,
        min: 0,
        max: 0,
      },
    };
  },
  created() {
    this.getTasks();
  },
  methods: {
    async getTasks() {
      this.loading = true;
      axios.get(url + `posts/` + 1).then((res) => {
        const persons = res.data;
        console.log(persons);
      });
    },
    ProductAdd(event){
        alert(`Hello ${this.product}!`);
        //cerrar modal
        this.resetProduct();
    },
    resetProduct(){
        this.product.name = "";
        this.product.description = "";
        this.product.code = "";
        this.product.price = 0;
        this.product.count = 0;
        this.product.min = 0;
        this.product.max = 0;
    }
  },
});
</script>
