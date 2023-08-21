<script>
import { Modal } from "bootstrap";
import Icon from '@/components/my_other_components/Icon.vue'
import { defineComponent } from "vue";
export default defineComponent({
    name: "LoadingSystem",
    data() {
        return {
            id: "loading", 
            title: "loading System", 
            size: "sm"
        }
    },
    components: {
        Icon,
    },
    methods: {
        closeModal() {
            var modal = Modal.getInstance(document.getElementById(this.id));
            modal.hide();
        },
        openModal() {
            var modal = new Modal(document.getElementById(this.id), {});
            modal.show();
        },

    },
})
</script>
<template>
    <div class="modal fade " :id="id" data-bs-backdrop="static" data-bs-keyboard="false">
        <div :class="'modal-dialog modal-dialog-scrollable modal-dialog-centered '+ size ">
            <div class="modal-content loading-screen">
                <div><Icon size="55px" :speed="true" :mode="6"></Icon></div>
                <div class="secondary-text">Cargando sistema...</div>
                
            </div>
        </div>
    </div>
</template>
<style scoped>
.loading-screen{
    border-color: transparent;
    background-color: transparent;
}
</style>
