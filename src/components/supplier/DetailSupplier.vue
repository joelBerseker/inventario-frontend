<template>
  <MyModal ref="myModal" :id="'supplierDetailModal'" :title="this.title">
    <div class="modal-body">
      <MyInput
        class="mb-3"
        name="Nombre"
        type="text"
        v-model="item_selected.name"
        :validation="validation.name"
        :disabled="disabled"
        v-on:input="inputName()"
      />
      <div class="row mb-3">
        <div class="col-4">
          <MySelect
            name="Tipo de documento"
            :validation="validation.documentType"
            :options="options"
            v-model="item_selected.documentType"
            :disabled="disabled"
            v-on:update="inputDocumentType()"
          />
        </div>
        <div class="col">
          <MyInput
            name="Documento"
            type="text"
            v-model="item_selected.document"
            :validation="validation.document"
            :disabled="disabled"
            v-on:input="inputDocument()"
          />
        </div>
      </div>
      <MyInput
        class="mb-3"
        name="Telefono"
        type="text"
        v-model="item_selected.phone"
        :validation="validation.phone"
        :disabled="disabled"
        v-on:input="inputPhone()"
      />
      <MyInput
        class="mb-3"
        name="Dirección"
        type="text"
        v-model="item_selected.address"
        :validation="validation.address"
        :disabled="disabled"
        v-on:input="inputAddress()"
      />
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
</style>
<script>
import axios from "axios";
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MySelect from "@/components/my_components/MySelect.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  props: ["item_selected", "deleteItem", "showToast", "getSuppliers"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MySelect,
    MyInput,
  },
  name: "DetailSupplier",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      validation: {
        name: {},
        documentType: {},
        document: {},
        phone: {},
        address: {},
      },
      validationEmpty: {
        name: {},
        documentType: {},
        document: {},
        phone: {},
        address: {},
      },
      options: [
        { text: "DNI", value: "1" },
        { text: "RUC", value: "2" },
        { text: "Otro", value: "3" },
      ],
    };
  },
  methods: {
    validateForm() {
      this.validateName();
      this.validateDocumentType();
      this.validateDocument();
      this.validatePhone();
      this.validateAddress();

      var result =
        this.validation.name.isValid &&
        this.validation.documentType.isValid &&
        this.validation.document.isValid &&
        this.validation.phone.isValid &&
        this.validation.address.isValid;
      return result;
    },

    validateName() {
      this.validation.name = this.validationRequiredText(this.item_selected.name, 3, 50);
    },
    validateDocumentType() {
      this.validation.documentType = this.validationRequiredSelect(this.item_selected.documentType);
    },
    validateDocument() {
      this.validation.document = this.validationRequiredText(this.item_selected.document, 3, 10);
    },
    validatePhone() {
      this.validation.phone = this.validationRequiredText(this.item_selected.phone, 9, 9);
    },
    validateAddress() {
      this.validation.address = this.validationRequiredText(this.item_selected.address, 3, 50);
    },

    inputName() {
      this.validateName();
    },
    inputDocumentType() {
      this.validateDocumentType();
    },
    inputDocument() {
      this.validateDocument();
    },
    inputPhone() {
      var aux = this.item_selected.phone;
      this.item_selected.phone = this.inputOnlyNumber(this.item_selected.phone);
      if (aux == this.item_selected.phone) {
        this.validatePhone();
      }
    },
    inputAddress() {
      this.validateAddress();
    },

    async saveItem() {
      if (this.validateForm()) {
        var form_data = new FormData();
        for (var key in this.item_selected) {
          if (
            this.mode == 3 &&
            (key == "id" || key == "created_at" || key == "updated_at" || key == "supplier_image")
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
          title: "Ocurrió un error",
          message: "Datos no válidos, revise si todos los campos se llenaron correctamente.",
          type: 2,
        });
      }
    },
    addItem(data) {
      var path = url + `providers/providers/`;
      axios
        .post(path, data)
        .then((response) => {
          this.showToast({
            title: "Operación exitosa",
            message: "El registro se agrego correctamente.",
            type: 1,
          });
          this.getSuppliers(1);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
          this.showToast({
            title: "Ocurrió un error",
            message: "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
            type: 2,
          });
        });
    },
    editItem(data) {
      console.log(data);
      var path = url + `providers/providers/` + this.item_selected.id + "/";
      axios
        .put(path, data)
        .then((response) => {
          this.showToast({
            title: "Operación exitosa",
            message: "El registro se edito correctamente.",
            type: 1,
          });
          this.getSuppliers(1);
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
      switch (mode) {
        case 1:
          this.title = "Agregar Proveedor";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Proveedor";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Proveedor";
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
      this.$refs.myModal.openModal();
    },
  },
});
</script>
