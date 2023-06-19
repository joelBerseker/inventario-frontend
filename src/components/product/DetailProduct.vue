<template>
    <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title">
       
        <div class="modal-body">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" v-model="product.name" required /><br /><br />

            <label for="descripcion">Descripción:</label>
            <textarea id="descripcion" name="descripcion" v-model="product.description" required></textarea><br /><br />

            <label for="codigo">Código:</label>
            <input type="text" id="codigo" name="codigo" v-model="product.code" required /><br /><br />
            <label for="nivel_minimo">Precio de Compra:</label>
            <input type="number" id="costo" name="costo" v-model="product.cost" required /><br /><br />

            <label for="precio">Precio de Venta:</label>
            <input type="number" id="precio" name="precio" step="0.01" v-model="product.price" required /><br /><br />

            <label for="inventario">Cantidad en Inventario:</label>
            <input type="number" id="inventario" name="inventario" v-model.number="product.count" required /><br /><br />


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
        "item_selected", "deleteItem", "showToast"
    ],
    components: {
        MyModal
    },
    name: "Product",
    data() {
        return {
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
        saveItem() {
            //alert(`Hello ${this.product}!`);
            this.showToast();
            this.closeModal();
            this.resetForm();

        },
        changeMode(mode) {
            switch (mode) {
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
            this.mode = mode;
        },
        editMode() {
            this.changeMode(3);
        },
        closeModal() {
            this.$refs.myModal.closeModal();
        },
        openModal() {
            this.$refs.myModal.openModal();
        },
        resetForm() {
            this.product.name = "";
            this.product.description = "";
            this.product.code = "";
            this.product.price = 0;
            this.product.count = 0;
            this.product.cost = 0;
        },
    },
});
</script>
