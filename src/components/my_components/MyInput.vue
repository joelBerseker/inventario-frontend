<template>
  <div class="dropdown">
    <MyForm :name="name" :message="validation.message" :labelClass="labelClass">
      <div v-if="viewMode && disabled" :class="viewClass">
        <span v-if="this.$slots.pre != undefined"><slot name="pre"></slot>&nbsp;</span>{{ itemLocal }}
      </div>
      <div v-else class="input-group input-group-sm">
        <div v-if="this.$slots.pre != undefined" :class="'input-group-text' + classDisabled">
          <slot name="pre"></slot>
        </div>
        <textarea
          v-if="type == 'textarea'"
          :class="inputClass + ' form-control  ' + classValidation"
          :id="name"
          v-model="itemLocal"
          :disabled="disabled"
        >
        </textarea>
        <input
          v-else
          :type="type"
          v-model="itemLocal"
          :disabled="disabled"
          :class="inputClass + ' form-control ' + classValidation"
          autocomplete="off"
          :id="name"
          ref="input"
          @focus="onFocus()"
          @blur="onBlur()"
          @input="onInput()"
        />
      </div>
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

  props: {
    modelValue: {},
    name: {},
    validation: {
      default: {
        message: "",
        isValid: undefined,
      },
    },
    viewMode: {
      default: true,
    },
    type: {},
    inputClass: {},
    viewClass: {},
    labelClass: {},
    disabled: {},
  },
  data() {
    return {};
  },
  components: {
    MyForm,
  },
  methods: {
    onFocus() {},
    onBlur() {},
    onInput() {},
  },
  computed: {
    itemLocal: {
      get: function () {
        return this.modelValue;
      },
      set: function (value) {
        this.$emit("update:modelValue", value);
      },
    },
    classDisabled: function () {
      var resp = "";
      if (this.disabled == true) {
        resp = " form-control-disabled ";
      } else {
        resp = "";
      }
      return resp;
    },
    classValidation: function () {
      var resp = "";
      if (this.validation.isValid != undefined) {
        if (this.validation.isValid) {
          if (this.validation.message != "No requerido") {
            resp = " is-valid ";
          }
        } else {
          resp = " is-invalid ";
        }
      }
      return resp;
    },
  },

  async created() {},
});
</script>
<style>
.input-content {
  position: relative !important;
}
.pre-content {
  position: absolute;
  height: 100%;
  padding-top: 0.31rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
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
.before-input {
  position: absolute;

  padding-left: 0.5rem;
  left: 0;
  top: 0;
  margin-top: auto;
  margin-top: auto;
}
.container-before {
  position: relative;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
