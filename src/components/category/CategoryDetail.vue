<template>
  <MyModal ref="myModal" :id="'categoryDetailModal'" :title="this.title" v-on:mymodal:close="closeModal">
    <div class="modal-body" :key="item.id.value">
      <MyInput
        class="mb-3"
        type="text"
        name="Nombre"
        :validation="item.name.validation"
        v-model="item.name.value"
        :disabled="disabled"
        v-on:input="inputName()"
      />
      <MyInput
        type="textarea"
        name="Descripción"
        :validation="item.description.validation"
        v-model="item.description.value"
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
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import ConectionCategory from "@/mixin/conections/ConectionCategory";
import { ModelCategory } from "@/mixin/models/ModelCategory";
export default defineComponent({
  mixins: [ValidationFunctions, ConectionCategory],
  inject: ["confirmDialogue", "showToast"],
  components: {
    MyModal,
    MyInput,
  },
  name: "Category",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      item: new ModelCategory(),
      itemBackup: {},
    };
  },
  methods: {
    inputName() {
      this.item.validateName();
    },
    inputDescription() {
      this.item.validateDescription();
    },
    buttonSave() {
      if (this.item.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addCategoryRegister(this.item.getToAdd()).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;
          case 3:
            this.editCategoryRegister(this.item.getToEdit()).then((response) => {
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
      this.confirmDeleteCategoryRegister(this.item.id.value).then((response) => {
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
          this.title = "Agregar Categoria";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Categoria";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Categoria";
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
      this.getCategoryRegister(id).then((response) => {
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
  created() {},
});
</script>
