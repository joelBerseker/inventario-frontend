<template>
  <MyModal ref="myModal" :id="'supplierDetailModal'" :title="this.title">
    <div class="modal-body">
      <MyForm class="mb-3" name="Nombre" :message="validationName.validationMessage">
        <input type="text" :class="'form-control form-control-sm ' + validationName.validationStyle" id="name" name="name"
          :disabled="disabled" v-model="item_selected.name" required />
      </MyForm>
      <div class="row">
        <div class="col-4">
          <MyForm class="mb-3" name="Tipo de documento" :message="validationDocumentType.validationMessage">
            <select :class="'form-control form-control-sm ' + validationDocumentType.validationStyle" id="documentType"
              name="documentType" :disabled="disabled" v-model="item_selected.documentType" required>
              <option v-for="option in options" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </MyForm>
        </div>
        <div class="col">
          <MyForm class="mb-3" name="Documento" :message="validationDocument.validationMessage">
            <input type="text" :class="'form-control form-control-sm ' + validationDocument.validationStyle" id="document"
              name="document" :disabled="disabled" v-model="item_selected.document" required />
          </MyForm>
        </div>
      </div>

      <MyForm class="mb-3" name="Telefono" :message="validationPhone.validationMessage">
        <input type="text" :class="'form-control form-control-sm ' + validationPhone.validationStyle" id="phone"
          name="phone" :disabled="disabled" v-model="item_selected.phone" required />
      </MyForm>
      <MyForm class="mb-3" name="Dirección" :message="validationAddress.validationMessage">
        <input type="text" :class="'form-control form-control-sm ' + validationAddress.validationStyle" id="address"
          name="address" :disabled="disabled" v-model="item_selected.address" required />
      </MyForm>
      <MyForm class="mb-3" name="Correo" :message="validationMail.validationMessage">
        <input type="text" :class="'form-control form-control-sm ' + validationMail.validationStyle" id="mail" name="mail"
          :disabled="disabled" v-model="item_selected.mail" required />
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
import MyModal from "@/components/my_components/MyModal.vue";
import MyForm from "@/components/my_components/MyForm.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  props: ["item_selected", "deleteItem", "showToast", "getCustomers"],
  mixins: [ValidationFunctions],
  components: {
    MyModal,
    MyForm,
    MyForm,
  },
  name: "DetailCustomer",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      errorMessage: {},
      validated: false,
      options: [
        { text: "DNI", value: "1" },
        { text: "RUC", value: "2" },
        { text: "Otro", value: "3" },
      ],
    };
  },

  computed: {
    validateForm: function () {
      var result =
        this.validationName.isValid &&
        this.validationDocumentType.isValid &&
        this.validationDocument.isValid &&
        this.validationPhone.isValid &&
        this.validationAddress.isValid &&
        this.validationMail.isValid
        ;
      return result
    },

    validationName: function () {
      var text = this.item_selected.name;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 3, 50);

      return this.validateInput(text, validationMessage, true);
    },
    validationDocumentType: function () {
      var text = this.item_selected.documentType;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);

      return this.validateInput(text, validationMessage, true);
    },
    validationDocument: function () {
      var text = this.item_selected.document;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 3, 10);

      return this.validateInput(text, validationMessage, true);
    },
    validationPhone: function () {
      var text = this.item_selected.phone;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 9, 9);

      return this.validateInput(text, validationMessage, true);
    },
    validationAddress: function () {
      var text = this.item_selected.address;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 3, 50);

      return this.validateInput(text, validationMessage, true);
    },
    validationMail: function () {
      var text = this.item_selected.mail;

      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, 3, 50);

      return this.validateInput(text, validationMessage, true);
    },

  },
  methods: {
    async saveItem() {
      this.validated = true;
      if (this.validateForm) {
        var form_data = new FormData();
        for (var key in this.item_selected) {
          if (
            this.mode == 3 &&
            (key == "id" ||
              key == "created_at" ||
              key == "updated_at" ||
              key == "supplier_image")
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
      }
    },
    addItem(data) {
      var path = url + `clients/clients/`;
      axios
        .post(path, data)
        .then((response) => {
          this.showToast({
            title: "Agregar Registro",
            message: "Operación exitosa",
            type: 1,
          });
          this.getCustomers(1);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
          this.showToast({
            title: "Agregar Registro",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
    },
    editItem(data) {
      console.log(data);
      var path = url + `clients/clients/` + this.item_selected.id + "/";
      axios
        .put(path, data)
        .then((response) => {
          this.showToast({
            title: "Se edito el registro",
            message: "Operación exitosa",
            type: 1,
          });
          this.getCustomers(1);
          this.closeModal();
        })
        .catch(() => {
          this.showToast({
            title: "Error al editar",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
    },
    changeMode(mode) {
      switch (mode) {
        case 1:
          this.title = "Agregar Cliente";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Cliente";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Cliente";
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
  },
});
</script>
