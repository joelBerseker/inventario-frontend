<template>
  <MyModal ref="myModal" :id="'expenseCategoryDetailModal'" :title="title" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <MyInput
        class="mb-3"
        name="Nombre"
        type="text"
        v-model="item.name.value"
        :validation="item.name.validation"
        :disabled="disabled"
        v-on:input="item.onChangeName()"
      />

      <MyInput
        name="Descripción"
        type="textarea"
        v-model="item.description.value"
        :validation="item.description.validation"
        :disabled="disabled"
        v-on:input="item.onChangeDescription()"
      />
    </div>

    <div class="modal-footer">
      <button type="button" @click="buttonDelete" class="btn btn-danger btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-trash"></i> Eliminar
      </button>
      <button type="button" @click="buttonEdit" class="btn btn-primary btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-pen"></i> Editar
      </button>
      <button type="button" @click="buttonCancel" class="btn btn-secondary btn-sm button-margin" v-if="mode == 3">
        <i class="bi bi-arrow-left"></i> Cancelar
      </button>
      <button type="button" @click="buttonSave" class="btn btn-primary btn-sm button-margin" v-if="mode != 2">
        <i class="bi bi-check-lg"></i> Guardar
      </button>
    </div>
  </MyModal>
</template>

<script>
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import ConectionExpenseCategory from "@/mixin/conections/ConectionExpenseCategory";
import { ModelExpenseCategory } from "@/mixin/models/ModelExpenseCategory";

export default defineComponent({
  name: "ExpenseCategoryDetail",
  mixins: [ConectionExpenseCategory],
  inject: ["confirmDialogue", "showToast"],
  components: { MyModal, MyInput },
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      item: new ModelExpenseCategory(),
      itemBackup: {},
    };
  },
  methods: {
    buttonSave() {
      if (!this.item.validateForm()) {
        this.showToast({
          title: "Ocurrió un error",
          message: "Datos no válidos.",
          type: 2,
        });
        return;
      }

      if (this.mode === 1) {
        this.addExpenseCategoryRegister(this.item.getToAdd()).then((response) => {
          if (response.success) {
            this.$emit("item:add");
            this.closeModal();
          }
        });
      }

      if (this.mode === 3) {
        this.editExpenseCategoryRegister(this.item.getToEdit()).then((response) => {
          if (response.success) {
            this.$emit("item:edit");
            this.closeModal();
          }
        });
      }
    },

    buttonDelete() {
      this.confirmDeleteExpenseCategoryRegister(this.item.id.value).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },

    buttonEdit() {
      this.changeMode(3);
    },

    buttonCancel() {
      this.item.setFromData(this.itemBackup);
      this.changeMode(2);
    },

    changeMode(mode) {
      this.mode = mode;
      this.item.resetValidation();

      if (mode === 1) {
        this.title = "Agregar Categoría de Gasto";
        this.disabled = false;
      } else if (mode === 2) {
        this.title = "Visualizar Categoría de Gasto";
        this.disabled = true;
      } else if (mode === 3) {
        this.title = "Editar Categoría de Gasto";
        this.disabled = false;
      }
    },

    openAdd() {
      this.changeMode(1);
      this.itemBackup = {};
      this.item.setFromData({});
      this.openModal();
    },

    openView(data) {
      this.changeMode(2);
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.setFromData(data);
      this.openModal();
    },

    openViewId(id) {
      this.getExpenseCategoryRegister(id).then((response) => {
        if (response.success) this.openView(response.response.data);
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

<style scoped>
.button-margin {
  margin-left: 0.25rem;
  margin-right: 0 !important;
}
</style>