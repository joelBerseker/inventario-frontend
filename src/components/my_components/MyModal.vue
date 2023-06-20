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
<script setup>
import { Modal } from "bootstrap";
import { defineProps, reactive } from "vue";
const props = defineProps({
  id: Number,
  title: String,
});


const closeModal = () => {
    var modal = Modal.getInstance(document.getElementById(props.id));
    modal.hide();
};
const openModal = () => {
    var modal = new Modal(document.getElementById(props.id), {});
    modal.show();
};
defineExpose({
    closeModal,
    openModal,
  });

</script>