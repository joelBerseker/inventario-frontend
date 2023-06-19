<template>
    <div class="modal fade" :id="id">
        <div class="modal-dialog ">
            <div class="modal-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style >
</style>
<script>
import { Modal } from "bootstrap";
import { defineComponent } from "vue";
export default defineComponent({
    name: 'MyModal',
    props: [
        "id"
    ],
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
});
</script>