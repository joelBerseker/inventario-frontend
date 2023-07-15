<template>
    <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title">

        <div class="modal-body">
            <div class="row">
                <div class="col-4">
                    <MyForm class="mb-3" name="Código" :message="validationCode.validationMessage">
                        <input type="text" :class="'form-control form-control-sm ' + validationCode.validationStyle" id="codigo"
                            name="codigo" :disabled="disabled" v-model="item_selected.code" required />
                    </MyForm>
                </div>
                <div class="col">
                    <MyForm class="mb-3" name="Nombre" :message="validationName.validationMessage">
                        <input type="text" :class="'form-control form-control-sm ' + validationName.validationStyle" id="nombre"
                            name="nombre" :disabled="disabled" v-model="item_selected.name" required />
                    </MyForm>
                </div>
            </div>
            <MyForm class="mb-3" name="Descripción" :message="validationDescription.validationMessage">
                <textarea :class="'form-control form-control-sm ' + validationDescription.validationStyle" id="descripcion"
                    name="descripcion" :disabled="disabled" v-model="item_selected.description" required></textarea>
            </MyForm>
            <div class="row">
                <div class="col">
                    <MyForm class="mb-3" name="Precio de Compra" :message="validationCost.validationMessage">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">S/.</span>
                            <input @input="inputCost()" type="text"
                                :class="'form-control form-control-sm ' + validationCost.validationStyle" id="costo" name="costo"
                                :disabled="disabled" v-model="item_selected.cost" />
                        </div>
                    </MyForm>
                </div>
                <div class="col">
                    <MyForm class="mb-3" name="Precio de Venta" :message="validationPrice.validationMessage">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">S/.</span>
                            <input @input="inputPrice()" type="text"
                                :class="'form-control form-control-sm ' + validationPrice.validationStyle" id="precio"
                                name="precio" :disabled="disabled" v-model="item_selected.price" />
                        </div>

                    </MyForm>
                </div>
            </div>
            <MyForm class="mb-3" name="Cantidad en Inventario" :message="validationStock.validationMessage">
                <input type="text" :class="'form-control form-control-sm ' + validationStock.validationStyle" id="inventario" name="inventario"
                @input="inputStock()" :disabled="disabled" v-model="item_selected.stock" required />
            </MyForm>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm button-margin" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> Cerrar
            </button>
            <button type="button" @click="deleteItem(item_selected)" class="btn btn-danger btn-sm button-margin"
                v-if="mode == 2">
                <i class="bi bi-trash"></i>
                Eliminar
            </button>
            <button type="button" @click="editMode" class="btn btn-dark btn-sm button-margin" v-if="mode == 2">
                <i class="bi bi-pen"></i>
                Editar
            </button>
            <button type="button" @click="saveItem" class="btn btn-success btn-sm button-margin" v-if="mode != 2">
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
import MyForm from '@/components/my_components/MyForm.vue'
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
    props: [
        "item_selected", "deleteItem", "showToast", "getProducts"
    ],
    mixins: [ValidationFunctions],
    components: {
        MyModal,
        MyForm,
        MyForm
    },
    name: "Product",
    data() {
        return {
            disabled: false,
            mode: 0,
            title: "",
            errorMessage: {},
            validated: false,
        };
    },

    computed: {
        validateForm: function () {
            var result =
                this.validationCode.isValid &&
                this.validationName.isValid &&
                this.validationCost.isValid &&
                this.validationPrice.isValid &&
                this.validationStock.isValid &&
                this.validationDescription.isValid
                ;
            return result
        },

        validationCode: function () {
            var text = this.item_selected.code;

            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);
            validationMessage = this.textLength(text, validationMessage, 3, 10);

            return this.validateInput(text, validationMessage, true);
        },

        validationName: function () {
            var text = this.item_selected.name;

            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);
            validationMessage = this.textLength(text, validationMessage, 3, 50);

            return this.validateInput(text, validationMessage, true);
        },

        validationCost: function () {
            var text = this.item_selected.cost;

            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);
            validationMessage = this.textLength(text, validationMessage, 3, 15);

            return this.validateInput(text, validationMessage, true);
        },

        validationPrice: function () {
            var text = this.item_selected.price;
            
            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);
            validationMessage = this.textLength(text, validationMessage, 3, 15);

            return this.validateInput(text, validationMessage, true);
        },

        validationDescription: function () {
            var text = this.item_selected.description;
            
            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);
            validationMessage = this.textLength(text, validationMessage, 3, 50);

            return this.validateInput(text, validationMessage, false);
        },
        validationStock: function () {
            var text = this.item_selected.stock;
            
            var validationMessage = "";
            validationMessage = this.textEmpty(text, validationMessage);

            return this.validateInput(text, validationMessage, true);
        },

    },
    methods: {
        inputPrice() {
            this.item_selected.price = this.item_selected.price.replace(/[^0-9]/, '')
            this.item_selected.price = this.changeCurrency(this.item_selected.price)
        },
        inputCost() {
            this.item_selected.cost = this.item_selected.cost.replace(/[^0-9]/, '')
            this.item_selected.cost = this.changeCurrency(this.item_selected.cost)
        },
        inputStock(){
            this.item_selected.stock = this.item_selected.stock.replace(/[^0-9]/, '')
        },

        async saveItem() {
            this.validated = true;
            if (this.validateForm) {
                if(this.textEmpty(this.item_selected.description, "")) this.item_selected.description = "Ninguna";
                var form_data = new FormData();
                for (var key in this.item_selected) {
                    if (this.mode == 3 && (key == 'id' || key == 'created_at' || key == 'updated_at' || key == 'product_image')) {
                        console.log("key ->" + key);
                        continue;
                    }
                    form_data.append(key, this.item_selected[key]);
                }
                switch (this.mode) {
                    case 1:
                        this.addItem(form_data);
                        break;
                    case 3:
                        this.editItem(form_data);
                        break;
                    default:
                        break;
                }
            } else {
                this.showToast({
                    title: "Validar Registro",
                    message: "Ocurrió un error, revise todos si todos los campos se llenaron correctamente",
                    type: 2,
                });
            }
        },
        addItem(data) {
            var path = url + `products/products/`;
            axios.post(path, data).then((response) => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Operación exitosa",
                    type: 1,
                });
                this.getProducts();
                this.closeModal();
            }).catch(() => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
        editItem(data) {
            console.log(data);
            var path = url + `products/products/` + this.item_selected.id + '/';
            axios.put(path, data).then((response) => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Operación exitosa",
                    type: 1,
                });
                this.getProducts();
                this.closeModal();
            }).catch(() => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
        changeMode(mode) {
            switch (mode) {
                case 1:
                    this.title = "Agregar Producto"
                    this.disabled = false
                    break;
                case 2:
                    this.title = "Visualizar Producto"
                    this.disabled = true
                    break;
                case 3:
                    this.title = "Editar Producto"
                    this.disabled = false
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
            this.validated = false;
            this.$refs.myModal.openModal();
        },
    },
});
</script>
