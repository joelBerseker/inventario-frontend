<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl">
    <div class="modal-body">
      <div class="row">
        <div class="col-4 head pe-3">
          <MyInput class="mb-3" type="text" name="Numero de factura" :validation="validationOrderCode"
            v-model="factura.numero" />
          <SelectSearch class="mb-3" v-model="factura.cliente" link="clients/clients/" name="Cliente"
            :validation="validationClient">
          </SelectSearch>
          <MyInput class="mb-3" type="date" name="Fecha" :validation="validationDate" v-model="factura.fecha" />
          <MyInput type="textarea" name="Descripción" :validation="validationDescription" v-model="factura.description" />
        </div>

        <div class="col-8 ps-3">
          <div class="row mb-3 d-flex align-items-end">
            <div class="col">
              <p class="title-text">Lista de Productos</p>
            </div>
            <div class="col text-end">
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

          <div class="row">
            <div class="col-5">
              <label class="text-secondary">Nombre:</label>
            </div>
            <div class="col-2">
              <label class="text-secondary">Precio Venta:</label>
            </div>
            <div class="col-2">
              <label class="text-secondary">Cantidad:</label>
            </div>
            <div class="col-2">
              <label class="text-secondary">Subtotal:</label>
            </div>
          </div>

          <div v-for="(item, index) in factura.detalle" :key="index" class="detalle-item">
            <div class="row">
              <div class="form-group col-5">

                <SelectSearch v-model="item.producto" link="products/products/"
                  :validation="validationList[index].producto" v-on:update:modelValue="inputProducto(index)">
                </SelectSearch>

              </div>
              <div class="form-group col-sm-2 col-md-2">
                <label class="form-control form-control-sm form-control-disabled text-end">{{
                  item.setPrecio(item.producto) }}</label>
              </div>
              <div class="form-group col-sm-2 col-md-2 ">

                <MyInput type="number" inputClass="text-end" :validation="validationList[index].cantidad"
                  v-model="item.cantidad" v-on:input="inputCantidad(index)" />

              </div>
              <div class="form-group col-sm-2 col-md-2">
                <label class="form-control form-control-sm form-control-disabled text-end">{{ item.getGanancia()
                }}</label>
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
import MyInput from "@/components/my_components/MyInput.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import SelectSearch from "../my_components/SelectSearch.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
class Product {
  constructor() {
    this.producto = "";
    this.cantidad = 1;
    this.precio = 0;
    /*this.sub = 0;*/
    this.sub = function () {
      return this.precio + this.cantidad;
    };
  }
  getGanancia() {
    this.sub = this.cantidad * this.precio;
    return this.sub.toFixed(2);
  }
  getProduct() {
    return this.producto.id;
  }
  setPrecio(data) {
    if (typeof data != "string") this.precio = data.price;
    return this.precio;
  }
}
export default defineComponent({
  props: ["item_selected", "deleteItem", "showToast"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MyForm,
    SelectSearch,
    MyInput,
  },
  name: "Product",
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
      validationList: [
        {
          producto: {},
          cantidad: {},
        }
      ],
      factura: {
        description: null,
        numero: null,
        fecha: null,
        cliente: null,
        detalle: [new Product()],
        total: null,
      },
      emailOptions: [],
      isEmailSelected: false,
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
      var result =
        this.validationOrderCode.isValid &&
        this.validationDescription.isValid &&
        this.validationDate.isValid &&
        this.validationClient.isValid
        ;
      return result;
    },
    validationOrderCode: function () {
      var text = this.factura.numero;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 10, 10);

      return this.validateInput(text, validationMessage, true);
    },
    validationDescription: function () {
      var text = this.factura.description;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 3, 50);

      return this.validateInput(text, validationMessage, false);
    },
    validationDate: function () {
      var text = this.factura.fecha;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);

      return this.validateInput(text, validationMessage, true);
    },
    validationClient: function () {
      var text = this.factura.cliente;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);

      return this.validateInput(text, validationMessage, true);
    },
    items() {
      return emailsData.filter((item) => {
        return item.toLowerCase().includes(this.factura.cliente.toLowerCase());
      });
    },
  },
  methods: {
    inputCantidad(index) {
      this.validationList[index].cantidad = this.validationCantidad(this.factura.detalle[index].cantidad)
    },

    inputProducto(index) {
      this.validationList[index].producto = this.validationProducto(this.factura.detalle[index].producto)
    },
    validateProductList(){
      var resp = true
      console.log("entre a ")
      for(var i = 0; i< this.factura.detalle.length; i++){
        console.log(i)
        this.inputCantidad(i)
        this.inputProducto(i)
        if(this.validationList[i].producto.isValid==false || this.validationList[i].cantidad.isValid==false){
          resp = false
          console.log("entre a false en la lista")
        }

      }
      return resp;
    },
    validationCantidad(data) {
      var text = data;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);

      return this.validateInput(text, validationMessage, true);
    },
    validationProducto(data) {
      var text = data;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);

      return this.validateInput(text, validationMessage, true);
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
      this.validationList.push({
        producto: {},
        cantidad: {},
      });
    },
    eliminarItem(index) {
      console.log(index);
      this.factura.detalle.splice(index, 1);
      this.validationList.splice(index, 1);
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
      this.validated = true;
      if (this.validateProductList()&&this.validateForm) {
        console.log(this.factura);
        if (this.textEmpty(this.factura.description, "")) this.factura.description = "Ninguna";
        const formData = new FormData();
        formData.append("id_client", this.factura.cliente.id);
        formData.append("description", this.factura.description);
        formData.append("order_code", this.factura.numero);
        formData.append("total_price", this.facturaTotal.toFixed(2));
        this.addItemC(formData);
      } else {
        this.showToast({
          title: "Validar Registro",
          message: "Ocurrió un error, revise todos si todos los campos se llenaron correctamente",
          type: 2,
        });
      }

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
          this.closeModal();
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
          this.title = "Agregar Salida";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Salida";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Salida";
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
