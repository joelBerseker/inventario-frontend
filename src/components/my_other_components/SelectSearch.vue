<template>
  <MyForm :name="name" :message="validation.message">
    <div v-if="viewMode && disabled" class="d-flex">
      {{ selectedName }}
    </div>

    <div
      v-else
      class="dropdown w-100"
      @keyup.down="nextListItem()"
      @keyup.up="previousListItem()"
      @keyup.enter="pressEnter()"
    >
      <button
        :class="'form-select form-select-sm text-start ' + classValidation"
        type="button"
        ref="select"
        :id="id"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        v-on:click="focusSearch"
        :disabled="disabled"
      >
        <p v-if="!hasValue" class="single-line mb-0">
          Seleccione una opción
        </p>
        <p v-else class="single-line mb-0">
          {{ selectedName }}
        </p>
      </button>

      <ul class="dropdown-menu w-100" :aria-labelledby="id">
        <li class="px-2 mb-2">
          <input
            class="form-control form-control-sm"
            ref="search"
            :id="`${id}-search`"
            name="search"
            v-model="search"
            placeholder="Buscar..."
            autocomplete="off"
            v-on:keydown.down.prevent="false"
            v-on:keydown.up.prevent="false"
          />
        </li>

        <li v-for="(item, index) in listFiltered" :key="index">
          <div
            :class="'dropdown-item item-select ' + isActive(index)"
            v-on:click="selectItem(item)"
            @mouseover="hoverItem(index)"
          >
            <p class="mb-0">{{ item.name }}</p>
          </div>
        </li>

        <li class="text-center secondary-text" v-if="listFiltered.length <= 0">
          <div>No se encontraron elementos</div>
        </li>

        <li class="text-center secondary-text mt-2" v-if="listFiltered.length >= 10">
          <div>Existen más elementos, por favor sea más específico</div>
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
  name: "SelectSearch",
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {},
    id: {
      default: "id",
    },
    link: {},
    validation: {
      default: () => ({
        message: "",
        isValid: "",
      }),
    },
    viewMode: {
      default: true,
    },
    name: {
      default: null,
    },
    disabled: {
      default: false,
    },
  },
  data() {
    return {
      selectedInKeyboard: -1,
      search: "",
      update: true,
      count: 0,
      list: [],
    };
  },
  components: {
    MyForm,
  },

  computed: {
    itemLocal: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
        this.$emit("update", value);
      },
    },

    listFiltered() {
      const search = String(this.search || "").toLowerCase();
      return this.list.filter((item) => {
        return String(item.name || "").toLowerCase().includes(search);
      });
    },

    classValidation() {
      let resp = "";
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

    hasValue() {
      return !!(this.modelValue && this.modelValue.name);
    },

    selectedName() {
      return this.modelValue?.name || "Seleccione una opción";
    },
  },

  watch: {
    search(newSearch, oldSearch) {
      this.selectedInKeyboard = -1;

      if (newSearch.length >= 2) {
        if (newSearch.length > oldSearch.length && this.update) {
          this.getDataFilter(newSearch);
        } else {
          this.update = true;
        }
      }
    },
  },

  methods: {
    async getData() {
      const path = url + this.link;
      try {
        const response = await axios.get(path);
        this.count = response.data.count || 0;

        if (this.count === 0) {
          this.update = false;
          this.list = [];
          return;
        }

        this.list = response.data.results || [];
      } catch (e) {
        console.log(e);
      }
    },

    async getDataFilter(value) {
      const path = `${url + this.link}?search_query=${encodeURIComponent(value)}`;
      try {
        const response = await axios.get(path);
        this.count = response.data.count || 0;

        if (this.count === 0) {
          this.update = false;
          this.list = [];
          return;
        }

        this.list = response.data.results || [];
        if (this.count < 10) this.update = false;
      } catch (e) {
        console.log(e);
      }
    },

    focusSearch() {
      this.$nextTick(() => {
        this.$refs.search?.focus();
      });
    },

    selectItem(item) {
      this.itemLocal = item;
      this.selectedInKeyboard = -1;
      this.$refs.select?.focus();

      const dropdownEl = document.getElementById(this.id);
      const dropdown = Dropdown.getInstance(dropdownEl);
      if (dropdown) {
        dropdown.hide();
      }
    },

    nextListItem() {
      if (this.selectedInKeyboard < this.listFiltered.length - 1) {
        this.selectedInKeyboard++;
      } else {
        this.selectedInKeyboard = this.listFiltered.length - 1;
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
      return this.selectedInKeyboard == index ? " active " : "";
    },

    pressEnter() {
      if (this.selectedInKeyboard != -1) {
        this.selectItem(this.listFiltered[this.selectedInKeyboard]);
      }
    },

    hoverItem(index) {
      this.selectedInKeyboard = index;
    },

    refresh() {
      this.getData();
    },
  },

  async created() {
    await this.getData();
  },
});
</script>

<style scoped>
.dropdown {
  width: 100%;
}

.form-select {
  width: 100%;
}

.dropdown-menu {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  --bs-dropdown-link-hover-bg: transparent !important;
}

.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--my-c3) !important;
  color: var(--my-c1) !important;
}

.disabled-item {
  color: rgba(0, 0, 0, 0.493);
}

.single-line {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>