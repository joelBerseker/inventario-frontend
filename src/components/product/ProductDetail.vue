<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title">
    <div class="modal-body">
      <div class="row mb-3">
        <div class="col-4">
          <MyInput
            type="text"
            name="Código"
            :validation="validation.code"
            v-model="itemCopy.code"
            :disabled="disabled"
            v-on:input="inputCode()"
          />
        </div>
        <div class="col">
          <MyInput
            type="text"
            name="Nombre"
            :validation="validation.name"
            v-model="itemCopy.name"
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
            v-model="itemCopy.cost"
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
            v-model="itemCopy.price"
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
            v-model="itemCopy.stock"
            :disabled="disabled"
            v-on:input="inputStock()"
          />
        </div>
      </div>
      <MyInput
        type="textarea"
        name="Descripción"
        :validation="validation.description"
        v-model="itemCopy.description"
        :disabled="disabled"
        v-on:input="inputDescription()"
      />
    </div>
    <div class="modal-footer">
      <button type="button" @click="buttonDelete" class="btn btn-danger btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-trash"></i>
        Eliminar
      </button>
      <button type="button" @click="buttonEdit" class="btn btn-primary btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-pen"></i>
        Editar
      </button>
      <button type="button" @click="buttonCancel" class="btn btn-secondary btn-sm button-margin" v-if="mode == 3">
        <i class="bi bi-arrow-left-circle"></i>
        Cancelar
      </button>
      <button type="button" @click="buttonSave" class="btn btn-primary btn-sm button-margin" v-if="mode != 2">
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
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import ConectionProduct from "@/mixin/conections/ConectionProduct";
export default defineComponent({
  props: ["itemSelected"],
  mixins: [ValidationFunctions, ConectionProduct],
  inject: ["confirmDialogue", "showToast"],
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
      itemCopy: {},
    };
  },
  watch: {
    itemSelected() {
      this.resetItemCopy();
    },
  },
  methods: {
    resetItemCopy() {
      this.itemCopy = JSON.parse(JSON.stringify(this.itemSelected));
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
      this.validation.code = this.validationRequiredText(this.itemCopy.code, 3, 10);
    },
    validateName() {
      this.validation.name = this.validationRequiredText(this.itemCopy.name, 3, 50);
    },
    validatePrice() {
      this.validation.price = this.validationRequiredText(this.itemCopy.price, 3, 15);
    },
    validateCost() {
      this.validation.cost = this.validationRequiredText(this.itemCopy.cost, 3, 15);
    },
    validateStock() {
      this.validation.stock = this.validationRequiredNumber(this.itemCopy.stock);
    },
    validateDescription() {
      this.validation.description = this.validationNoRequiredText(this.itemCopy.description, 3, 50);
    },

    inputCode() {
      this.validateCode();
    },
    inputName() {
      this.validateName();
    },
    inputPrice() {
      this.itemCopy.price = this.itemCopy.price.replace(/[^0-9]/, "");
      this.itemCopy.price = this.changeCurrency(this.itemCopy.price);
      this.validatePrice();
    },
    inputCost() {
      this.itemCopy.cost = this.itemCopy.cost.replace(/[^0-9]/, "");
      this.itemCopy.cost = this.changeCurrency(this.itemCopy.cost);
      this.validateCost();
    },
    inputStock() {
      this.itemCopy.stock = this.itemCopy.stock.replace(/[^0-9]/, "");
      this.validateStock();
    },
    inputDescription() {
      this.validateDescription();
    },

    buttonSave() {
      if (this.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addProductRegister(this.itemCopy).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;
          case 3:
            this.editProductRegister(this.itemCopy).then((response) => {
              if (response.success) {
                this.$emit("item:edit");
                this.closeModal();
              }
            });
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
    buttonEdit() {
      this.changeMode(3);
    },
    buttonCancel() {
      this.changeMode(2);
    },
    buttonDelete() {
      this.confirmDeleteProductRegister(this.itemCopy.id).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },
    changeMode(mode) {
      this.mode = mode;
      this.validation = JSON.parse(JSON.stringify(this.validationEmpty));
      this.resetItemCopy();
      switch (this.mode) {
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
    },
    closeModal() {
      try {
        this.$refs.myModal.closeModal();
      } catch (error) {}
    },
    openModal() {
      this.$refs.myModal.openModal();
    },
  },
});
</script>
