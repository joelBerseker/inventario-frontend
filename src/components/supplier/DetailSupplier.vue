<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">AGREGAR PROVEEDOR</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="ruc" class="form-label">RUC</label>
                        <input type="text" class="form-control" id="ruc" required>
                    </div>
                    <div class="mb-3">
                        <label for="direccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="direccion" required>
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="tel" class="form-control" id="telefono" required>
                    </div>
                    <div class="mb-3">
                        <label for="correo" class="form-label">Correo electrónico</label>
                        <input type="email" class="form-control" id="correo" required>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, toRaw } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
var mode = ref(0);
var title = ref("");
const myModal = ref(null);
var product = ref({
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
/*watch: {
    mode: function (value) {
        switch (value) {
            case 1:
                this.title = "Agregar Proveedor"
                break;
            case 2:
                this.title = "Visualizar Proveedor"
                break;
            case 3:
                this.title = "Editar Proveedor"
                break;

            default:
                this.title = "Error"
                break;
        }
        console.log(value);
    }
},*/

const saveItem = () => {
  //alert(`Hello ${this.product}!`);
  this.showToast();
  this.closeModal();
  this.resetForm();
};
const changeMode = (mode) => {
  switch (mode) {
    case 1:
      title = "Agregar Proveedor";
      break;
    case 2:
      title = "Visualizar Proveedor";
      break;
    case 3:
      title = "Editar Proveedor";
      break;
    default:
      title = "Error";
      break;
  }
  mode = mode;
};
const editMode = () => {
  this.changeMode(3);
};
const closeModal = () => {
  myModal.value.closeModal();
  resetForm();
};
const openModal = () => {
  myModal.value.openModal();
};
const data = (item) => {
  product = toRaw(item);
  console.log(product);
};
const resetForm = () => {
  product.name = "";
  product.description = "";
  product.code = "";
  product.price = 0;
  product.count = 0;
  product.cost = 0;
  item_selected = {};
};
defineExpose({
  changeMode,
  openModal,
  editMode,
  closeModal,
  data,
  mode,
});
</script>