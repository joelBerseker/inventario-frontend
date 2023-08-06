<template>
  <div class="dropdown">
    <MyForm :name="name" :message="validation.validationMessage">
      <select
        :class="'form-select form-select-sm ' + validation.validationStyle"
        :id="name"
        :disabled="disabled"
        v-model="itemLocal"
        required
      >
        <option disabled :value="undefined">Seleccione una opción</option>
        <option v-for="option in options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </MyForm>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import MyForm from "@/components/my_components/MyForm.vue";

export default defineComponent({
  name: "MyInput",
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: ["modelValue", "name", "validation", "options", "disabled"],
  props: {
    modelValue: {},
    name: {},
    validation: {
      default: {
        validationMessage: "",
        validationStyle: "",
      },
    },
    options: {},
    disabled: {},
  },
  data() {
    return {};
  },
  components: {
    MyForm,
  },
  methods: {},
  computed: {
    itemLocal: {
      get: function () {
        return this.modelValue;
      },
      set: function (value) {
        this.$emit("update:modelValue", value);
        this.$emit("update", value);
      },
    },
  },
  async created() {},
});
</script>
<style>
.disabled-item {
  color: rgba(0, 0, 0, 0.493);
}

.single-line {
  width: 100%;
  /*text-overflow: ellipsis;*/
  overflow: hidden;
  white-space: pre;
}

.item-select {
  white-space: normal !important;
  cursor: pointer;
}
</style>
