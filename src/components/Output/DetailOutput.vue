<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl">
    <div class="modal-body">
      <div class="row">
        <div class="col-4 head pe-3">
          <MyInput
            class="mb-3"
            type="text"
            name="Numero de factura"
            :validation="validation.code"
            v-model="factura.numero"
            v-on:input="inputCode()"
          />
          <SelectSearch
            class="mb-3"
            v-model="factura.cliente"
            link="clients/clients/"
            name="Cliente"
            :validation="validation.client"
            id="cliente"
            v-on:update="inputClient()"
          >
          </SelectSearch>
          <MySelect
            class="mb-3"
            name="Tipo de pago"
            :options="options"
            :validation="validation.paymentType"
            v-model="factura.paymentType"
            v-on:update="inputPaymentType()"
          />
          <MyInput
            type="textarea"
            name="Descripción"
            :validation="validation.description"
            v-model="factura.description"
            v-on:input="inputDescription()"
          />
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
                <input
                  type="text"
                  class="form-control form-control-sm text-end"
                  id="nombre"
                  name="nombre"
                  v-model="facturaTotal"
                  disabled
                />
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
            <div class="row mb-3">
              <div class="form-group col-5">
                <SelectSearch
                  v-model="item.producto"
                  link="products/products/"
                  :validation="validation.detail[index].product"
                  v-on:update:modelValue="inputProduct(index)"
                  :id="index + 'product'"
                >
                </SelectSearch>
              </div>
              <div class="form-group col-2">
                <label class="form-control form-control-sm form-control-disabled text-end">{{
                  item.setPrecio(item.producto)
                }}</label>
              </div>
              <div class="form-group col-2">
                <MyInput
                  type="number"
                  inputClass="text-end"
                  :validation="validation.detail[index].quantity"
                  v-model="item.cantidad"
                  v-on:input="inputQuantity(index)"
                />
              </div>
              <div class="form-group col-2">
                <label class="form-control form-control-sm form-control-disabled text-end">{{
                  item.getGanancia()
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
      <button
        type="button"
        @click="deleteItem(item_selected)"
        class="btn btn-danger btn-sm button-margin"
        v-if="mode == 2"
      >
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
import MySelect from "@/components/my_components/MySelect.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import SelectSearch from "@/components/my_components/SelectSearch.vue";
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
  props: ["item_selected", "deleteItem", "showToast", "getOutputs"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MyForm,
    SelectSearch,
    MyInput,
    MySelect
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
      validation: {
        code: {},
        client: {},
        paymentType: {},
        description: {},
        detail: [
          {
            product: {},
            quantity: {},
          },
        ],
      },
      validationEmpty: {
        code: {},
        client: {},
        paymentType: {},
        description: {},
        detail: [
          {
            product: {},
            quantity: {},
          },
        ],
      },
      options: [
        { text: "Efectivo", value: "1" },
        { text: "YAPE", value: "2" },
        { text: "Tarjeta", value: "3" },
        { text: "Otro", value: "4" },
      ],
      factura: {
        description: null,
        numero: null,
        fecha: null,
        paymentType: undefined,
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
  },
  methods: {
    validateForm() {
      this.validateCode();
      this.validateClient();
      this.validatePaymentType();
      this.validateDescription();
      var _validateDetail = this.validateDetail();

      var result =
        this.validation.code.isValid &&
        this.validation.client.isValid &&
        this.validation.paymentType.isValid &&
        this.validation.description.isValid &&
        _validateDetail;
      return result;
    },

    validateCode() {
      this.validation.code = this.validationRequiredText(this.factura.numero, 3, 50);
    },
    validateClient() {
      this.validation.client = this.validationRequiredSelect(this.factura.cliente);
    },
    validatePaymentType() {
      this.validation.paymentType = this.validationRequiredSelect(this.factura.paymentType);
    },
    validateDescription() {
      this.validation.description = this.validationNoRequiredText(this.factura.description, 3, 50);
    },
    validateProduct(index) {
      this.validation.detail[index].product = this.validationRequiredSelect(this.factura.detalle[index].producto);
    },
    validateQuantity(index) {
      this.validation.detail[index].quantity = this.validationRequiredNumber(this.factura.detalle[index].cantidad);
    },
    validateDetail() {
      var resp = true;
      for (var i = 0; i < this.validation.detail.length; i++) {
        this.validateProduct(i);
        this.validateQuantity(i);
        if (this.validation.detail[i].product.isValid == false || this.validation.detail[i].quantity.isValid == false) {
          resp = false;
        }
      }
      return resp;
    },

    inputCode() {
      this.validateCode();
    },
    inputClient() {
      this.validateClient();
    },
    inputPaymentType() {
      this.validatePaymentType();
    },
    inputDescription() {
      this.validateDescription();
    },
    inputProduct(index) {
      this.validateProduct(index);
    },
    inputQuantity(index) {
      this.validateQuantity(index);
    },

    agregarItem() {
      this.factura.detalle.push(new Product());
      this.validation.detail.push({
        product: {},
        quantity: {},
      });
    },
    eliminarItem(index) {
      console.log(index);
      this.factura.detalle.splice(index, 1);
      this.validation.detail.splice(index, 1);
    },
    dataToJson(index) {
      var dataD = [];

      this.factura.detalle.forEach((element) => {
        dataD.push({
          id_order: index,
          id_product: element.producto.id,
          new_sale_price: element.precio,
          quantity: element.cantidad,
        });
      });
      this.addItemD(JSON.stringify(dataD));
    },
    async saveItem() {
      if (this.validateForm()) {
        if (this.factura.detalle.length > 0) {
          console.log(this.factura);
          if (this.textEmpty(this.factura.description, "")) this.factura.description = "Ninguna";
          const formData = new FormData();
          formData.append("id_client", this.factura.cliente.id);
          formData.append("description", this.factura.description);
          formData.append("order_code", this.factura.numero);
          formData.append("payment_type", this.factura.paymentType);
          formData.append("total_price", this.facturaTotal.toFixed(2));
          this.addItemC(formData);
        } else {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se agrego ningun producto, revise si todos los campos se llenaron correctamente.",
            type: 2,
          });
        }
      } else {
        this.showToast({
          title: "Ocurrió un error",
          message: "Datos no válidos, revise si todos los campos se llenaron correctamente.",
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
          this.getOutputs(1);
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
            title: "Operación exitosa",
            message: "El registro se edito correctamente.",
            type: 1,
          });
          this.getProducts();
          this.closeModal();
        })
        .catch(() => {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
            type: 2,
          });
        });
    },
    changeMode(mode) {
      this.validation = JSON.parse(JSON.stringify(this.validationEmpty));
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
      try {
        this.$refs.myModal.closeModal();
      } catch (error) {}
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
            title: "Ocurrió un error",
            message: "No se pudo obtener los registros, si continúa sucediendo contacte con su proveedor.",
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
