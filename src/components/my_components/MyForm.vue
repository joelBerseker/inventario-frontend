<template>
  <div>
    <div class="form-group">
      <label for="nombre" v-if="name != null" class="secondary-text">{{ name }}:</label>
      <slot></slot>
    </div>
    <div v-if="message == 'No requerido'">
      <span class="message secondary-text"><i class="bi bi-info-circle"></i> {{ message }}</span>
    </div>
    <div v-else-if="message != '' && message != null">
      <span class="text-danger message">
        <i class="bi bi-exclamation-circle"></i>
        {{ message }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.message {
  font-size: 0.75rem !important;
}
</style>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MyForm",
  props: ["name", "message"],
  methods: {},
});
</script>
