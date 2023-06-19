<script>
import AddCustomer from "./DetailCustomer.vue";

import TableLite from "vue3-table-lite";
import axios from "axios";
import { defineComponent, reactive, computed } from "vue";
// Fake Data for 'asc' sortable
const sampleData1 = (offst, limit) => {
  offst = offst + 1;
  let data = [];
  for (let i = offst; i <= limit; i++) {
    data.push({
      id: i,
      name: "TEST" + i,
      email: "test" + i + "@example.com",
    });
  }
  return data;
};
// Fake Data for 'desc' sortable
const sampleData2 = (offst, limit) => {
  let data = [];
  for (let i = limit; i > offst; i--) {
    data.push({
      id: i,
      name: "TEST" + i,
      email: "test" + i + "@example.com",
    });
  }
  return data;
};
export default defineComponent({
  name: "App",
  components: { TableLite },
  setup() {
    // Table config

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
    /**
     * Search Event
     */
     const verDato = (event) => {
      console.log("entre");
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
      let data = [];
      response.forEach(element => {
        table.rows.push(element);
      });
    };
    getTasks();
    const doSearch = (offset, limit, order, sort) => {
      table.isLoading = true;
      setTimeout(() => {
        table.isReSearch = offset == undefined ? true : false;
        if (offset >= 10 || limit >= 20) {
          limit = 20;
        }
        if (sort == "asc") {
          table.rows = sampleData1(offset, limit);
        } else {
          table.rows = sampleData2(offset, limit);
        }
        table.totalRecordCount = 50;
        table.sortable.order = order;
        table.sortable.sort = sort;
      }, 600);
    };

    // First get data
    //doSearch(0, 10, 'id', 'asc');
    return {
      table,
      doSearch,
      verDato,
    };
  },
  components: {
    AddCustomer,
    TableLite,
  },
});
</script>
<template>
  <!-- Modal -->
  <AddCustomer />
  <div>
    <h1>Proveedores</h1>

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
        <button type="button"  data-id="01" class="is-rows-el quick-btn" @click="verDato" >Button</button>'
      </div>
    </template>
  </table-lite>
  </div>
</template>

<style></style>
