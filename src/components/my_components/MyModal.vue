<template>
  <div class="modal fade" :id="id" data-bs-backdrop="static" data-bs-keyboard="false">
    <div :class="'modal-dialog modal-dialog-scrollable ' + size">
      <div class="modal-content">
        <div class="modal-header">
          <p class="title-text">{{ this.title }}</p>
          <button
            v-if="closeButton"
            tabindex="-1"
            type="button"
            class="btn btn-secondary-outline btn-sm"
            v-on:click="closeButtonAction"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MyModal",
  props: {
    id: {},
    title: {},
    size: {},
    closeButton: {
      default: true,
    },
  },
  methods: {
    closeModal() {
      const element = document.getElementById(this.id);
      if (!element) return;

      let modal = Modal.getInstance(element);
      if (!modal) {
        modal = new Modal(element, {});
      }

      modal.hide();
    },

    openModal() {
      const element = document.getElementById(this.id);
      if (!element) return;

      let modal = Modal.getInstance(element);
      if (!modal) {
        modal = new Modal(element, {});
      }

      modal.show();
    },

    closeButtonAction() {
      this.closeModal();
      this.$emit("mymodal:close");
    },
  },
  mounted() {
    this.$emit("mounted:mymodal");
  },
});
</script>