<script> 
import MainContent from '@/components/my_components/MainContent.vue'
import DetailProduct from "./DetailProduct.vue";
import ConfirmDialogue from '@/components/my_components/ConfirmDialogue.vue'
import MyToast from '@/components/my_components/MyToast.vue'
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
    name: "Product",
    data() {
        return {
            loading: false,
            newTask: "",
            tasks: [],
        };
    },
    components: {
        DetailProduct,
        ConfirmDialogue,
        MyToast,
        MainContent
    },
    created() {
        this.getTasks();
    },
    methods: {
        async getTasks() {
            this.loading = true;
            var path = url + `products/products/`;
            console.log(path);
            axios.get(path)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
        },
        addMode() {
            this.$refs.modal.changeMode(1);
            this.$refs.modal.openModal();
        },
        viewMode() {
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
                        message: 'Se realizo la acción con exito'
                    });
                }
            })
        }
    },
});
</script>
<template>
    <MyToast ref="toast"></MyToast>
    <DetailProduct ref="modal" :deleteItem="deleteItem" :showToast="showToast" />
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
    <MainContent :title="'Productos'" :icon="'bi bi-box-seam'">
        <button v-on:click="addMode" type="button" class="btn btn-dark btn-sm mb-3">
            <i class="bi bi-plus-circle"></i> Agregar
        </button>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Ultimo ingresado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td>
                        <button v-on:click="viewMode()" type="button" class="btn btn-dark btn-sm button-space">
                            <i class="bi bi-journal"></i> Ver</button>
                        <button v-on:click="deleteItem()" class="ml-5 btn btn-danger btn-sm"><i class="bi bi-trash"></i>
                            Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td>
                        <button v-on:click="viewMode()" type="button" class="btn btn-dark btn-sm button-space">
                            <i class="bi bi-journal"></i> Ver</button>
                        <button class="ml-5 btn btn-danger btn-sm"><i class="bi bi-trash"></i> Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td>
                        <button v-on:click="viewMode()" type="button" class="btn btn-dark btn-sm button-space">
                            <i class="bi bi-journal"></i> Ver</button>
                        <button class="ml-5 btn btn-danger btn-sm"><i class="bi bi-trash"></i> Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td>
                        <button v-on:click="viewMode()" type="button" class="btn btn-dark btn-sm button-space">
                            <i class="bi bi-journal"></i> Ver</button>
                        <button class="ml-5 btn btn-danger btn-sm"><i class="bi bi-trash"></i> Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </MainContent>
</template>
<script></script>

<style scoped>
.button-space {
    margin-right: 0.25rem;
}
</style>
