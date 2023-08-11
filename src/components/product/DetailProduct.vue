<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title">
    <div class="modal-body">
      <div class="row mb-3">
        <div class="col-4">
          <MyInput
            type="text"
            name="Código"
            :validation="validation.code"
            v-model="item.code"
            :disabled="disabled"
            v-on:input="inputCode()"
          />
        </div>
        <div class="col">
          <MyInput
            type="text"
            name="Nombre"
            :validation="validation.name"
            v-model="item.name"
            :disabled="disabled"
            v-on:input="inputName()"
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <MyInput
            type="text"
            name="Precio de Compra"
            :validation="validation.cost"
            v-model="item.cost"
            v-on:input="inputCost()"
            :disabled="disabled"
          >
            <template v-slot:pre>
              <p>S/.</p>
            </template>
          </MyInput>
        </div>
        <div class="col">
          <MyInput
            type="text"
            name="Precio de Venta"
            :validation="validation.price"
            v-model="item.price"
            v-on:input="inputPrice()"
            :disabled="disabled"
          >
            <template v-slot:pre>
              <p>S/.</p>
            </template>
          </MyInput>
        </div>
        <div class="col">
          <MyInput
            type="text"
            name="Cantidad en Inventario"
            :validation="validation.stock"
            v-model="item.stock"
            :disabled="disabled"
            v-on:input="inputStock()"
          />
        </div>
      </div>
      <MyInput
        type="textarea"
        name="Descripción"
        :validation="validation.description"
        v-model="item.description"
        :disabled="disabled"
        v-on:input="inputDescription()"
      />
    </div>
    <div class="modal-footer">
      <button type="button" @click="deleteItem(item)" class="btn btn-danger btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-trash"></i>
        Eliminar
      </button>
      <button type="button" @click="editMode" class="btn btn-primary btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-pen"></i>
        Editar
      </button>
      <button type="button" @click="viewMode" class="btn btn-secondary btn-sm button-margin" v-if="mode == 3">
        <i class="bi bi-arrow-left-circle"></i>
        Cancelar
      </button>
      <button type="button" @click="saveItem" class="btn btn-primary btn-sm button-margin" v-if="mode != 2">
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
import MyInput from "@/components/my_components/MyInput.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  props: ["item_selected", "deleteItem", "showToast", "getProductsNew"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MyInput,
  },
  name: "Product",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      validation: {
        code: {},
        name: {},
        cost: {},
        price: {},
        stock: {},
        description: {},
      },
      validationEmpty: {
        code: {},
        name: {},
        cost: {},
        price: {},
        stock: {},
        description: {},
      },
      item: {},
    };
  },
  watch: {
    item_selected() {
      this.copyOriginalItem();
    },
  },
  methods: {
    copyOriginalItem(){
      this.item = JSON.parse(JSON.stringify(this.item_selected));
    },
    validateForm() {
      this.validateCode();
      this.validateName();
      this.validatePrice();
      this.validateCost();
      this.validateStock();
      this.validateDescription();

      var result =
        this.validation.code.isValid &&
        this.validation.name.isValid &&
        this.validation.price.isValid &&
        this.validation.cost.isValid &&
        this.validation.stock.isValid &&
        this.validation.description.isValid;
      return result;
    },
    validateCode() {
      this.validation.code = this.validationRequiredText(this.item.code, 3, 10);
    },
    validateName() {
      this.validation.name = this.validationRequiredText(this.item.name, 3, 50);
    },
    validatePrice() {
      this.validation.price = this.validationRequiredText(this.item.price, 3, 15);
    },
    validateCost() {
      this.validation.cost = this.validationRequiredText(this.item.cost, 3, 15);
    },
    validateStock() {
      this.validation.stock = this.validationRequiredNumber(this.item.stock);
    },
    validateDescription() {
      this.validation.description = this.validationNoRequiredText(this.item.description, 3, 50);
    },

    inputCode() {
      this.validateCode();
    },
    inputName() {
      this.validateName();
    },
    inputPrice() {
      this.item.price = this.item.price.replace(/[^0-9]/, "");
      this.item.price = this.changeCurrency(this.item.price);
      this.validatePrice();
    },
    inputCost() {
      this.item.cost = this.item.cost.replace(/[^0-9]/, "");
      this.item.cost = this.changeCurrency(this.item.cost);
      this.validateCost();
    },
    inputStock() {
      this.item.stock = this.item.stock.replace(/[^0-9]/, "");
      this.validateStock();
    },
    inputDescription() {
      this.validateDescription();
    },

    async saveItem() {
      if (this.validateForm()) {
        if (this.textEmpty(this.item.description, "")) this.item.description = "Ninguna";
        var form_data = new FormData();
        for (var key in this.item) {
          if (this.mode == 3 && (key == "id" || key == "created_at" || key == "updated_at" || key == "product_image")) {
            console.log("key ->" + key);
            continue;
          }
          form_data.append(key, this.item[key]);
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
          title: "Ocurrió un error",
          message: "Datos no válidos, revise si todos los campos se llenaron correctamente.",
          type: 2,
        });
      }
    },
    addItem(data) {
      var path = url + `products/products/`;
      axios
        .post(path, data)
        .then((response) => {
          this.showToast({
            title: "Operación exitosa",
            message: "El registro se agrego correctamente.",
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
    editItem(data) {
      console.log(data);
      var path = url + `products/products/` + this.item.id + "/";
      axios
        .put(path, data)
        .then((response) => {
          this.showToast({
            title: "Operación exitosa",
            message: "El registro se edito correctamente.",
            type: 1,
          });
          this.getProductsNew("1");
          this.closeModal();
        })
        .catch(() => {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se pudo editar el registro, si continúa sucediendo contacte con su proveedor.",
            type: 2,
          });
        });
    },
    changeMode(mode) {
      this.validation = JSON.parse(JSON.stringify(this.validationEmpty));
      this.copyOriginalItem();
      switch (mode) {
        case 1:
          this.title = "Agregar Producto";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Producto";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Producto";
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
    viewMode() {
      this.changeMode(2);
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
  },
});
</script>
