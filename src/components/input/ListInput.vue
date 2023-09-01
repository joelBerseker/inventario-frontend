<script>
import DetailInput from "./DetailInput.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionInput from "@/mixin/conections/ConectionInput";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Input",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      itemSelected: {},
      Inputs: [],
      search: "",
      table: {
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "5%",
          },
          {
            label: "Proveedor",
            field: "provider_name",
            width: "10%",
          },
          {
            label: "Descripción",
            field: "detail",
            width: "20%",
          },
          {
            label: "Actualizado",
            field: "date",
            width: "10%",
            display: (row) => {
              return this.timeAgo(row.date);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "7%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      numPag: 0,
      page: 1,
      topbar: {
        title: "Entradas",
        icon: "bi bi-box-arrow-left",
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
    getItemSelectedByUrl() {
      if (this.$route.query.id != undefined) {
        this.getInputRegister(this.$route.query.id).then((response) => {
          if (response.success) {
            this.itemSelected = response.response.data;
            this.$refs.modal.changeMode(2);
            this.$refs.modal.openModal();
          }
        });
      }
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
      this.confirmDeleteInputRegister(row.id).then((response) => {
        if (response.success) {
          this.getInputs(1);
        }
      });
    },
    async getInputs(page) {
      this.loadingContentList = true;
      this.table.rows = [];
      this.getInputRegisters(page).then((response) => {
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
      this.getInputs(pageNum);
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
      :itemSelected="itemSelected"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getItemSelectedByUrl"
    />

    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Entrada
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <button
            class="btn dropdown-toggle btn-secondary margin-dropdown"
            type="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-sliders"></i>
            Filtro
          </button>
          <div class="dropdown-menu p-4 text-muted" style="max-width: 200px">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Nombre </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Documento </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Telefono </label>
            </div>
          </div>

          <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            v-model="search"
            placeholder="Buscar..."
            required
          />
          <button class="btn btn-secondary" type="button" v-on:click="filterTable">
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
      >
        <template v-slot:quick="data">
          <div class="d-flex">
            <button v-on:click="buttonView(data.value)" type="button" class="btn btn-secondary btn-sm me-1">
              <i class="bi bi-journal-text"></i>
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
    </ListContent>
  </SystemContent>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
