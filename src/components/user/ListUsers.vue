<script>
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import { defineComponent } from "vue";
import axios from "axios";

const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "ListUsers",
  inject: ["confirmDialogue", "showToast"],
  components: {
    TableLite,
    paginate: Paginate,
    SystemContent,
    ListContent,
  },
  props: ["changeTopbar"],
  data() {
    return {
      search: "",
      page: 1,
      numPag: 0,
      loadingContentSystem: true,
      loadingContentList: false,
      table: {
        columns: [
          {
            label: "Nombre",
            field: "first_name",
            width: "22%",
            display: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
          },
          {
            label: "Correo",
            field: "email",
            width: "24%",
          },
          {
            label: "Teléfono",
            field: "phone",
            width: "14%",
          },
          {
            label: "Dirección",
            field: "address",
            width: "20%",
          },
          {
            label: "Rol",
            field: "role",
            width: "10%",
            display: (row) => {
              if (row.is_superuser || row.is_admin) return "Admin";
              if (row.is_staff) return "Vendedor";
              return "Usuario";
            },
          },
          {
            label: "Estado",
            field: "is_active",
            width: "8%",
            display: (row) => (row.is_active ? "Activo" : "Inactivo"),
          },
          {
            label: "",
            field: "quick",
            width: "2%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      topbar: {
        title: "Usuarios",
        icon: "bi bi-person",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Usuarios", link: "" },
        ],
      },
    };
  },
  methods: {
    async getUsers(page = 1) {
      this.loadingContentList = true;
      this.table.rows = [];

      try {
        const response = await axios.get(`${url}user/api/`);
        const results = response.data.results || response.data;

        const filtered = results.filter((u) => {
          const q = this.search.trim().toLowerCase();
          if (!q) return true;

          return (
            `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.phone || "").toLowerCase().includes(q)
          );
        });

        this.table.rows = filtered;
        this.table.totalRecordCount = filtered.length;
        this.numPag = 1;
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se pudo obtener la lista de usuarios.",
          type: 2,
        });
      } finally {
        this.loadingContentSystem = false;
        this.loadingContentList = false;
      }
    },

    async toggleActive(row) {
      try {
        await axios.patch(`${url}user/api/${row.id}/toggle-active/`);
        this.showToast({
          title: "Actualizado",
          message: row.is_active
            ? "Usuario desactivado correctamente."
            : "Usuario activado correctamente.",
          type: 1,
        });
        this.getUsers(this.page);
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se pudo actualizar el estado del usuario.",
          type: 2,
        });
      }
    },

    async deleteUser(row) {
      this.confirmDialogue({
        title: "¿Eliminar usuario?",
        message: `Se eliminará el usuario ${row.first_name} ${row.last_name}.`,
        onConfirm: async () => {
          try {
            await axios.delete(`${url}user/api/${row.id}/`);
            this.showToast({
              title: "Eliminado",
              message: "Usuario eliminado correctamente.",
              type: 1,
            });
            this.getUsers(1);
          } catch (error) {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo eliminar el usuario.",
              type: 2,
            });
          }
        },
      });
    },

    filterTable() {
      this.getUsers(1);
    },
  },

  async created() {
    this.changeTopbar(this.topbar);
    await this.getUsers(1);
  },
});
</script>

<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <div class="row justify-content-md-end">
      <div class="col">
        <div class="input-group input-group-sm mb-3">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Buscar usuario..."
          />
          <button class="btn btn-secondary" type="button" @click="filterTable">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <ListContent ref="tableContent" :loading="loadingContentList" :size="table.rows.length">
      <table-lite
        class="mb-3"
        :is-static-mode="false"
        :is-slot-mode="true"
        :is-hide-paging="true"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
      >
        <template v-slot:quick="data">
          <div class="d-flex">
            <button
              class="btn btn-warning btn-sm me-1"
              type="button"
              @click.stop="toggleActive(data.value)"
            >
              <i class="bi" :class="data.value.is_active ? 'bi-person-dash' : 'bi-person-check'"></i>
            </button>

            <button
              class="btn btn-danger btn-sm"
              type="button"
              @click.stop="deleteUser(data.value)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </table-lite>
    </ListContent>
  </SystemContent>
</template>