<template>
    <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl">
        <div class="modal-body">
            <div class="row">
                <div class="col-4 head pe-3">
                    <MyForm class="mb-3" name="Numero de factura" :message="validationCode.message">
                        <input type="text" v-model="factura.numero" class="form-control form-control-sm" id="numero"
                            required />
                    </MyForm>
                    <MyForm class="mb-3" name="Cliente">
                        <SelectSearch v-model="factura.cliente" link="clients/clients/"></SelectSearch>
                    </MyForm>
                    <MyForm class="mb-3" name="Fecha">
                        <input type="date" v-model="factura.fecha" class="form-control form-control-sm" id="fecha"
                            required />
                    </MyForm>
                    <MyForm class="mb-3" name="Descripción">
                        <textarea class="form-control form-control-sm" id="descripcion" name="descripcion"
                            :disabled="disabled" v-model="factura.description" required></textarea>
                    </MyForm>
                </div>

                <div class="col-8 ps-3">
                    <div class="row mb-3 d-flex align-items-end">
                        <div class="col">
                            <p class="title-text">Lista de Productos</p>
                        </div>
                        <div class="col-6 text-end">

                            <button type="button" class="btn btn-primary btn-sm me-1">
                                <i class="bi bi-plus-circle"></i> Agregar Producto
                            </button>
                            <button type="button" class="btn btn-sm btn-primary" @click="agregarItem">
                                <i class="bi bi-arrow-90deg-down"></i> Agregar Fila
                            </button>
                        </div>
                        <div class="col-3">
                            <p class="text-secondary">Total:</p>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text form-control-disabled">S/.</span>
                                <input type="text" class="form-control form-control-sm text-end" id="nombre" name="nombre"
                                    v-model="facturaTotal" disabled />
                            </div>
                        </div>
                    </div>
                    <hr class="mb-3 mt-3" />

                    <div class="row text-secondary">
                        <div class="col-3 ">
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

                    <div v-for="(item, index) in selectedProducts" :key="index" class="detalle-item">
                        <div class="row">
                            <div class="form-group col-3">
                                <MyForm class="mb-3" name="">
                                    <SelectSearch v-model="item.data" link="products/products/"
                                        v-on:update:modelValue="changeSelect(index, $event)"></SelectSearch>
                                </MyForm>
                            </div>
                            <div class="form-group col-sm-2 col-md-2 text-end">
                                <input type="number" v-model="factura.detalle[index].compra"
                                    class="form-control form-control-sm text-end" :id="'compra_' + index" required />
                                <label class="text-secondary "><i class="bi bi-arrow-return-right"></i> Antes: S/.{{
                                    factura.detalle[index].antCompra }}</label>
                            </div>
                            <div class="form-group col-sm-2 col-md-2 text-end">
                                <input type="number" v-model="factura.detalle[index].venta"
                                    class="form-control form-control-sm text-end" :id="'venta_' + index" required />
                                <label class="text-secondary"><i class="bi bi-arrow-return-right"></i> Antes: S/.{{
                                    factura.detalle[index].antVenta }}</label>
                            </div>
                            <div class="form-group col-sm-2 col-md-2">
                                <input type="number" v-model="factura.detalle[index].cantidad"
                                    class="form-control form-control-sm text-end" :id="'cantidad_' + index" required />

                            </div>
                            <div class="form-group col-sm-2 col-md-2">
                                <label class="form-control form-control-sm form-control-disabled text-end">{{
                                    factura.detalle[index].getSubtotal() }}</label>
                            </div>
                            <div class="form-group col-1">
                                <button type="button" class="btn btn-sm btn-danger" @click="eliminarItem(index)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
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

