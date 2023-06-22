<script>
import MainContent from '@/components/my_components/MainContent.vue'
import DetailProduct from "./DetailProduct.vue";
import ConfirmDialogue from '@/components/my_components/ConfirmDialogue.vue'
import MyToast from '@/components/my_components/MyToast.vue'
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
            tasks: [],
            table: {
                isLoading: false,
                columns: [
                    {
                        label: "ID",
                        field: "id",
                        width: "3%",
                        sortable: true,
                        isKey: true,
                    },
                    {
                        label: "Code",
                        field: "code",
                        width: "5%",
                        sortable: true,
                    },
                    {
                        label: "Name",
                        field: "name",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Description",
                        field: "description",
                        width: "20%",
                        sortable: true,
                    },

                    {
                        label: "Cost",
                        field: "cost",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Price",
                        field: "price",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Stock",
                        field: "stock",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Ultima actualizacion",
                        field: "updated_at",
                        width: "10%",
                        display: (row) => {
                            return "Data " + this.timeAgo(row.updated_at);
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
            }
        };
    },
    components: {
        DetailProduct,
        ConfirmDialogue,
        MyToast,
        MainContent,
        TableLite
    },


    methods: {

        addMode() {
            this.$refs.modal.changeMode(1);
            this.$refs.modal.openModal();
        },
        viewMode(row) {
            console.log(row)
            this.item_selected = row;
            this.$refs.modal.changeMode(2);
            this.$refs.modal.openModal();
        },
        showToast(opts = {}) {
            this.$refs.toast.show(opts);
        },
        async deleteItem() {
            this.$refs.confirmDialogue.show({
                title: 'Eliminar Producto',
                message: '¿Estas seguro que quieres eliminar el producto?',
                okButton: 'Eliminar',
            }).then((result) => {
                if (result) {
                    this.showToast({
                        title: 'Eliminar Producto',
                        message: 'Se realizo la acción con exito',
                        type: 1
                    });
                }
            })
        },




        verDato(data) {
            item_selected = data;
            console.log(item_selected.name);
        },
        async getTasks() {
            var path = url + `products/products/`;
            console.log(path);
            axios.get(path).then((response) => {
                this.dataTable(response.data);
            });
        },
        dataTable(response) {
            response.forEach((element) => {
                console.log(response)

                this.table.rows.push(element);
                this.table.totalRecordCount = this.table.rows.length;
            });
        },
        timeAgo(time) {
            var date = new Date(time),
                diff = (new Date().getTime() - date.getTime()) / 1000,
                day_diff = Math.floor(diff / 86400);
            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return "puto";

            return (
                (day_diff == 0 &&
                    ((diff < 60 && "just now") ||
                        (diff < 120 && "1 minute ago") ||
                        (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
                        (diff < 7200 && "1 hour ago") ||
                        (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
                (day_diff == 1 && "Yesterday") ||
                (day_diff < 7 && day_diff + " days ago") ||
                (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago")
            );
        },
    },
    async created() {
        await this.getTasks();
    },
});
</script>
<template>
    <MyToast ref="toast"></MyToast>
    <DetailProduct ref="modal" :deleteItem="deleteItem" :showToast="showToast" :item_selected="item_selected" />
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
                    <button v-on:click="viewMode(data.value)" type="button" class="btn btn-dark btn-sm button-space">
                        <i class="bi bi-journal"></i> Ver
                    </button>
                    <button v-on:click="deleteItem()" class="ml-5 btn btn-danger btn-sm"><i class="bi bi-trash"></i>
                        Eliminar</button>
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
