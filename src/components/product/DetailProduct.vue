<template>
  <Suspense>
    <MyModal :key="title" ref="myModal" :id="id" :title="title.value">
    <div class="modal-body">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          class="form-control"
          id="nombre"
          name="nombre"
          v-model="product.name"
          required
        />
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea
          class="form-control"
          id="descripcion"
          name="descripcion"
          v-model="product.description"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="codigo">Código:</label>
        <input
          type="text"
          class="form-control"
          id="codigo"
          name="codigo"
          v-model="product.code"
          required
        />
      </div>
      <div class="form-group">
        <label for="costo">Precio de Compra:</label>
        <input
          type="number"
          class="form-control"
          id="costo"
          name="costo"
          v-model="product.cost"
          required
        />
      </div>
      <div class="form-group">
        <label for="precio">Precio de Venta:</label>
        <input
          type="number"
          class="form-control"
          id="precio"
          name="precio"
          step="0.01"
          v-model="product.price"
          required
        />
      </div>
      <div class="form-group">
        <label for="inventario">Cantidad en Inventario:</label>
        <input
          type="number"
          class="form-control"
          id="inventario"
          name="inventario"
          v-model.number="product.stock"
          required
        />
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary btn-sm button-margin"
        data-bs-dismiss="modal"
      >
        <i class="bi bi-x-circle"></i> Cerrar
      </button>
      <button
        type="button"
        @click="deleteItem"
        class="btn btn-danger btn-sm button-margin"
        v-if="mode == 2"
      >
        <i class="bi bi-trash"></i>
        Eliminar
      </button>
      <button
        type="button"
        @click="editMode"
        class="btn btn-dark btn-sm button-margin"
        v-if="mode == 2"
      >
        <i class="bi bi-pen"></i>
        Editar
      </button>
      <button
        type="button"
        @click="saveItem()"
        class="btn btn-dark btn-sm button-margin"
        v-if="mode != 2"
      >
        <i class="bi bi-check-circle"></i>
        Guardar
      </button>
    </div>
  </MyModal>
</Suspense>
</template>
<script setup>
import { ref, toRaw, defineProps, defineExpose,reactive  } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";

const url = import.meta.env.VITE_APP_RUTA_API;

const mode = ref(0);
const id = "productDetailModal";
const title = ref("");
const myModal = ref(null);
const product = reactive({
  name: "",
  description: "",
  code: "",
  price: 0,
  count: 0,
  cost: 0,
});

const props = defineProps({
  item_selected: Object,
  deleteItem: Object,
  showToast: Boolean,
});

const saveItem = () => {
  showToast();
  closeModal();
  resetForm();
};

const changeMode = (newMode) => {
  switch (newMode) {
    case 1:
      title.value = "Agregar Producto";
      break;
    case 2:
      title.value = "Visualizar Producto";
      break;
    case 3:
      title.value = "Editar Producto";
      break;
    default:
      title.value = "Error";
      break;
  }
  mode.value = newMode;
};

const editMode = () => {
  changeMode(3);
};

const closeModal = () => {
  myModal.value.closeModal();
  resetForm();
};

const openModal = () => {
  myModal.value.openModal();
};

const data = (item) => {
  Object.assign(product, toRaw(item));
  console.log(product);
};

const resetForm = () => {
  product.name = "";
  product.description = "";
  product.code = "";
  product.price = 0;
  product.count = 0;
  product.cost = 0;
  props.item_selected = {};
};

defineExpose({
  changeMode,
  openModal,
  editMode,
  closeModal,
  data,
  mode,
  title,
});
</script>
<style scoped>
.button-margin {
  margin-left: 0.25rem;
  margin-right: 0 !important;
  margin-top: 0;
  margin-bottom: 0;
}
</style>