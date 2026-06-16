<script>
import DetailOutput from "./DetailOutput.vue";
import DailyCashReportModal from "./DailyCashReportModal.vue";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import ConectionOutput from "@/mixin/conections/ConectionOutput";
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService";
import axios from "axios";

const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Output",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      search: "",
      table: {
        columns: [
          { label: "Codigo", field: "order_code", width: "9%" },
          { label: "Cliente", field: "client_name", width: "13%" },
          { label: "Vendedor", field: "user_name", width: "13%" },
          {
            label: "Estado",
            field: "canceled",
            width: "8%",
            display: (row) => (row?.canceled ? "Anulada" : "Activa"),
          },
          {
            label: "Tipo Pago",
            field: "payment_type",
            width: "9%",
            display: (row) => {
              try {
                return this.getPaymentType(row?.payment_type);
              } catch (e) {
                return "-";
              }
            },
          },
          {
            label: "Subtotal",
            columnClasses: ["text-end"],
            headerClasses: ["text-end"],
            field: "subtotal_price",
            width: "8%",
            display: (row) => this.priceCorrect(row?.subtotal_price ?? row?.total_price ?? 0),
          },
          {
            label: "Descuento",
            columnClasses: ["text-end"],
            headerClasses: ["text-end"],
            field: "discount",
            width: "8%",
            display: (row) => this.priceCorrect(row?.discount ?? 0),
          },
          {
            label: "Total",
            columnClasses: ["text-end"],
            headerClasses: ["text-end"],
            field: "total_price",
            width: "8%",
            display: (row) => this.priceCorrect(row?.total_price ?? 0),
          },
          {
            label: "Fecha",
            field: "date",
            width: "14%",
            display: (row) => this.timeAgo(row?.date),
          },
          {
            label: "",
            field: "quick",
            width: "1%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      numPag: 0,
      page: 1,
      filters: {
        specific_date: "",
        start_date: "",
        end_date: "",
        last_days: "",
        last_weeks: "",
        last_months: "",
        last_years: "",
      },
      topbar: {
        title: "Salidas",
        icon: "bi bi-box-arrow-left",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Salidas", link: "" },
        ],
      },
      invoiceOptions: [
        { value: "boleta", label: "Boleta" },
        { value: "factura", label: "Factura" },
        { value: "boletaA4", label: "Boleta A4" },
      ],
      loadingContentSystem: true,
      loadingContentList: false,

      cancelModal: {
        show: false,
        row: null,
        reason: "",
        loading: false,
      },
    };
  },

  mixins: [UtilityFunctions, ConectionOutput],

  components: {
    DetailOutput,
    DailyCashReportModal,
    paginate: Paginate,
    TableLite,
    SystemContent,
    ListContent,
  },

  props: ["changeTopbar"],

  computed: {
    currentUser() {
      return AuthService.getCurrentUser?.();
    },

    isAdmin() {
      return !!(this.currentUser?.is_superuser || this.currentUser?.is_admin);
    },

    isSeller() {
      return !!(this.currentUser?.is_staff && !this.isAdmin);
    },
  },

  watch: {
    "$route.query.scan": {
      immediate: true,
      handler() {
        this.openAddFromRouteScan();
      },
    },
  },

  methods: {
    async openAddFromRouteScan() {
      const scan = this.$route.query.scan;
      if (!scan) return;

      await this.$nextTick();

      if (this.$refs.modal?.receiveExternalScan) {
        await this.$refs.modal.receiveExternalScan(scan);
      } else if (this.$refs.modal?.openAddWithScan) {
        await this.$refs.modal.openAddWithScan(scan);
      } else if (this.$refs.modal?.openAdd) {
        await this.$refs.modal.openAdd();
      }

      await this.$router.replace({
        path: this.$route.path,
        query: {},
      });
    },

    openInNewTab(row, invoiceType) {
      if (row?.canceled) {
        this.showToast({
          title: "Orden anulada",
          message: "No se puede imprimir una orden anulada.",
          type: 2,
        });
        return;
      }

      const link = url + "orders/orders/" + invoiceType + "/" + row.id + "/";
      window.open(link, "_blank", "noreferrer");
    },

    onAdd() {
      this.getOutputs(1);
    },

    onEdit() {
      this.getOutputs(this.page);
    },

    onDelete() {
      this.getOutputs(1);
    },

    getIdUrl() {
      if (this.$route.query.id !== undefined) {
        this.$refs.modal.openViewId(this.$route.query.id);
      }
    },

    buttonAdd() {
      this.$refs.modal.openAdd();
    },

    buttonView(row) {
      this.$refs.modal.openView(row);
    },

    getRowClass(row) {
      return row?.canceled ? "row-canceled" : "";
    },

    openDailyReport() {
      this.$nextTick(() => {
        this.$refs.dailyCashReportModal?.openModal();
      });
    },

    async buttonDelete(row) {
      if (!this.isAdmin) {
        this.showToast({
          title: "Acción no permitida",
          message: "Solo el administrador puede eliminar órdenes.",
          type: 2,
        });
        return;
      }

      const confirmed = await this.confirmDialogue({
        title: "¿Eliminar orden?",
        message: `Se eliminará la orden ${row.order_code}.`,
        okButton: "Eliminar",
      });

      if (!confirmed) return;

      this.confirmDeleteOutputRegister(row.id).then((response) => {
        if (response.success) {
          this.showToast({
            title: "Orden eliminada",
            message: "La orden fue eliminada correctamente.",
            type: 1,
          });
          this.getOutputs(1);
        }
      });
    },

    buttonCancelOrder(row) {
      if (!this.isSeller && !this.isAdmin) {
        this.showToast({
          title: "Acción no permitida",
          message: "No tienes permisos para anular órdenes.",
          type: 2,
        });
        return;
      }

      if (row?.canceled) {
        this.showToast({
          title: "Orden ya anulada",
          message: "Esta orden ya fue anulada previamente.",
          type: 2,
        });
        return;
      }

      this.cancelModal.row = row;
      this.cancelModal.reason = "";
      this.cancelModal.show = true;
    },

    closeCancelModal() {
      if (this.cancelModal.loading) return;

      this.cancelModal.show = false;
      this.cancelModal.row = null;
      this.cancelModal.reason = "";
    },

    async confirmCancelOrder() {
      const row = this.cancelModal.row;
      const reason = String(this.cancelModal.reason || "").trim();

      if (!row?.id) {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se encontró la orden a anular.",
          type: 2,
        });
        return;
      }

      if (!reason) {
        this.showToast({
          title: "Razón requerida",
          message: "Debe ingresar una razón para anular la orden.",
          type: 2,
        });
        return;
      }

      this.cancelModal.loading = true;

      try {
        await axios.patch(`${url}orders/orders/${row.id}/cancel/`, {
          reason,
        });

        this.showToast({
          title: "Orden anulada",
          message: "La orden fue anulada correctamente.",
          type: 1,
        });

        this.closeCancelModal();
        this.getOutputs(this.page);
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: error?.response?.data?.detail || "No se pudo anular la orden.",
          type: 2,
        });
      } finally {
        this.cancelModal.loading = false;
      }
    },

    async getOutputs(page = 1) {
      this.loadingContentList = true;
      this.table.rows = [];

      const params = { page };

      if (this.filters.specific_date) params.specific_date = this.filters.specific_date;
      if (this.filters.start_date) params.start_date = this.filters.start_date;
      if (this.filters.end_date) params.end_date = this.filters.end_date;
      if (this.filters.last_days) params.last_days = this.filters.last_days;
      if (this.filters.last_weeks) params.last_weeks = this.filters.last_weeks;
      if (this.filters.last_months) params.last_months = this.filters.last_months;
      if (this.filters.last_years) params.last_years = this.filters.last_years;

      this.getOutputRegisters(params).then((response) => {
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
      this.getOutputs(pageNum);
    },

    filterTable() {
      this.page = 1;
      this.getOutputs(1);
    },

    resetFiltersToToday() {
      this.filters = {
        specific_date: "",
        start_date: "",
        end_date: "",
        last_days: "",
        last_weeks: "",
        last_months: "",
        last_years: "",
      };
      this.search = "";
      this.getOutputs(1);
    },
  },

  async created() {
    this.changeTopbar(this.topbar);
    await this.getOutputs(1);
  },
});
</script>

