<template>
  <MyForm :name="name" :message="validation.validationMessage">
    <div v-if="viewMode && disabled" class="d-flex">
      {{ modelValue.name }}
    </div>
    <div
      v-else
      class="dropdown"
      @keyup.down="nextListItem()"
      @keyup.up="previousListItem()"
      @keyup.enter="pressEnter()"
    >
      <button
        :class="'form-select form-select-sm text-start ' + validation.validationStyle"
        type="button"
        ref="select"
        :id="id"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        v-on:click="focusSearch()"
        data-bs-display="static"
        :disabled="disabled"
      >
        <p v-if="modelValue == null || modelValue == ''" class="single-line">Seleccione una opción</p>
        <p v-else class="single-line">{{ modelValue.name }}</p>
      </button>
      <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
        <li class="px-2 mb-2">
          <input
            class="form-control form-control-sm"
            ref="search"
            id="search"
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
            <p>{{ item.name }}</p>
          </div>
        </li>
        <li class="text-center secondary-text" v-if="listFiltered.length <= 0">
          <div>No se encontraron elementos</div>
        </li>

        <li class="text-center secondary-text mt-2" v-if="listFiltered.length >= 10">
          <div>Existen mas elementos, por favor sea mas especifico</div>
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
      default: {
        validationMessage: "",
        validationStyle: "",
      },
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
    getDataFilter(a) {
      var path = url + this.link + "?search_query=" + a;
      axios
        .get(path)
        .then((response) => {
          this.count = response.data.count;
          if (response.count == 0) {
            this.update = false;
          } else {
            this.list = [];
            response.data.results.forEach((element) => {
              this.list.push(element);
            });
            if (this.count < 10) this.update = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    focusSearch() {
      this.selectedInKeyboard = -1;
      this.$refs.search.focus();
    },
    selectItem(_item) {
      this.itemLocal = _item;
      this.$refs.select.focus();

      var dropdown = Dropdown.getInstance(document.getElementById(this.id));
      dropdown.hide();
    },
    nextListItem() {
      if (this.selectedInKeyboard < this.list.length - 1) {
        this.selectedInKeyboard++;
      } else {
        this.selectedInKeyboard = this.list.length - 1;
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
      if (this.selectedInKeyboard != -1) this.selectItem(this.list[this.selectedInKeyboard]);
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
    listFiltered() {
      return this.list.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase());
      });
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
  async created() {
    await this.getData();
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
