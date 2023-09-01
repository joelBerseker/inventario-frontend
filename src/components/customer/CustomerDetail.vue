<template>
  <MyModal ref="myModal" :id="'supplierDetailModal'" :title="this.title">
    <div class="modal-body">
      <MyInput
        class="mb-3"
        name="Nombre"
        type="text"
        v-model="itemCopy.name"
        :validation="validation.name"
        :disabled="disabled"
        v-on:input="inputName()"
      />
      <div class="row mb-3">
        <div class="col-4">
          <MySelect
            name="Tipo de documento"
            :validation="validation.documentType"
            :options="optionsDocumentType"
            v-model="itemCopy.documentType"
            :disabled="disabled"
            v-on:update="inputDocumentType()"
          />
        </div>
        <div class="col">
          <MyInput
            name="Documento"
            type="text"
            v-model="itemCopy.document"
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
        v-model="itemCopy.phone"
        :validation="validation.phone"
        :disabled="disabled"
        v-on:input="inputPhone()"
      />
      <MyInput
        class="mb-3"
        name="Dirección"
        type="text"
        v-model="itemCopy.address"
        :validation="validation.address"
        :disabled="disabled"
        v-on:input="inputAddress()"
      />
      <MyInput
        class="mb-3"
        name="Correo Electronico"
        type="text"
        v-model="itemCopy.mail"
        :validation="validation.mail"
        :disabled="disabled"
        v-on:input="inputMail()"
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
        <i class="bi bi-arrow-left"></i>
        Cancelar
      </button>
      <button type="button" @click="buttonSave" class="btn btn-primary btn-sm button-margin" v-if="mode != 2">
        <i class="bi bi-check-lg"></i>
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
import MySelect from "@/components/my_components/MySelect.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionCustomer from "@/mixin/conections/ConectionCustomer";

export default defineComponent({
  name: "CustomerDetail",
  props: ["itemSelected"],
  mixins: [ValidationFunctions, UtilityFunctions, ConectionCustomer],
  inject: ["confirmDialogue", "showToast"],
  components: {
    MyModal,
    MyInput,
    MySelect,
  },
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
        mail: {},
      },
      validationEmpty: {
        name: {},
        documentType: {},
        document: {},
        phone: {},
        address: {},
        mail: {},
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
      console.log(this.itemSelected);
      this.itemCopy = JSON.parse(JSON.stringify(this.itemSelected));
    },
    validateForm() {
      this.validateName();
      this.validateDocumentType();
      this.validateDocument();
      this.validatePhone();
      this.validateAddress();
      this.validateMail();

      var result =
        this.validation.name.isValid &&
        this.validation.documentType.isValid &&
        this.validation.document.isValid &&
        this.validation.phone.isValid &&
        this.validation.address.isValid &&
        this.validation.mail.isValid;
      return result;
    },

    validateName() {
      this.validation.name = this.validationRequiredText(this.itemCopy.name, 3, 50);
    },
    validateDocumentType() {
      this.validation.documentType = this.validationRequiredSelect(this.itemCopy.documentType);
    },
    validateDocument() {
      this.validation.document = this.validationRequiredText(this.itemCopy.document, 3, 10);
    },
    validatePhone() {
      this.validation.phone = this.validationRequiredText(this.itemCopy.phone, 9, 9);
    },
    validateAddress() {
      this.validation.address = this.validationRequiredText(this.itemCopy.address, 3, 50);
    },
    validateMail() {
      this.validation.mail = this.validationRequiredText(this.itemCopy.mail, 3, 50);
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
      var aux = this.itemCopy.phone;
      this.itemCopy.phone = this.inputOnlyNumber(this.itemCopy.phone);
      if (aux == this.itemCopy.phone) {
        this.validatePhone();
      }
    },
    inputAddress() {
      this.validateAddress();
    },
    inputMail() {
      this.validateMail();
    },
    buttonSave() {
      if (this.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addCustomerRegister(this.itemCopy).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;
          case 3:
            this.editCustomerRegister(this.itemCopy).then((response) => {
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
      this.confirmDeleteCustomerRegister(this.itemCopy.id).then((response) => {
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
