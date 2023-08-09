<template>
  <div class="form-group">
    <label for="nombre" v-if="name != null" class="text-secondary">{{ name }}:</label>
    <div class="input-group input-group-sm">
      <slot></slot>
    </div>
    <div v-if="message == 'No requerido'">
      <span class="message text-secondary"><i class="bi bi-info-circle"></i> {{ message }}</span>
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
