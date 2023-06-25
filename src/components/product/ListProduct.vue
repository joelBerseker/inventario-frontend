<script>
import MainContent from "@/components/my_components/MainContent.vue";
import DetailProduct from "./DetailProduct.vue";
import ConfirmDialogue from "@/components/my_components/ConfirmDialogue.vue";
import MyToast from "@/components/my_components/MyToast.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
    name: "Product",
    data() {
        return {
            loading: false,
            item_selected: {},
            newTask: "",
            Products: [],
            table: {
                isLoading: false,
                columns: [
                    {
                        label: "Codigo",
                        field: "code",
                        width: "5%",
                        sortable: true,
                    },
                    {
                        label: "Nombre",
                        field: "name",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Descripción",
                        field: "description",
                        width: "20%",
                        sortable: true,
                    },

                    {
                        label: "Compra",
                        field: "cost",
                        width: "10%",
                        sortable: true,
                        display: (row) => {
                            return this.priceCorrect(row.cost);
                        },
                    },
                    {
                        label: "Venta",
                        field: "price",
                        width: "10%",
                        sortable: true,
                        display: (row) => {
                            return this.priceCorrect(row.price);
                        },
                    },
                    {
                        label: "Cantidad",
                        field: "stock",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Actualizado",
                        field: "updated_at",
                        width: "10%",
                        display: (row) => {
                            return this.timeAgo(row.updated_at);
                        },
                    },
                    {
                        label: " ",
                        field: "quick",
                        width: "10%",
                        sortable: false,
                    },
                ],
                rows: [],
                totalRecordCount: 0,
                sortable: {
                    order: "name",
                    sort: "asc",
                },
                messages: {
                    pagingInfo: "Mostrando {0} - {1} de {2}",
                    pageSizeChangeLabel: "Filas: ",
                    gotoPageLabel: " Pagina: ",
                    noDataAvailable: "No se encontraron elementos",
                },
            },
        };
    },
    components: {
        DetailProduct,
        ConfirmDialogue,
        MyToast,
        MainContent,
        TableLite,
    },
    methods: {
        addMode() {
            this.item_selected = {};
            this.$refs.modal.changeMode(1);
            this.$refs.modal.openModal();
        },
        viewMode(row) {
            this.item_selected = row;
            this.$refs.modal.changeMode(2);
            this.$refs.modal.openModal();
        },
        showToast(opts = {}) {
            this.$refs.toast.show(opts);
        },
        async deleteItem(row) {
            this.$refs.confirmDialogue
                .show({
                    title: "Eliminar Producto",
                    message: "¿Estas seguro que quieres eliminar el producto?",
                    okButton: "Eliminar",
                })
                .then((result) => {
                    if (result) {
                        var path = url + "products/products/" + row.id + "/";
                        axios.delete(path).then((response) => {
                            console.log(response);
                            this.showToast({
                                title: "Eliminar Registro",
                                message: "Operación exitosa",
                                type: 1,
                            });
                            this.getProducts();
                        }).catch(() => {
                            this.showToast({
                                title: "Eliminar Registro",
                                message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                                type: 2,
                            });
                        });
                    }
                });
        },
        async getProducts() {
            this.table.rows = [];
            var path = url + `products/products/`;
            axios.get(path).then((response) => {
                response.data.forEach((element) => {
                this.table.rows.push(element);
                this.table.totalRecordCount = this.table.rows.length;
            });
            }).catch(() => {
                this.showToast({
                    title: "Obtener Registros",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
        priceCorrect(price) {
            return "s/ " + parseFloat(price).toFixed(2);
        },
        timeAgo(time) {
            var date = new Date(time),
                diff = (new Date().getTime() - date.getTime()) / 1000,
                day_diff = Math.floor(diff / 86400);
            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return "puto";

            return (
                (day_diff == 0 &&
                    ((diff < 60 && "hace un momento") ||
                        (diff < 120 && "hace 1 minuto") ||
                        (diff < 3600 && +Math.floor(diff / 60) + " minutos atras") ||
                        (diff < 7200 && "1 hora atras") ||
                        (diff < 86400 && Math.floor(diff / 3600) + " horas atras"))) ||
                (day_diff == 1 && "Ayer") ||
                (day_diff < 7 && day_diff + " dias atras") ||
                (day_diff < 31 && Math.ceil(day_diff / 7) + " semanas atras")
            );
        },
    },
    async created() {
        await this.getProducts();
    },
});
</script>
<template>
    <MyToast ref="toast"></MyToast>
    <DetailProduct ref="modal" :deleteItem="deleteItem" :showToast="showToast" :item_selected="item_selected"
        :getProducts="getProducts" />
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
    <MainContent :title="'Productos'" :icon="'bi bi-box-seam'">
        <button v-on:click="addMode" type="button" class="btn btn-dark btn-sm mb-3">
            <i class="bi bi-plus-circle"></i> Agregar
        </button>
        <table-lite :is-static-mode="true" :is-slot-mode="true" :is-loading="table.isLoading" :columns="table.columns"
            :rows="table.rows" :total="table.totalRecordCount" :sortable="table.sortable"
            @is-finished="table.isLoading = false" :messages="table.messages">
            <template v-slot:quick="data">
                <div>
                    <button v-on:click="viewMode(data.value)" type="button" class="btn btn-secondary btn-sm button-space">
                        <i class="bi bi-journal"></i> Ver
                    </button>
                </div>
            </template>
        </table-lite>
    </MainContent>
</template>
<script></script>

<style scoped>
.button-space {
    margin-right: 0.25rem;
}
</style>
