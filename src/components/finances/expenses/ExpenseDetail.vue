<template>
  <MyModal ref="myModal" :id="'expenseDetailModal'" :title="title" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <MyInput
        class="mb-3"
        name="Descripción"
        type="text"
        v-model="item.description.value"
        :validation="item.description.validation"
        :disabled="disabled"
        v-on:input="item.onChangeDescription()"
      />

      <div class="row mb-3">
        <div class="col-6">
          <MyInput
            name="Monto"
            type="number"
            v-model="item.amount.value"
            :validation="item.amount.validation"
            :disabled="disabled"
            v-on:input="item.onChangeAmount()"
          >
            <template v-slot:pre>S/.</template>
          </MyInput>
        </div>

        <div class="col-6">
          <MyInput
            name="Fecha"
            type="date"
            v-model="item.expense_date.value"
            :validation="item.expense_date.validation"
            :disabled="disabled"
            v-on:input="item.onChangeDate()"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-6">
          <MySelect
            name="Método de pago"
            :options="paymentOptions"
            v-model="item.payment_method.value"
            :validation="item.payment_method.validation"
            :disabled="disabled"
            v-on:update="item.onChangePaymentMethod()"
          />
        </div>

        <div class="col-6">
          <SelectSearch
            name="Categoría"
            link="finances/expense-categories/"
            v-model="item.category.value"
            :validation="item.category.validation"
            :disabled="disabled"
            v-on:update:modelValue="item.onChangeCategory()"
            id="expense-category"
          />
        </div>
      </div>

      <MyInput
        class="mb-3"
        name="Notas (opcional)"
        type="textarea"
        v-model="item.notes.value"
        :validation="item.notes.validation"
        :disabled="disabled"
        v-on:input="item.onChangeNotes()"
      />

      <div class="mb-3" v-if="!disabled">
        <label class="form-label">Evidencia (opcional)</label>
        <input class="form-control" type="file" @change="handleFileChange" :disabled="disabled" />
      </div>
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
import MySelect from "@/components/my_components/MySelect.vue";
import SelectSearch from "@/components/my_other_components/SelectSearch.vue";
import ConectionExpense from "@/mixin/conections/ConectionExpense";
import { ModelExpense } from "@/mixin/models/ModelExpense";

export default defineComponent({
  name: "ExpenseDetail",
  mixins: [ConectionExpense],
  inject: ["confirmDialogue", "showToast"],
  components: { MyModal, MyInput, MySelect, SelectSearch },
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      item: new ModelExpense(),
      itemBackup: {},
      paymentOptions: [
        { value: "1", text: "Efectivo" },
        { value: "2", text: "Yape" },
        { value: "3", text: "Plin" },
        { value: "4", text: "Transferencia" },
        { value: "5", text: "Tarjeta" },
        { value: "6", text: "Otro" },
      ],
    };
  },
  methods: {
    handleFileChange(event) {
      this.item.evidence.value = event.target.files[0] || null;
    },

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
        this.addExpenseRegister(this.item.getToAdd()).then((response) => {
          if (response.success) {
            this.$emit("item:add");
            this.closeModal();
          }
        });
      }

      if (this.mode === 3) {
        this.editExpenseRegister(this.item.getToEdit()).then((response) => {
          if (response.success) {
            this.$emit("item:edit");
            this.closeModal();
          }
        });
      }
    },

    buttonDelete() {
      this.confirmDeleteExpenseRegister(this.item.id.value).then((response) => {
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
        this.title = "Agregar Gasto";
        this.disabled = false;
      } else if (mode === 2) {
        this.title = "Visualizar Gasto";
        this.disabled = true;
      } else if (mode === 3) {
        this.title = "Editar Gasto";
        this.disabled = false;
      }
    },

    openAdd() {
      this.changeMode(1);
      this.itemBackup = {};
      this.item.setFromData({
        expense_date: new Date().toISOString().slice(0, 10),
        payment_method: 1,
      });
      this.openModal();
    },

    openView(data) {
      this.changeMode(2);
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.setFromData(data);
      this.openModal();
    },

    openViewId(id) {
      this.getExpenseRegister(id).then((response) => {
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