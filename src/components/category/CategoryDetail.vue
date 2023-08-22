<template>
  <MyModal ref="myModal" :id="'categoryDetailModal'" :title="this.title">
    <div class="modal-body">
      <div class="row mb-3">
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
import ConectionCategory from "@/mixin/conections/ConectionCategory";
export default defineComponent({
  props: ["itemSelected"],
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
      validation: {
        name: {},
        description: {},
      },
      validationEmpty: {
        name: {},
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
      this.validateName();
      this.validateDescription();

      var result =
        this.validation.name.isValid &&
        this.validation.description.isValid;
      return result;
    },
    validateName() {
      this.validation.name = this.validationRequiredText(this.itemCopy.name, 3, 50);
    },
    validateDescription() {
      this.validation.description = this.validationNoRequiredText(this.itemCopy.description, 3, 250);
    },

   
    inputName() {
      this.validateName();
    },
    inputDescription() {
      this.validateDescription();
    },

    buttonSave() {
      if (this.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addCategoryRegister(this.itemCopy).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;
          case 3:
            this.editCategoryRegister(this.itemCopy).then((response) => {
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
      this.confirmDeleteCategoryRegister(this.itemCopy.id).then((response) => {
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
