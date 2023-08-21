<script>
import CustomerDetail from "./CustomerDetail.vue";
import Content from "@/components/home/Content.vue";
import TableContent from "@/components/home/TableContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import CustomerConection from "./CustomerConection";

const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
  name: "Customer",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      itemSelected: {},
      search: "",
      filter: "",
      numPag: 2,
      page: 1,
      table: {
        columns: [
          {
            label: "Nombre",
            field: "name",
            width: "15%",
          },
          {
            label: "Tipo",
            field: "documentType",
            width: "1%",
            display: (row) => {
              return this.documentType(row.documentType);
            },
          },
          {
            label: "Document",
            field: "document",
            width: "10%",
          },

          {
            label: "Telefono",
            field: "phone",
            width: "10%",
          },
          {
            label: "Dirección",
            field: "address",
            width: "10%",
          },
          {
            label: "Correo",
            field: "mail",
            width: "10%",
          },
          {
            label: "Actualizado",
            field: "updated_at",
            width: "1%",
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
      loading: true,
      loadingTable: false,
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
  mixins: [UtilityFunctions, CustomerConection],
  components: {
    CustomerDetail,
    TableLite,
    TableContent,
    Content,
    paginate: Paginate,
  },
  props: ["changeTopbar"],
  async created() {
    this.changeTopbar(this.topbar);
    if (this.$store.getters.isActive) {
      await this.getCustomers(1);
    }
  },
  mounted() {
    this.getItemSelectedByUrl();
  },
  methods: {
    getItemSelectedByUrl() {
      if (this.$route.query.id != undefined) {
        this.getCustomerRegister(this.$route.query.id).then((response) => {
          if (response.success) {
            setTimeout(() => {
              this.itemSelected = response.response.data;
              this.$refs.modal.changeMode(2);
              this.$refs.modal.openModal();
            }, 700);
          }
        });
      }
    },
    loadingContent(loading) {
      this.$refs.content.loadingContent(loading);
    },
    loadingTableContent(loading) {
      try {
        this.$refs.tableContent.loadingTableContent(loading);
      } catch (error) {}
    },
    buttonAdd() {
      this.itemSelected = {};
      this.$refs.modal.changeMode(1);
      this.$refs.modal.openModal();
    },
    buttonView(row) {
      this.itemSelected = row;
      this.$refs.modal.changeMode(2);
      this.$refs.modal.openModal();
    },
    async buttonDelete(row) {
      this.confirmDeleteCustomerRegister(row.id).then((response) => {
        if (response.success) {
          this.getCustomers(1);
          this.closeModal();
        }
      });
    },
    async getCustomers(page) {
      this.loadingTableContent(true);
      this.table.rows = [];
      this.getCustomerRegisters(page).then((response) => {
        if (response.success) {
          response.response.data.results.forEach((element) => {
            this.table.rows.push(element);
            this.table.totalRecordCount = this.table.rows.length;
            this.numPag = Math.ceil(response.response.data.count / 10);
          });
          this.loadingContent(false);
          this.loadingTableContent(false);
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
  <Content ref="content" :loading="loading">
    <CustomerDetail
      ref="modal"
      :itemSelected="itemSelected"
      :getCustomers="getCustomers"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-circle"></i> Agregar Cliente
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

    <TableContent ref="tableContent" :loading="this.loadingTable" :size="table.rows.length">
      <table-lite
        class="mb-3"
        :is-static-mode="false"
        :is-slot-mode="true"
        :is-hide-paging="true"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
      >
        <template v-slot:quick="data">
          <div class="d-flex">
            <button v-on:click="buttonView(data.value)" type="button" class="btn btn-secondary btn-sm me-1">
              <i class="bi bi-journal"></i>
            </button>
            <button v-on:click="buttonDelete(data.value)" type="button" class="btn btn-danger btn-sm">
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
    </TableContent>
  </Content>
</template>

<style scoped></style>