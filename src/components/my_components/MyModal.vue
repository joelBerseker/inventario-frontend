<template>
  <div class="modal fade" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <p class="title-text">{{ $props.title }}</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style></style>
<script setup>
import { Modal } from "bootstrap";
import { ref, defineProps, defineExpose, toRefs } from 'vue'

const props = defineProps(['id', 'title']);
const { id, title } = toRefs(props);

const closeModal = () => {
  var modal = Modal.getInstance(document.getElementById(id.value));
  modal.hide();
};

const openModal = () => {
  console.log(id.value); // Verifica el valor de id en la consola
  console.log(title.value); // Verifica el valor de title en la consola
  var modal = Modal.getOrCreateInstance(document.getElementById(id.value));
  modal.show();
};

defineExpose({
  closeModal,
  openModal,
});
</script>