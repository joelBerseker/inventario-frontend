<template>
  <MyForm :name="name" :message="validation.validationMessage">
  <div class="dropdown">
    <button
      :class="'form-select form-select-sm text-start ' + validation.validationStyle"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      v-on:click="focusSearch()"
    >
      <p v-if="_itemName!=''" class="single-line">{{ _itemName }}</p>
      <p v-else class="single-line">Seleccione una opción</p>
      
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
        />
      </li>
      <li class="text-center" v-if="listFiltered.length <= 0">
        <div>No se encontraron elementos</div>
      </li>
      <li v-for="(item, index) in listFiltered" :key="index">
        <div class="dropdown-item item-select" v-on:click="selectItem(item)">
          <p>{{ item.name }}</p>
        </div>
      </li>
      <li class="text-center" v-if="count >= 10">
        <div>Existen mas elementos, por favor sea mas especifico</div>
      </li>
    </ul>
  </div>
</MyForm>
</template>

<script>
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
  props: ["modelValue"],
  props:{
    link:{},
    validation:{
      default:{
        validationMessage: "",
          validationStyle: ""
      }
    },
    name:{
      default:null
    }
  },
  data() {
    return {
      search: "",
      update: true,
      count:0,
      _itemName: "",
      list: [],
    };
  },
  components: {
        MyForm
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
        .catch((e) => {
          console.log(e);
        });
    },
    getDataFilter(a){
      var path = url + this.link+"?search_query="+a;
      axios
        .get(path)
        .then((response) => {
          this.count=response.data.count;
          if (response.count == 0) {
            this.update = false;
          } else {
            this.list=[];
            response.data.results.forEach((element) => {
              this.list.push(element);
            });
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
    //await this.getData();
  },
});
</script>
<style>
.disabled-item{
  color: rgba(0, 0, 0, 0.493);
}
.single-line {
  width: 100%;
  /*text-overflow: ellipsis;*/
  overflow: hidden;
  white-space: pre;
}
.item-select{
  white-space: normal !important;
  cursor: pointer;
}
</style>