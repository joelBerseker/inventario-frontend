<script>
import DetailSupplier from "./SupplierDetail.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionSupplier from "@/mixin/conections/ConectionSupplier";
const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
  name: "Supplier",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      cardView: false,
      search: "",
      filter: "",
      numPag: 0,
      page: 1,
      update: true,
      table: {
        columns: [
          {
            label: "Nombre",
            field: "name",
            width: "42%",
          },
          {
            label: "Tipo",
            field: "documentType",
            width: "1%",
            display: (row) => {
              return this.getDocumentType(row.documentType);
            },
          },
          {
            label: "Document",
            field: "document",
            width: "20%",
          },

          {
            label: "Telefono",
            field: "phone",
            width: "20%",
          },

          {
            label: "Actualizado",
            field: "updated_at",
            width: "15%",
            display: (row) => {
              return this.timeAgo(row.updated_at);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "1%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },

      loadingContentSystem: true,
      loadingContentList: false,
      topbar: {
        title: "Proveedores",
        icon: "bi bi-truck",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Proveedores",
            link: "",
          },
        ],
      },
      textButtonCard: "Visualizar en tarjetas",
      iconButtonCard: "bi bi-view-list",
    };
  },
  watch: {
    cardView() {
      if (this.cardView) {
        this.textButtonCard = "Visualizar en tabla";
        this.iconButtonCard = "bi bi-table";
      } else {
        this.textButtonCard = "Visualizar en tarjetas";
        this.iconButtonCard = "bi bi-view-list";
      }
    },
    search(newSearch, oldSearch) {
      this.page = 1;
      if (newSearch.length >= 2) {
        if (newSearch.length > oldSearch.length && this.update) {
          this.filter = `${this.page}&search_query=${this.search}`;
          this.getSuppliers(this.filter);
        } else {
          this.update = true;
        }
      } else {
        if (newSearch.length === 0) {
          this.getSuppliers(this.page);
        }
      }
    },
  },

  mixins: [UtilityFunctions, ConectionSupplier],
  components: {
    DetailSupplier,
    TableLite,
    SystemContent,
    paginate: Paginate,
    ListContent,
  },
  props: ["changeTopbar"],
  async created() {
    this.changeTopbar(this.topbar);
    await this.getSuppliers(1);
  },
  methods: {
    onAdd() {
      this.getSuppliers(1);
    },
    onEdit() {
      this.getSuppliers(this.page);
    },
    onDelete() {
      this.getSuppliers(1);
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
      this.confirmDeleteSupplierRegister(row.id).then((response) => {
        if (response.success) {
          this.getSuppliers(1);
        }
      });
    },
    async getSuppliers(page) {
      this.loadingContentList = true;
      this.table.rows = [];
      this.getSupplierRegisters(page).then((response) => {
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
    async clickCallback(pageNum) {
      this.page = pageNum;

      if (this.search === "") {
        await this.getSuppliers(pageNum);
      } else {
        this.filter = `${pageNum}&search_query=${this.search}`;
        await this.getSuppliers(this.filter);
      }
    },
    filterTable() {
      this.page = 1;
      this.filter = this.search ? `${this.page}&search_query=${this.search}` : this.page;
      this.getSuppliers(this.filter);
    },
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <DetailSupplier
      ref="modal"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getIdUrl"
    />

    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Proveedor
        </button>
        <button v-on:click="cardView = !cardView" type="button" class="btn btn-primary btn-sm mb-3 ms-1">
          <i :class="iconButtonCard"></i> {{ this.textButtonCard }}
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control input-search"
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
      <transition name="t-card-view" mode="out-in">
        <div v-if="!cardView">
          <table-lite
            :is-static-mode="false"
            :is-slot-mode="true"
            :is-hide-paging="true"
            :columns="table.columns"
            :rows="table.rows"
            :total="table.totalRecordCount"
            class="mb-3"
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
        </div>
        <div v-else>
          <div class="row">
            <div class="col-4 mb-3" v-for="item in table.rows" :key="item.id">
              <div class="card box" :id="item.title">
                <div class="card-body">
                  <div class="row">
                    <div class="col-auto">
                      <h1><i class="bi bi-person-circle"></i></h1>
                    </div>
                    <div class="col">
                      <p class="title-text">{{ item.name }}</p>
                      <p class="card-text">{{ item.phone }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

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

<style scoped>
.t-card-view-enter-active,
.t-card-view-enter {
  transition: all 0.3s ease;
}

.t-card-view-leave-active {
  /*transition: all 0.25s ease;*/
}

.t-card-view-leave-to {
  transform: translateX(5px);
  opacity: 0;
}

.t-card-view-enter-from {
  transform: translateX(-5px);
  opacity: 0;
}
</style>