<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <DetailOutput ref="modal" v-on:item:add="onAdd" v-on:item:edit="onEdit" v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getIdUrl" />

    <DailyCashReportModal ref="dailyCashReportModal" />

    <div class="row justify-content-md-end">
      <div class="col-4">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-lg"></i> Agregar Salida
        </button>
        <button class="btn btn-success btn-sm mb-3 ms-2" @click="openDailyReport">
          <i class="bi bi-cash-stack"></i> Reporte del día
        </button>
      </div>

      <div class="col-8">
        <div class="input-group input-group-sm">
          <div class="row g-2 mb-1">
            <div class="col-md-2">
              <label class="form-label small mb-1">Fecha exacta</label>
              <input type="date" class="form-control form-control-sm" v-model="filters.specific_date" />
            </div>

            <div class="col-md-2">
              <label class="form-label small mb-1">Desde</label>
              <input type="date" class="form-control form-control-sm" v-model="filters.start_date" />
            </div>

            <div class="col-md-2">
              <label class="form-label small mb-1">Hasta</label>
              <input type="date" class="form-control form-control-sm" v-model="filters.end_date" />
            </div>

            <div class="col-md-2">
              <label class="form-label small mb-1">Últimos días</label>
              <input type="number" class="form-control form-control-sm" v-model="filters.last_days" min="1" />
            </div>

            <div class="col-md-2">
              <label class="form-label small mb-1">Últimos meses</label>
              <input type="number" class="form-control form-control-sm" v-model="filters.last_months" min="1" />
            </div>

            <div class="col-md-2 d-flex align-items-end gap-2">
              <button class="btn btn-primary btn-sm w-100" @click="filterTable">
                Buscar
              </button>
              <button class="btn btn-secondary btn-sm w-100" @click="resetFiltersToToday">
                Hoy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ListContent ref="tableContent" :loading="this.loadingContentList" :size="table.rows.length">
      <table-lite class="mb-3" :is-static-mode="false" :is-slot-mode="true" :is-hide-paging="true"
        :columns="table.columns" :rows="table.rows" :total="table.totalRecordCount" :row-classes="getRowClass"
        @row-clicked="buttonView">
        <template v-slot:quick="data">
          <div class="d-flex">
            <button class="btn btn-secondary btn-sm me-1" type="button" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-expanded="false" v-on:click.stop>
              <i class="bi bi-list-ul"></i>
            </button>

            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <div class="dropdown-item item-select" v-on:click.stop="buttonView(data.value)">
                  <i class="bi bi-journal-text"></i> Visualizar
                </div>
              </li>

              <li v-for="option in invoiceOptions" :key="option.value">
                <div class="dropdown-item item-select" v-on:click.stop="openInNewTab(data.value, option.value)">
                  <i class="bi bi-file-pdf"></i> {{ option.label }}
                </div>
              </li>

              <li v-if="data.value.canceled">
                <div class="dropdown-item text-muted">
                  <i class="bi bi-info-circle"></i>
                  Anulada
                </div>
              </li>

              <li v-if="data.value.canceled && data.value.cancel_reason">
                <div class="dropdown-item text-muted small">
                  Motivo: {{ data.value.cancel_reason }}
                </div>
              </li>
            </ul>

            <button v-if="isAdmin" v-on:click.stop="buttonDelete(data.value)" type="button"
              class="btn btn-danger btn-sm" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>

            <button v-if="(isSeller || isAdmin) && !data.value.canceled" v-on:click.stop="buttonCancelOrder(data.value)"
              type="button" class="btn btn-warning btn-sm" title="Anular">
              <i class="bi bi-x-circle"></i>
            </button>

            <button v-if="isSeller && data.value.canceled" type="button" class="btn btn-secondary btn-sm" disabled
              title="Orden anulada">
              <i class="bi bi-slash-circle"></i>
            </button>
          </div>
        </template>
      </table-lite>

      <paginate v-if="numPag > 1" v-model="page" :page-count="numPag" :page-range="3" :margin-pages="2"
        :click-handler="clickCallback" :prev-text="'Anterior'" :next-text="'Siguiente'"
        :container-class="'pagination pagination-sm'" :page-class="'page-item'" />
    </ListContent>

    <div v-if="cancelModal.show" class="cancel-modal-backdrop" @click.self="closeCancelModal">
      <div class="cancel-modal-card">
        <div class="cancel-modal-header">
          <h5 class="mb-0">
            <i class="bi bi-x-circle text-warning me-2"></i>
            Anular orden
          </h5>
          <button type="button" class="btn-close" @click="closeCancelModal" :disabled="cancelModal.loading"></button>
        </div>

        <div class="cancel-modal-body">
          <p class="mb-2">
            Vas a anular la orden:
            <strong>{{ cancelModal.row?.order_code }}</strong>
          </p>

          <p class="text-muted small mb-3">
            Esta acción marcará la venta como anulada y registrará el motivo.
          </p>

          <label class="form-label fw-semibold">Razón de anulación</label>
          <textarea v-model="cancelModal.reason" class="form-control" rows="4"
            placeholder="Ejemplo: Cliente devolvió el producto / cambio por otro / error en la venta..."
            :disabled="cancelModal.loading"></textarea>
        </div>

        <div class="cancel-modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" @click="closeCancelModal"
            :disabled="cancelModal.loading">
            Cancelar
          </button>

          <button type="button" class="btn btn-warning btn-sm" @click="confirmCancelOrder"
            :disabled="cancelModal.loading">
            <span v-if="cancelModal.loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check-circle me-1"></i>
            Confirmar anulación
          </button>
        </div>
      </div>
    </div>
  </SystemContent>
</template>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}

.item-select {
  cursor: pointer;
}

.small {
  font-size: 0.75rem;
  white-space: normal;
  max-width: 220px;
}

:deep(.row-canceled td) {
  background-color: #fff3cd !important;
}

:deep(.row-canceled) {
  opacity: 0.92;
}

.cancel-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cancel-modal-card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  animation: modalFadeIn 0.18s ease;
}

.cancel-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eee;
  background: #fffaf0;
}

.cancel-modal-body {
  padding: 1rem;
}

.cancel-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border-top: 1px solid #eee;
  background: #fafafa;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>