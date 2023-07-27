<template>
  <div class="dropdown">
    <button
      class="form-select form-select-sm text-start"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      v-on:click="focusSearch()"
    >
      {{ _itemName }}
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
        />
      </li>
      <li class="text-center" v-if="listFiltered.length <= 0">
        <div>No se encontraron elementos</div>
      </li>
      <li v-for="(item, index) in listFiltered" :key="index">
        <div class="dropdown-item" v-on:click="selectItem(item)">
          {{ item.name }}
        </div>
      </li>
      <li class="text-center" v-if="count >= 10">
        <div>HAY MAS ELEMENTOS SE MAS ESPECIFICO</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, toHandlers } from "vue";

import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;
export default defineComponent({
  name: "SelectSearch",
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: ["modelValue", "link"],
  data() {
    return {
      search: "",
      update: true,
      count:0,
      _itemName: "",
      list: [],
    };
  },

  methods: {
    getData() {
      var path = url + this.link;
      axios
        .get(path)
        .then((response) => {
          this.count=response.count;
          if (response.count == 0) {
            this.update = false;
          } else {
            response.data.results.forEach((element) => {
              this.list.push(element);
            });
          }
        })
        .catch(() => {
          console.log("error");
        });
    },
    getDataFilter(a){
      var path = url + this.link+"?search_query="+a;
      axios
        .get(path)
        .then((response) => {
          this.count=response.count;
          if (response.count == 0) {
            this.update = false;
          } else {
            console.log("entro a buscar");
            this.list=[];
            response.data.results.forEach((element) => {
              this.list.push(element);
            });
            console.log(this.list);
            console.log(this.listFiltered);
            console.log("termino a buscar");
            if(this.count<10)
            this.update = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    focusSearch() {
      this.$refs.search.focus();
    },
    selectItem(_item) {
      this.itemLocal = _item;
      this._itemName = _item.name;
    },
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
    listFiltered() {
      return this.list.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  watch: {
    search(newSearch, oldSearch) {
      if (newSearch.length >= 3) {
        if (newSearch.length > oldSearch.length && this.update) {
          this.getDataFilter(newSearch);
        } else {
          console.log("ELIMNA");
          this.update = false;
        }
      }
      
    },
  },
  async created() {
    await this.getData();
  },
});
</script>
