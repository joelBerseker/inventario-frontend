<template>
    <MyModal ref="myModal" :id="'dailyCashReportModal'" title="Reporte diario de ventas" size="modal-lg"
        v-on:mymodal:close="onModalClose">
        <div class="modal-body">
            <div v-if="loading" class="text-center py-4">
                <div class="spinner-border spinner-border-sm me-2"></div>
                Cargando reporte...
            </div>

            <div v-else ref="reportCard" class="report-card">
                <div class="report-header mb-3">
                    <div>
                        <div class="report-title">Reporte diario de caja</div>
                        <div class="text-muted small">Usuario: {{ report.user_name || "-" }}</div>
                        <div class="text-muted small">Fecha: {{ formattedDate }}</div>
                    </div>
                </div>

                <div class="table-responsive mb-3">
                    <table class="table table-sm table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Tipo de pago</th>
                                <th class="text-end">Cantidad ventas</th>
                                <th class="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in report.items" :key="item.payment_type">
                                <td>{{ item.payment_name }}</td>
                                <td class="text-end">{{ item.count }}</td>
                                <td class="text-end">S/. {{ formatMoney(item.total) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="table-secondary">
                                <th>Total general</th>
                                <th class="text-end">{{ report.total_sales_count || 0 }}</th>
                                <th class="text-end">S/. {{ formatMoney(report.total_general || 0) }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="closure-box">
                    <div class="closure-title mb-2">
                        <i class="bi bi-cash-coin me-1"></i>
                        Cierre de caja
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small mb-1">Efectivo esperado</label>
                            <input type="text" class="form-control form-control-sm text-end"
                                :value="`S/. ${formatMoney(report.expected_cash)}`" disabled />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small mb-1">Efectivo contado</label>
                            <input type="number" step="0.01" min="0" class="form-control form-control-sm text-end"
                                v-model="closure.counted_cash" :disabled="saving" @input="recalculateDifference" />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small mb-1">Diferencia</label>
                            <input type="text" class="form-control form-control-sm text-end" :class="differenceClass"
                                :value="differenceLabel" disabled />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small mb-1">Estado</label>
                            <input type="text" class="form-control form-control-sm" :value="differenceStatus"
                                disabled />
                        </div>

                        <div class="col-12">
                            <label class="form-label small mb-1">Observación</label>
                            <textarea class="form-control form-control-sm" rows="3" v-model="closure.note"
                                :disabled="saving"
                                placeholder="Ejemplo: sobrante por vuelto / venta no registrada / caja exacta..."></textarea>
                        </div>
                    </div>

                    <div v-if="report.closure" class="saved-info mt-3">
                        <strong>Cierre guardado:</strong>
                        {{ report.closure.closed_at }} |
                        Efectivo contado: S/. {{ formatMoney(report.closure.counted_cash) }}
                    </div>
                </div>

                <div class="report-note mt-3">
                    <strong>Resumen:</strong>
                    Este reporte muestra únicamente las ventas del día del usuario logueado,
                    separadas por tipo de pago. El cierre de caja solo compara el efectivo esperado
                    contra el efectivo contado.
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="closeModal"
                :disabled="loading || exporting || saving">
                Cerrar
            </button>

            <button type="button" class="btn btn-primary btn-sm" @click="saveClosure"
                :disabled="loading || exporting || saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-check-circle me-1"></i>
                Guardar cierre
            </button>

            <button type="button" class="btn btn-success btn-sm" @click="exportImage"
                :disabled="loading || exporting || saving">
                <span v-if="exporting" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-image me-1"></i>
                Exportar imagen
            </button>
        </div>
    </MyModal>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";
import MyModal from "@/components/my_components/MyModal.vue";

const url = import.meta.env.VITE_APP_RUTA_API;

export default {
    name: "DailyCashReportModal",
    inject: ["showToast"],
    components: {
        MyModal,
    },
    data() {
        return {
            loading: false,
            exporting: false,
            saving: false,
            report: {
                date: "",
                user_id: null,
                user_name: "",
                total_sales_count: 0,
                total_general: 0,
                expected_cash: 0,
                expected_yape: 0,
                expected_plin: 0,
                expected_transfer: 0,
                expected_card: 0,
                items: [],
                closure: null,
            },
            closure: {
                counted_cash: "",
                note: "",
                cash_difference: 0,
            },
        };
    },
    computed: {
        formattedDate() {
            if (!this.report.date) return "-";
            const [year, month, day] = this.report.date.split("-");
            return `${day}/${month}/${year}`;
        },

        differenceValue() {
            const expected = Number(this.report.expected_cash || 0);
            const counted = Number(this.closure.counted_cash || 0);
            return counted - expected;
        },

        differenceStatus() {
            if (this.differenceValue > 0) return "Excedente";
            if (this.differenceValue < 0) return "Faltante";
            return "Cuadre exacto";
        },

        differenceLabel() {
            const prefix = this.differenceValue > 0 ? "+" : "";
            return `${prefix}S/. ${this.formatMoney(this.differenceValue)}`;
        },

        differenceClass() {
            if (this.differenceValue > 0) return "diff-positive";
            if (this.differenceValue < 0) return "diff-negative";
            return "diff-neutral";
        },
    },
    methods: {
        async openModal() {
            if (!this.$refs.myModal) return;

            this.loading = true;
            this.exporting = false;
            this.saving = false;

            this.$refs.myModal.openModal();
            await this.getReport();
        },

        closeModal() {
            this.$refs.myModal?.closeModal();
            this.resetModalState();
        },

        onModalClose() {
            this.resetModalState();
        },

        resetModalState() {
            this.loading = false;
            this.exporting = false;
            this.saving = false;
        },

        async getReport() {
            try {
                const response = await axios.get(`${url}orders/orders/daily-cash-report/`);
                this.report = response.data;

                if (this.report.closure) {
                    this.closure.counted_cash = this.report.closure.counted_cash;
                    this.closure.note = this.report.closure.note || "";
                } else {
                    this.closure.counted_cash = Number(this.report.expected_cash || 0).toFixed(2);
                    this.closure.note = "";
                }

                this.recalculateDifference();
            } catch (error) {
                this.showToast({
                    title: "Ocurrió un error",
                    message: error?.response?.data?.detail || "No se pudo obtener el reporte diario.",
                    type: 2,
                });
            } finally {
                this.loading = false;
            }
        },

        recalculateDifference() {
            const expected = Number(this.report.expected_cash || 0);
            const counted = Number(this.closure.counted_cash || 0);
            this.closure.cash_difference = counted - expected;
        },

        formatMoney(value) {
            const number = Number(value || 0);
            return number.toFixed(2);
        },

        async saveClosure() {
            this.saving = true;

            try {
                const payload = {
                    date: this.report.date,
                    counted_cash: this.closure.counted_cash || 0,
                    note: this.closure.note || "",
                };

                await axios.post(`${url}orders/orders/daily-cash-closure/`, payload);

                this.showToast({
                    title: "Cierre guardado",
                    message: "El cierre de caja fue guardado correctamente.",
                    type: 1,
                });

                await this.getReport();
            } catch (error) {
                this.showToast({
                    title: "Ocurrió un error",
                    message: error?.response?.data?.detail || "No se pudo guardar el cierre de caja.",
                    type: 2,
                });
            } finally {
                this.saving = false;
            }
        },

        async exportImage() {
            if (!this.$refs.reportCard) return;

            this.exporting = true;

            try {
                const canvas = await html2canvas(this.$refs.reportCard, {
                    scale: 2,
                    backgroundColor: "#ffffff",
                });

                const link = document.createElement("a");
                link.download = `reporte-diario-${this.report.date || "hoy"}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                this.showToast({
                    title: "Exportación correcta",
                    message: "El reporte fue exportado como imagen.",
                    type: 1,
                });
            } catch (error) {
                this.showToast({
                    title: "Ocurrió un error",
                    message: "No se pudo exportar la imagen del reporte.",
                    type: 2,
                });
            } finally {
                this.exporting = false;
            }
        },
    },
};
</script>

<style scoped>
.report-card {
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1rem;
}

.report-title {
    font-size: 1.1rem;
    font-weight: 700;
}

.closure-box {
    border: 1px solid #dee2e6;
    border-radius: 10px;
    padding: 1rem;
    background: #fcfcfc;
}

.closure-title {
    font-weight: 700;
    font-size: 1rem;
}

.saved-info {
    font-size: 0.85rem;
    color: #495057;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
}

.report-note {
    font-size: 0.88rem;
    color: #495057;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 0.75rem;
}

.diff-positive {
    color: #0f5132;
    background-color: #d1e7dd;
    font-weight: 700;
}

.diff-negative {
    color: #842029;
    background-color: #f8d7da;
    font-weight: 700;
}

.diff-neutral {
    color: #495057;
    background-color: #e9ecef;
    font-weight: 700;
}
</style>