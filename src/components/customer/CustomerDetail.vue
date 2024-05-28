<template>
  <MyModal ref="myModal" :id="'supplierDetailModal'" :title="this.title" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <MyInput
        class="mb-3"
        name="Nombre"
        type="text"
        v-model="item.name.value"
        :validation="item.name.validation"
        :disabled="disabled"
        v-on:input="inputName()"
      />
      <div class="row mb-3">
        <div class="col-6">
          <MySelect
            name="Tipo de documento"
            :validation="item.documentType.validation"
            :options="optionsDocumentType"
            v-model="item.documentType.value"
            :disabled="disabled"
            v-on:update="inputDocumentType()"
          />
        </div>
        <div class="col-6">
          <MyInput
            name="Documento"
            type="text"
            v-model="item.document.value"
            :validation="item.document.validation"
            :disabled="disabled"
            v-on:input="inputDocument()"
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6">
          <MyInput
            name="Telefono"
            type="text"
            v-model="item.phone.value"
            :validation="item.phone.validation"
            :disabled="disabled"
            v-on:input="inputPhone()"
          />
        </div>
        <div class="col-6">
          <MyInput
            name="Dirección"
            type="text"
            v-model="item.address.value"
            :validation="item.address.validation"
            :disabled="disabled"
            v-on:input="inputAddress()"
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6">
          <MyInput
            name="Correo Electronico"
            type="text"
            v-model="item.mail.value"
            :validation="item.mail.validation"
            :disabled="disabled"
            v-on:input="inputMail()"
          />
        </div>
      </div>
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
import { ModelCustomer } from "@/mixin/models/ModelCustomer";
export default defineComponent({
  name: "CustomerDetail",
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
      item: new ModelCustomer(),
      itemBackup: {},
    };
  },
  methods: {
    inputName() {
      this.item.onChangeName();
    },
    inputDocumentType() {
      this.item.onChangeDocumentType();
    },
    inputDocument() {
      this.item.onChangeDocument();
    },
    inputPhone() {
      this.item.onChangePhone();
    },
    inputAddress() {
      this.item.onChangeAddress();
    },
    inputMail() {
      this.item.onChangeMail();
    },
    buttonSave() {
      if (this.item.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addCustomerRegister(this.item.getToAdd()).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;
          case 3:
            this.editCustomerRegister(this.item.getToEdit()).then((response) => {
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
      this.item.setFromData(this.itemBackup);
      this.changeMode(2);
    },
    buttonDelete() {
      this.confirmDeleteCustomerRegister(this.item.id.value).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },
    changeMode(mode) {
      this.mode = mode;
      this.item.resetValidation();
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
    openAdd() {
      this.changeMode(1);
      this.openModal();
      this.itemBackup = {};
      this.item.setFromData({});
    },
    openView(data) {
      this.changeMode(2);
      this.openModal();
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.setFromData(data);
    },
    openViewId(id) {
      this.getCustomerRegister(id).then((response) => {
        if (response.success) {
          this.openView(response.response.data);
        }
      });
    },
    closeModal() {
      this.$refs.myModal.closeModal();
    },
    openModal() {
      this.$refs.myModal.openModal();
    },
  },
});
</script>
