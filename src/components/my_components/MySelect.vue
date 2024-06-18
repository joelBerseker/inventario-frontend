<template>
  <MyForm :name="name" :message="validation.message">
    <div v-if="viewMode && disabled" class="d-flex">
      {{ options[modelValue - 1].text }}
    </div>
    <div
      v-else
      class="dropdown"
      @keyup.down="nextListItem()"
      @keyup.up="previousListItem()"
      @keyup.enter="pressEnter()"
    >
      <button
        :class="'form-select form-select-sm text-start ' + classValidation"
        type="button"
        ref="select"
        :id="id"
        data-bs-auto-close="true"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        data-bs-popper-config='{"strategy":"fixed"}'
        :disabled="disabled"
      >
        <p v-if="modelValue == null || modelValue == ''" class="single-line">
          Seleccione una opción
        </p>
        <p v-else class="single-line">{{ options[modelValue - 1].text }}</p>
      </button>
      <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
        <li v-for="(item, index) in options" :key="index">
          <div
            :class="'dropdown-item item-select ' + isActive(index)"
            v-on:click="selectItem(item)"
            @mouseover="hoverItem(index)"
          >
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </MyForm>
</template>

<script>
import { Dropdown } from "bootstrap";
import { defineComponent } from "vue";
import MyForm from "@/components/my_components/MyForm.vue";
import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;
export default defineComponent({
  name: "MySearch",
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {},
    id: {
      default: "id",
    },
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
    options: {},
    disabled: {},
  },
  data() {
    return {
      selectedInKeyboard: -1,
      update: true,
      count: 0,
      list: [],
    };
  },
  components: {
    MyForm,
  },

  methods: {
    getData() {
      var path = url + this.link;
      axios
        .get(path)
        .then((response) => {
          this.count = response.count;
          if (response.count == 0) {
            this.update = false;
          } else {
            response.data.results.forEach((element) => {
              this.list.push(element);
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    selectItem(_item) {
      this.itemLocal = _item.value;
      this.selectedInKeyboard = -1;
      var dropdown = Dropdown.getInstance(document.getElementById(this.id));
      dropdown.hide();
    },
    nextListItem() {
      if (this.selectedInKeyboard < this.options.length - 1) {
        this.selectedInKeyboard++;
      } else {
        this.selectedInKeyboard = this.options.length - 1;
      }
    },
    previousListItem() {
      if (this.selectedInKeyboard > 0) {
        this.selectedInKeyboard--;
      } else {
        this.selectedInKeyboard = 0;
      }
    },
    isActive(index) {
      var resp = "";
      if (this.selectedInKeyboard == index) {
        resp = " active ";
      }

      return resp;
    },
    pressEnter() {
      if (this.selectedInKeyboard != -1)
        this.selectItem(this.options[this.selectedInKeyboard]);
    },
    hoverItem(index) {
      this.selectedInKeyboard = index;
    },
  },
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
});
</script>
<style scoped>
.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--my-c3) !important;
  color: var(--my-c1) !important;
}
.dropdown-item:hover {
}
.dropdown-menu {
  --bs-dropdown-link-hover-bg: transparent !important;
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
</style>
