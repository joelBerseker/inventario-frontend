<template>
  <MyModal
    ref="myModal"
    :id="'productDetailModal'"
    :title="this.title"
    size="modal-xl"
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-4">
          <MyForm
            class="mb-3"
            name="Numero de factura"
            :message="validationCode.message"
          >
            <input
              type="text"
              v-model="factura.numero"
              class="form-control form-control-sm"
              id="numero"
              required
            />
          </MyForm>
        </div>
        <div class="col">
          <MyForm class="mb-3" name="Cliente">
            <SelectSearch
              v-model="factura.cliente"
              link="clients/clients/"
            ></SelectSearch>
          </MyForm>
        </div>
        <div class="col">
          <MyForm class="mb-3" name="Fecha">
            <input
              type="date"
              v-model="factura.fecha"
              class="form-control form-control-sm"
              id="fecha"
              required
            />
          </MyForm>
        </div>
      </div>

      <div class="row mb-0">
        <div class="col">
          <p class="title-text">Productos</p>
        </div>
        <div class="col text-end">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="agregarItem"
          >
            Agregar Producto
          </button>
        </div>
      </div>
      <hr class="my-3" />
      <div class="row">
        <div class="col-4">
          <label>Nombre:</label>
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

      <div
        v-for="(item, index) in factura.detalle"
        :key="index"
        class="detalle-item"
      >
        <div class="row">
          <div class="form-group col-sm-4 col-md-4">
            <MyForm class="mb-3" name="">
            <SelectSearch
              v-model="item.producto"   
              link="products/products/"
            ></SelectSearch>
          </MyForm>
          
          </div>
          <div class="form-group col-sm-2 col-md-2">
            <label class="form-control form-control-sm">{{ item.setPrecio(item.producto) }}</label>
          </div>
          <div class="form-group col-sm-2 col-md-2">
            <input
              type="number"
              v-model="item.cantidad"
              class="form-control form-control-sm"
              :id="'cantidad_' + index"
              required
            />
          </div>
          <div class="form-group col-sm-2 col-md-2">
            <label class="form-control form-control-sm">{{ item.getGanancia() }}</label>
          </div>
        </div>
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
        @click="deleteItem(item_selected)"
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
        @click="saveItem"
        class="btn btn-success btn-sm button-margin"
        v-if="mode != 2"
      >
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
import MyModal from "@/components/my_components/MyModal.vue";
import MyForm from "@/components/my_components/MyForm.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import SelectSearch from "../my_components/SelectSearch.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
class Product {
  constructor() {
    this.producto = "";
    this.cantidad = 1;
    this.precio = 0;
    this.sub = 0;
  }
  getGanancia() {
    this.sub = this.cantidad * this.precio;
    
    return this.sub;
  }
  setPrecio(data){
    if(typeof data !="string")
      this.precio=data.price;
    return this.precio;
  }
}
export default defineComponent({
  props: ["item_selected", "deleteItem", "showToast"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MyForm,
    MyForm,
    SelectSearch,
  },
  name: "Product",
  data() {
    return {
      clients: [],
      products:[],
      count:0,
      prueba_select_search: "no se seleccion",

      disabled: false,
      mode: 0,
      title: "",
      errorMessage: {},
      validated: false,

      factura: {
        numero: "",
        fecha: "",
        cliente: " ",
        detalle: [new Product()],
      },
      emailOptions: [],
      isEmailSelected: false,
    };
  },
  computed: {

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
    async saveItem() {
      console.log(this.factura);
      /**this.validated = true;
      if (this.validateForm) {
        var form_data = new FormData();
        for (var key in this.item_selected) {
          if (
            this.mode == 3 &&
            (key == "id" ||
              key == "created_at" ||
              key == "updated_at" ||
              key == "product_image")
          ) {
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
          message:
            "Ocurrió un error, revise todos si todos los campos se llenaron correctamente",
          type: 2,
        });
      
      }*/
    },
    addItem(data) {
      console.log(data);
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
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
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
          console.log(response);
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
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
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
          
          this.count =response.data.count;
          this.loadingContent(false);
        })
        .catch(() => {
          this.showToast({
            title: "Obtener Registros",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
    },
    
    
  },
  async created() {
    await this.getclients();
    await this.getProducts();
  },
});
</script>
