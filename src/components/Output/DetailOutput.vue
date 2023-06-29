<template>
    <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl">

        <div class="modal-body">
            <div class="row">
                <div class="col-4">
                    <MyForm class="mb-3" name="Código" :message="validationCode.message">

                        <input type="text" :class="'form-control form-control-sm ' + validationCode.validText" id="codigo"
                            name="codigo" :disabled="disabled" v-model="item_selected.code" required />
                    </MyForm>
                </div>
                <div class="col">
                    <MyForm class="mb-3" name="Nombre">
                        <input type="text" class="form-control form-control-sm" id="nombre" name="nombre"
                            :disabled="disabled" v-model="item_selected.name" required />
                    </MyForm>
                </div>
            </div>
            <MyForm class="mb-3" name="Descripción">
                <textarea class="form-control form-control-sm" id="descripcion" name="descripcion" :disabled="disabled"
                    v-model="item_selected.description" required></textarea>
            </MyForm>
            <div class="row">
                <div class="col">
                    <MyForm class="mb-3" name="Precio de Compra">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">S/.</span>
                            <input type="number" class="form-control form-control-sm" id="costo" name="costo"
                                :disabled="disabled" v-model="item_selected.cost" required />
                        </div>
                    </MyForm>
                </div>
                <div class="col">
                    <MyForm class="mb-3" name="Precio de Venta">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">S/.</span>
                            <input @input="changeCurrency()" type="text" class="form-control form-control-sm" id="precio"
                                name="precio" :disabled="disabled" v-model="item_selected.price" />
                        </div>

                    </MyForm>
                </div>
            </div>
            <MyForm class="mb-3" name="Cantidad en Inventario">
                <input type="number" class="form-control form-control-sm" id="inventario" name="inventario"
                    :disabled="disabled" v-model.number="item_selected.stock" required />
            </MyForm>


            <MyForm class="mb-3" name="Select Search">
                <SelectSearch v-model="prueba_select_search"  :list="providers" ></SelectSearch>
            </MyForm>
            <p>---- {{ this.prueba_select_search }}</p>
            <hr />
            <div class="row mb-3">
                <div class="col">
                    <p class="title-text">Productos</p>
                </div>
                <div class="col text-end"><button type="button" class="form-select" @click="agregarItem">
                        Agregar Producto
                    </button> </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <label>Nombre:</label>
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

            <div v-for="(item, index) in factura.detalle" :key="index" class="detalle-item">
                <div class="row">
                    <div class="form-group col-sm-4 col-md-4">
                        <input type="text" v-model="item.producto" class="form-control form-control-sm"
                            :id="'producto_' + index" required />
                    </div>

                    <div class="form-group col-sm-2 col-md-2">
                        <input type="number" v-model="item.precio" class="form-control form-control-sm"
                            :id="'precio_' + index" required />
                    </div>
                    <div class="form-group col-sm-2 col-md-2">
                        <input type="number" v-model="item.compra" class="form-control form-control-sm"
                            :id="'precio_' + index" required />
                    </div>
                    <div class="form-group col-sm-2 col-md-2">
                        <input type="number" v-model="item.cantidad" class="form-control form-control-sm"
                            :id="'cantidad_' + index" required />
                    </div>
                    <div class="form-group col-sm-2 col-md-2">
                        <input type="number" v-model="item.sub" class="form-control form-control-sm"
                            :id="'cantidad_' + index" required />
                    </div>
                </div>
            </div>




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
            {{ validateForm }}
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
import SelectSearch from "../my_components/SelectSearch.vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
    props: [
        "item_selected", "deleteItem", "showToast", "getProducts"
    ],
    mixins: [ValidationFunctions],
    components: {
        MyModal,
        MyForm,
        MyForm,
        SelectSearch
    },
    name: "Product",
    data() {
        return {
            providers: [
                "p1",
                "p2",
                "p3",
                "p4",
                "p5",
            ],
            prueba_select_search: "no se seleccion",

            disabled: false,
            mode: 0,
            title: "",
            errorMessage: {},
            validated: false,

            factura: {
                numero: "",
                fecha: "",
                cliente: "",
                detalle: [{ producto: "", cantidad: "", precio: "", compra: "", sub: "" }],
            },
            emailOptions: [],
            isEmailSelected: false,
        };
    },

    computed: {
        validateForm: function () {
            var result = this.validationCode.valid;
            return result
        },
        validationCode: function () {
            var text = this.item_selected.code;
            var _message = "";
            var _valid_text = "";
            var _valid = true;
            if (this.showValidation(text, this.validated, this.mode)) {
                _message = this.onlyText(text, _message);
                _message = this.textEmpty(text, _message);
                _message = this.textLength(text, _message, 3, 6);

                _valid_text = (_message != "") ? " is-invalid" : " is-valid";
                _valid = (_message != "") ? false : true;
            }
            var response = { message: _message, validText: _valid_text, valid: _valid }
            return response;
        },
        items() {
            return emailsData.filter((item) => {
                return item.toLowerCase().includes(this.factura.cliente.toLowerCase());
            });
        },


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
        guardarFactura() {
            // Aquí puedes realizar la lógica para guardar la factura en la base de datos
            console.log(this.factura);
        },
        selectEmail() {
            this.isEmailSelected = true;
        },
        filteredList() {
            return fruits.filter((fruit) =>
                fruit.toLowerCase().includes(input.value.toLowerCase())
            );
        },
        agregarItem() {
            this.factura.detalle.push({
                producto: "",
                cantidad: "",
                precio: "",
                compra: "",
                sub: ""
            });
        },



        changeCurrency() {
            this.item_selected.price = this.item_selected.price.replace(/[^0-9]/, '')
            console.log("-------------")

            console.log("value -> " + this.item_selected.price)
            var text = this.item_selected.price.toString().replace(/[^0-9]/, '')
            console.log("lengh -> " + text.length)
            console.log("text -> " + text)
            if (text.length >= 3) {
                var firsPart = text.slice(0, -2);
                var lastPart = text.slice(text.length - 2)
                var complete = firsPart + "." + lastPart
                console.log((complete))
                this.item_selected.price = Number(complete).toFixed(2)
            }

            /*if (this.item_selected.price.toString().length == 3) {
                this.item_selected.price = (this.item_selected.price / 100).toFixed(2)
            } else if (this.item_selected.price.toString().length >= 4) {
                this.item_selected.price = (this.item_selected.price * 1000 / 100).toFixed(2)
            }*/

        },
        async saveItem() {
            this.validated = true;
            if (this.validateForm) {
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
