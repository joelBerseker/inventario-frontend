<template>
    <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title">

        <div class="modal-body">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" class="form-control" id="nombre" name="nombre" :disabled="disabled" v-model="item_selected.name" required />
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <textarea class="form-control" id="descripcion" name="descripcion" :disabled="disabled" v-model="item_selected.description"
                    required></textarea>
            </div>
            <div class="form-group">
                <label for="codigo">Código:</label>
                <input type="text" class="form-control" id="codigo" name="codigo" :disabled="disabled" v-model="item_selected.code" required />
            </div>
            <div class="form-group">
                <label for="costo">Precio de Compra:</label>
                <input type="number" class="form-control" id="costo" name="costo" :disabled="disabled" v-model="item_selected.cost" required />
            </div>
            <div class="form-group">
                <label for="precio">Precio de Venta:</label>
                <input type="number" class="form-control" id="precio" name="precio" :disabled="disabled" step="0.01" v-model="item_selected.price"
                    required />
            </div>
            <div class="form-group">
                <label for="inventario">Cantidad en Inventario:</label>
                <input type="number" class="form-control" id="inventario" name="inventario" :disabled="disabled" v-model.number="item_selected.stock"
                    required />
            </div>

        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm button-margin" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> Cerrar
            </button>
            <button type="button" @click="deleteItem" class="btn btn-danger btn-sm button-margin" v-if="mode == 2">
                <i class="bi bi-trash"></i>
                Eliminar
            </button>
            <button type="button" @click="editMode" class="btn btn-dark btn-sm button-margin" v-if="mode == 2">
                <i class="bi bi-pen"></i>
                Editar
            </button>
            <button type="button" @click="saveItem" class="btn btn-dark btn-sm button-margin" v-if="mode != 2">
                <i class="bi bi-check-circle"></i>
                Guardar
            </button>

        </div>
    </MyModal>
</template>
<style scoped>
.button-margin {
    margin-left: 0.25rem;
    margin-right: 0 !important;
    margin-top: 0;
    margin-bottom: 0;
}
</style>
<script>
import axios from "axios";
import { defineComponent } from "vue";
import MyModal from '@/components/my_components/MyModal.vue'
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
    props: [
        "item_selected", "deleteItem", "showToast", "getProducts"
    ],
    components: {
        MyModal
    },
    name: "Product",
    data() {
        return {
            disabled : false,
            mode: 0,
            title: "",
            loading: false,
            newTask: "",
            product: {
                name: "",
                description: "",
                code: "",
                price: 0,
                count: 0,
                cost: 0,
            },
        };
    },
    /*watch: {
        mode: function (value) {
            switch (value) {
                case 1:
                    this.title = "Agregar Producto"
                    break;
                case 2:
                    this.title = "Visualizar Producto"
                    break;
                case 3:
                    this.title = "Editar Producto"
                    break;

                default:
                    this.title = "Error"
                    break;
            }
            console.log(value);
        }
    },*/
    /**created() {
      this.getTasks();
    },*/
    methods: {
        async getTasks() {
            /*this.loading = true;
            axios.get(url + `posts/` + 1).then((res) => {
              const persons = res.data;
              console.log(persons);
            });*/

        },
        async saveItem() {
            //alert(`Hello ${this.product}!`);
            var form_data = new FormData();
            for ( var key in this.item_selected ) {
                form_data.append(key, this.item_selected[key]);
            }
            const response = await axios
            .post(url + 'products/products/', form_data);
            console.log(response);
            this.showToast();
            this.getProducts();
            this.closeModal();
        },
        changeMode(mode) {
            switch (mode) {
                case 1:
                    this.title = "Agregar Producto"
                    this.disabled=false
                    break;
                case 2:
                    this.title = "Visualizar Producto"
                    this.disabled=true
                    break;
                case 3:
                    this.title = "Editar Producto"
                    this.disabled=false
                    break;
                default:
                    this.title = "Error"
                    break;
            }
            this.mode = mode;
        },
        editMode() {
            this.changeMode(3);
        },
        closeModal() {
            console.log("holax2");
            this.$refs.myModal.closeModal();
        },
        openModal() {
            this.$refs.myModal.openModal();
        },
        resetForm() {
            console.log("hola");
            this.item_selected=this.product;
        },
    },
});
</script>
