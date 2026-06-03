<template>
  <SystemContent :loading="loadingContentSystem">
    <ExpenseDetail
      ref="modal"
      v-on:item:add="getExpenses(1)"
      v-on:item:edit="getExpenses(page)"
      v-on:item:delete="getExpenses(1)"
    />

    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="$refs.modal.openAdd()" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Gasto
        </button>
      </div>
    </div>

    <ListContent :loading="loadingContentList" :size="table.rows.length">
      <table-lite
        class="mb-3"
        :is-static-mode="false"
        :is-slot-mode="true"
        :is-hide-paging="true"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
        @row-clicked="buttonView"
      >
        <template v-slot:quick="data">
          <div class="d-flex">
            <button class="btn btn-secondary btn-sm me-1" @click.stop="buttonView(data.value)">
              <i class="bi bi-journal-text"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click.stop="buttonDelete(data.value)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </table-lite>
    </ListContent>
  </SystemContent>
</template>

<script>
import { defineComponent } from "vue";
import TableLite from "vue3-table-lite";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import ExpenseDetail from "./ExpenseDetail.vue";
import ConectionExpense from "@/mixin/conections/ConectionExpense";
import UtilityFunctions from "@/mixin/UtilityFunctions";

export default defineComponent({
  name: "ExpenseList",
  mixins: [ConectionExpense, UtilityFunctions],
  inject: ["confirmDialogue", "showToast"],
  components: {
    TableLite,
    SystemContent,
    ListContent,
    ExpenseDetail,
  },
  props: ["changeTopbar"],
  data() {
    return {
      page: 1,
      loadingContentSystem: true,
      loadingContentList: false,
      topbar: {
        title: "Gastos",
        icon: "bi bi-cash-stack",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Gastos", link: "" },
        ],
      },
      table: {
        columns: [
          { label: "Descripción", field: "description", width: "25%" },
          { label: "Categoría", field: "category_name", width: "20%" },
          {
            label: "Monto",
            field: "amount",
            width: "12%",
            headerClasses: ["text-end"],
            columnClasses: ["text-end"],
            display: (row) => this.priceCorrect(row.amount),
          },
          { label: "Método", field: "payment_method_label", width: "15%" },
          { label: "Fecha", field: "expense_date", width: "18%" },
          { label: "", field: "quick", width: "10%" },
        ],
        rows: [],
        totalRecordCount: 0,
      },
    };
  },
  methods: {
    buttonView(row) {
      this.$refs.modal.openView(row);
    },

    buttonDelete(row) {
      this.confirmDeleteExpenseRegister(row.id).then((response) => {
        if (response.success) this.getExpenses(1);
      });
    },

    getExpenses(page) {
      this.loadingContentList = true;
      this.table.rows = [];

      this.getExpenseRegisters(page).then((response) => {
        if (response.success) {
          const results = response.response.data.results || response.response.data;
          this.table.rows = results;
          this.table.totalRecordCount = results.length;
          this.page = page;
        }

        this.loadingContentSystem = false;
        this.loadingContentList = false;
      });
    },
  },
  created() {
    this.changeTopbar(this.topbar);
    this.getExpenses(1);
  },
});
</script>