.head {
    border-right: 1px solid rgba(0, 0, 0, 0.171);
}
</style>
<script>
import axios from "axios";
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MyForm from "@/components/my_components/MyForm.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import SelectSearch from "../my_components/SelectSearch.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
class Product {
    constructor() {
        this.producto = "";
        this.cantidad = 1;
        this.compra = 0;
        this.venta = 0;
        this.antCompra = 0;
        this.antVenta = 0;
    }
    getSubtotal() {
        this.sub = this.cantidad * this.compra;
        return this.sub.toFixed(2);
    }
}
export default defineComponent({
    props: ["item_selected", "deleteItem", "showToast"],
    mixins: [ValidationFunctions],
    components: {
        MyModal,
        MyForm,
        SelectSearch,
    },
    name: "DetailInput",
    data() {
        return {
            clients: [],
            products: [],
            count: 0,

            disabled: false,
            mode: 0,
            title: "",
            errorMessage: {},
            validated: false,

            factura: {
                description: "Sin Comentarios",
                numero: "",
                fecha: "",
                cliente: " ",
                detalle: [new Product()],
                total: null,
            },
            emailOptions: [],
            isEmailSelected: false,

            selectedProducts: [{}],

        };
    },
    computed: {
        facturaTotal: function () {
            var total = 0;
            this.factura.detalle.forEach((element) => {
                total += element.sub;
            });
            return total;
        },
        validateForm: function () {
            var result = this.validationCode.valid;
            return true;
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

                _valid_text = _message != "" ? " is-invalid" : " is-valid";
                _valid = _message != "" ? false : true;
            }
            var response = {
                message: _message,
                validText: _valid_text,
                valid: _valid,
            };
            return response;
        },
        items() {
            return emailsData.filter((item) => {
                return item.toLowerCase().includes(this.factura.cliente.toLowerCase());
            });
        },
    },
    methods: {
        changeSelect(index, data) {
            console.log("-->" + data.price);
            this.factura.detalle[index].venta = data.price
            this.factura.detalle[index].antVenta = data.price

            this.factura.detalle[index].compra = data.cost
            this.factura.detalle[index].antCompra = data.cost
        },
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
            this.factura.detalle.push(new Product());
            this.selectedProducts.push({});
        },
        eliminarItem(index) {
            console.log(index);
            this.factura.detalle.splice(index, 1);
            this.selectedProducts.splice(index, 1);
        },
        changeCurrency() {
            this.item_selected.price = this.item_selected.price.replace(/[^0-9]/, "");
            console.log("-------------");

            console.log("value -> " + this.item_selected.price);
            var text = this.item_selected.price.toString().replace(/[^0-9]/, "");
            console.log("lengh -> " + text.length);
            console.log("text -> " + text);
            if (text.length >= 3) {
                var firsPart = text.slice(0, -2);
                var lastPart = text.slice(text.length - 2);
                var complete = firsPart + "." + lastPart;
                console.log(complete);
                this.item_selected.price = Number(complete).toFixed(2);
            }

            /*if (this.item_selected.price.toString().length == 3) {
                      this.item_selected.price = (this.item_selected.price / 100).toFixed(2)
                  } else if (this.item_selected.price.toString().length >= 4) {
                      this.item_selected.price = (this.item_selected.price * 1000 / 100).toFixed(2)
                  }*/
        },
        dataToJson(index) {
            var dataD = [];

            this.factura.detalle.forEach(element => {
                dataD.push({ "id_order": index, "id_product": element.producto.id, "new_sale_price": element.precio, "quantity": element.cantidad })
            });
            this.addItemD(JSON.stringify(dataD));
        },
        async saveItem() {
            console.log(this.factura);
            const formData = new FormData();
            formData.append("id_client", this.factura.cliente.id);
            formData.append("description", this.factura.description);
            formData.append("order_code", this.factura.numero);
            formData.append("total_price", this.facturaTotal.toFixed(2));
            this.addItemC(formData);
        },
        async addItemD(data) {
            console.log(data);
            const config = {
                headers: {
                    "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es un JSON
                },
            };
            var path = url + `order_details/order_details/`;
            axios
                .post(path, data, config)
                .then((response) => {
                    console.log(response);
                })
                .catch((e) => {
                    console.log(e);
                });
        },

        async addItemC(data) {
            var index = 0;
            var path = url + `orders/orders/`;
            await axios
                .post(path, data)
                .then((response) => {
                    index = response.data.id;
                    console.log(index);
                    this.dataToJson(index);
                })
                .catch((e) => {
                    console.log(e);
                    index = -1;
                });
            return index;
        },
        editItem(data) {
            console.log(data);
            var path = url + `products/products/` + this.item_selected.id + "/";
            axios
                .put(path, data)
                .then((response) => {
                    this.showToast({
                        title: "Agregar Registro",
                        message: "Operación exitosa",
                        type: 1,
                    });
                    this.getProducts();
                    this.closeModal();
                })
                .catch(() => {
                    this.showToast({
                        title: "Agregar Registro",
                        message:
                            "Ocurrió un error, si continua sucediendo contacte con su proveedor3",
                        type: 2,
                    });
                });
        },
        changeMode(mode) {
            switch (mode) {
                case 1:
                    this.title = "Agregar Entrada";
                    this.disabled = false;
                    break;
                case 2:
                    this.title = "Visualizar Entrada";
                    this.disabled = true;
                    break;
                case 3:
                    this.title = "Editar Entrada";
                    this.disabled = false;
                    break;
                default:
                    this.title = "Error";
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
        async getProducts() {
            var path = url + `products/products/`;
            axios
                .get(path)
                .then((response) => {
                    response.data.results.forEach((element) => {
                        this.products.push(element);
                    });
                    this.loadingContent(false);
                })
                .catch((e) => {
                    console.log(e.message);
                    this.showToast({
                        title: "Obtener Registros",
                        message:
                            "Ocurrió un error, si continua sucediendo contacte con su proveedor1",
                        type: 2,
                    });
                });
        },
        async getclients() {
            var path = url + `clients/clients/`;
            axios
                .get(path)
                .then((response) => {
                    response.data.results.forEach((element) => {
                        this.clients.push(element);
                    });

                    this.count = response.data.count;
                    this.loadingContent(false);
                })
                .catch(() => {
                    this.showToast({
                        title: "Obtener Registros",
                        message:
                            "Ocurrió un error, si continua sucediendo contacte con su proveedor2",
                        type: 2,
                    });
                });
        },
    },
    async created() {
        //await this.getclients();
        //await this.getProducts();
    },
});
</script>
  