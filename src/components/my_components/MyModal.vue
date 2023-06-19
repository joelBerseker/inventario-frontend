<template>
    <div class="modal fade" :id="id">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <p class="title-text">{{ this.title }}</p>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style ></style>
<script>
import { Modal } from "bootstrap";
import { defineComponent } from "vue";
export default defineComponent({
    name: 'MyModal',
    props: [
        "id", "title"
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