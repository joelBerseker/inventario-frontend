<template>
  <SystemContent :loading="loadingContentSystem">
    <ExpenseCategoryDetail
      ref="modal"
      v-on:item:add="getCategories(1)"
      v-on:item:edit="getCategories(page)"
      v-on:item:delete="getCategories(1)"
    />

    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="$refs.modal.openAdd()" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Categoría
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
import ExpenseCategoryDetail from "./ExpenseCategoryDetail.vue";
import ConectionExpenseCategory from "@/mixin/conections/ConectionExpenseCategory";

export default defineComponent({
  name: "ExpenseCategoryList",
  mixins: [ConectionExpenseCategory],
  inject: ["confirmDialogue", "showToast"],
  components: {
    TableLite,
    SystemContent,
    ListContent,
    ExpenseCategoryDetail,
  },
  props: ["changeTopbar"],
  data() {
    return {
      page: 1,
      loadingContentSystem: true,
      loadingContentList: false,
      topbar: {
        title: "Categorías de Gasto",
        icon: "bi bi-tags",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Categorías de Gasto", link: "" },
        ],
      },
      table: {
        columns: [
          { label: "Nombre", field: "name", width: "30%" },
          { label: "Descripción", field: "description", width: "60%" },
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
      this.confirmDeleteExpenseCategoryRegister(row.id).then((response) => {
        if (response.success) this.getCategories(1);
      });
    },

    getCategories(page) {
      this.loadingContentList = true;
      this.table.rows = [];

      this.getExpenseCategoryRegisters(page).then((response) => {
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
    this.getCategories(1);
  },
});
</script>