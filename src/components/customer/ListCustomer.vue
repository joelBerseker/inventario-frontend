<script setup>
import MainContent from "@/components/my_components/MainContent.vue";
import AddCustomer from "./DetailCustomer.vue";

import TableLite from "vue3-table-lite";
import axios from "axios";
import { ref , reactive, computed } from "vue";


const url = import.meta.env.VITE_APP_RUTA_API;
const table = reactive({
  isLoading: false,
  columns: [
    {
      label: "ID",
      field: "id",
      width: "3%",
      sortable: true,
      isKey: true,
    },
    {
      label: "Name",
      field: "name",
      width: "10%",
      sortable: true,
    },
    {
      label: "Phone",
      field: "phone",
      width: "10%",
      sortable: true,
    },
    {
      label: "Email",
      field: "address",
      width: "15%",
      sortable: true,
    },
    {
      label: " ",
      field: "quick",
      sortable: false,
    },
  ],
  rows: [],
  totalRecordCount: computed(() => {
    return table.rows.length;
  }),
  sortable: {
    order: "name",
    sort: "asc",
  },
});
var item_selected = ref({});
/**
 * Search Event
 */
const verDato = (data) => {
  item_selected=data;
  console.log(item_selected.name);
};
const getTasks = () => {
  var path = url + `providers/providers/`;
  console.log(path);
  axios.get(path).then(function (response) {
    // handle success
    DataTable(response.data);
  });
};
const DataTable = (response) => {
  response.forEach((element) => {
    table.rows.push(element);
  });
};
getTasks();
</script>
<template>
  <!-- Modal -->
  <AddCustomer />

  <MainContent :title="'Proveedores'" :icon="'bi bi-truck'">
    <button
      type="button"
      class="btn btn-dark mb-2"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Agregar
    </button>
    <table-lite
      :is-static-mode="true"
      :is-slot-mode="true"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="table.rows"
      :total="table.totalRecordCount"
      :sortable="table.sortable"
      @is-finished="table.isLoading = false"
    >
      <template v-slot:quick="data">
        <div>
          <button
            type="button"
            data-id=""
            class="is-rows-el quick-btn"
            @click.prevent="verDato(data.value)"
          >
            Button</button
          >
        </div>
      </template>
    </table-lite>
  </MainContent>
</template>

<style></style>
