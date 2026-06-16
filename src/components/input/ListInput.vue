<script>
import DetailInput from "./DetailInput.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionInput from "@/mixin/conections/ConectionInput";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Input",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      search: "",
      page: 1,
      numPag: 0,
      filters: {
        specific_date: "",
        start_date: "",
        end_date: "",
        last_days: "",
        last_months: "",
      },
      table: {
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "12%",
            columnClasses: ["no-wrap"],
          },
          {
            label: "Proveedor",
            field: "provider_name",
            width: "22%",
            display: (row) => row?.provider_name || "-",
          },
          {
            label: "Descripción",
            field: "detail",
            width: "28%",
            display: (row) => row?.detail || "-",
          },
          {
            label: "Total",
            field: "total_price",
            width: "14%",
            columnClasses: ["text-end"],
            headerClasses: ["text-end"],
            display: (row) => this.priceCorrect(row?.total_price ?? 0),
          },
          {
            label: "Fecha",
            field: "date",
            width: "16%",
            display: (row) => this.timeAgo(row?.date),
          },
          {
            label: " ",
            field: "quick",
            width: "8%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      topbar: {
        title: "Entradas",
        icon: "bi bi-box-arrow-in-right",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Entradas",
            link: "",
          },
        ],
      },
      loadingContentSystem: true,
      loadingContentList: false,
    };
  },

  mixins: [UtilityFunctions, ConectionInput],

  components: {
    DetailInput,
    TableLite,
    paginate: Paginate,
    SystemContent,
    ListContent,
  },

  props: ["changeTopbar"],

  methods: {
    onAdd() {
      this.getInputs(1);
    },

    onEdit() {
      this.getInputs(this.page);
    },

    onDelete() {
      this.getInputs(1);
    },

    getIdUrl() {
      if (this.$route.query.id != undefined) {
        this.$refs.modal.openViewId(this.$route.query.id);
      }
    },

    buttonAdd() {
      this.$refs.modal.openAdd();
    },

    buttonView(row) {
      this.$refs.modal.openView(row);
    },

    async buttonDelete(row) {
      this.confirmDeleteInputRegister(row.id).then((response) => {
        if (response.success) {
          this.getInputs(1);
        }
      });
    },

    async getInputs(page = 1) {
      this.loadingContentList = true;
      this.table.rows = [];

      const params = { page };

      if (this.filters.specific_date) params.specific_date = this.filters.specific_date;
      if (this.filters.start_date) params.start_date = this.filters.start_date;
      if (this.filters.end_date) params.end_date = this.filters.end_date;
      if (this.filters.last_days) params.last_days = this.filters.last_days;
      if (this.filters.last_months) params.last_months = this.filters.last_months;

      this.getInputRegisters(params).then((response) => {
        if (response.success) {
          const payload = response.response.data;

          this.table.rows = payload.results || [];
          this.table.totalRecordCount = payload.count || 0;
          this.numPag = Math.ceil((payload.count || 0) / 10);
          this.page = page;
        }

        this.loadingContentSystem = false;
        this.loadingContentList = false;
      });
    },

    clickCallback(pageNum) {
      this.page = pageNum;
      this.getInputs(pageNum);
    },

    filterTable() {
      this.page = 1;
      this.getInputs(1);
    },

    resetFiltersToToday() {
      this.filters = {
        specific_date: "",
        start_date: "",
        end_date: "",
        last_days: "",
        last_months: "",
      };
      this.search = "";
      this.getInputs(1);
    },
  },

  async created() {
    this.changeTopbar(this.topbar);
    await this.getInputs(1);
  },
});
</script>

<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <DetailInput
      ref="modal"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getIdUrl"
    />

    <div class="row justify-content-md-end mb-3">
      <div class="col-12 col-md-4">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Entrada
        </button>
      </div>

      <div class="col-12 col-md-8">
        <div class="row g-2 mb-2">
          <div class="col-md-3">
            <label class="form-label small mb-1">Fecha exacta</label>
            <input type="date" class="form-control form-control-sm" v-model="filters.specific_date" />
          </div>

          <div class="col-md-3">
            <label class="form-label small mb-1">Desde</label>
            <input type="date" class="form-control form-control-sm" v-model="filters.start_date" />
          </div>

          <div class="col-md-3">
            <label class="form-label small mb-1">Hasta</label>
            <input type="date" class="form-control form-control-sm" v-model="filters.end_date" />
          </div>

          <div class="col-md-3 d-flex align-items-end gap-2">
            <button class="btn btn-primary btn-sm w-100" @click="filterTable">
              Buscar
            </button>
            <button class="btn btn-secondary btn-sm w-100" @click="resetFiltersToToday">
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <ListContent ref="tableContent" :loading="loadingContentList" :size="table.rows.length">
      <table-lite
        class="mb-3 w-100"
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
            <button
              v-on:click.stop="buttonView(data.value)"
              type="button"
              class="btn btn-secondary btn-sm me-1"
            >
              <i class="bi bi-journal-text"></i>
            </button>

            <button
              v-on:click.stop="buttonDelete(data.value)"
              type="button"
              class="btn btn-danger btn-sm"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </table-lite>

      <paginate
        v-if="numPag > 1"
        v-model="page"
        :page-count="numPag"
        :page-range="3"
        :margin-pages="2"
        :click-handler="clickCallback"
        :prev-text="'Anterior'"
        :next-text="'Siguiente'"
        :container-class="'pagination pagination-sm'"
        :page-class="'page-item'"
      />
    </ListContent>
  </SystemContent>
</template>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>