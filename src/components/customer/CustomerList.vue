<script>
import CustomerDetail from "./CustomerDetail.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionCustomer from "@/mixin/conections/ConectionCustomer";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Customer",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      search: "",
      filter: "",
      numPag: 0,
      page: 1,
      table: {
        columns: [
          {
            label: "Nombre",
            field: "name",
          },
          {
            label: "Tipo",
            field: "documentType",

            display: (row) => {
              return this.getDocumentType(row.documentType);
            },
          },
          {
            label: "Document",
            field: "document",
          },

          {
            label: "Telefono",
            field: "phone",
          },
          {
            label: "Actualizado",
            field: "updated_at",

            display: (row) => {
              return this.timeAgo(row.updated_at);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "1%",
            sortable: false,
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      loadingContentSystem: true,
      loadingContentList: false,
      topbar: {
        title: "Clientes",
        icon: "bi bi-people",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Clientes",
            link: "",
          },
        ],
      },
    };
  },

  watch: {
    search(newSearch, oldSearch) {
      this.page = 1;
      if (newSearch.length >= 2) {
        if (newSearch.length > oldSearch.length && this.update) {
          this.filter = `${this.page}&search_query=${this.search}`;
          this.getCustomers(this.filter);
        } else {
          this.update = true;
        }
      } else {
        if (newSearch.length === 0) {
          this.getCustomers(this.page);
        }
      }
    },
  },
  mixins: [UtilityFunctions, ConectionCustomer],
  components: {
    CustomerDetail,
    TableLite,
    ListContent,
    SystemContent,
    paginate: Paginate,
  },
  props: ["changeTopbar"],
  async created() {
    this.changeTopbar(this.topbar);
    await this.getCustomers(1);
  },
  methods: {
    onAdd() {
      this.getCustomers(1);
    },
    onEdit() {
      this.getCustomers(this.page);
    },
    onDelete() {
      this.getCustomers(1);
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
      this.confirmDeleteCustomerRegister(row.id).then((response) => {
        if (response.success) {
          this.getCustomers(1);
        }
      });
    },
    async getCustomers(page) {
      this.loadingContentList = true;
      this.table.rows = [];
      this.getCustomerRegisters(page).then((response) => {
        if (response.success) {
          response.response.data.results.forEach((element) => {
            this.table.rows.push(element);
            this.table.totalRecordCount = this.table.rows.length;
            this.numPag = Math.ceil(response.response.data.count / 10);
          });
          this.page = page;
          this.loadingContentSystem = false;
          this.loadingContentList = false;
        }
      });
    },
    clickCallback(pageNum) {
      this.page = pageNum;
      if (this.search == "") {
        this.getCustomers(pageNum);
      } else {
        this.filter = pageNum + "&search_query=" + this.search;
        this.getCustomers(this.filter);
      }
    },
    filterTable() {
      this.page = 1;
      this.filter = this.search ? `${this.page}&search_query=${this.search}` : this.page;
      this.getCustomers(this.filter);
    },
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <CustomerDetail
      ref="modal"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getIdUrl"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Cliente
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control input-search"
            id="name"
            name="name"
            placeholder="Buscar..."
            v-model="search"
            required
          />
          <button class="btn btn-secondary" type="button" @click="filterTable">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <ListContent ref="tableContent" :loading="this.loadingContentList" :size="table.rows.length">
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
            <button v-on:click.stop="buttonView(data.value)" type="button" class="btn btn-secondary btn-sm me-1">
              <i class="bi bi-journal-text"></i>
            </button>
            <button v-on:click.stop="buttonDelete(data.value)" type="button" class="btn btn-danger btn-sm">
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
      >
      </paginate>
    </ListContent>
  </SystemContent>
</template>

<style scoped></style>
