<script>
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import UserCreateModal from "./UserCreateModal.vue";
import UserEditModal from "./UserEditModal.vue";
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
    UserCreateModal,
    UserEditModal,
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
            width: "18%",
            display: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
          },
          {
            label: "Username",
            field: "username",
            width: "12%",
            display: (row) => row.username || "-",
          },
          {
            label: "Correo",
            field: "email",
            width: "16%",
            display: (row) => row.email || "-",
          },
          {
            label: "Teléfono",
            field: "phone",
            width: "12%",
            display: (row) => row.phone || "-",
          },
          {
            label: "Dirección",
            field: "address",
            width: "16%",
            display: (row) => row.address || "-",
          },
          {
            label: "Rol",
            field: "role",
            width: "8%",
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
            width: "10%",
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
    isAdminUser(row) {
      return !!(row?.is_superuser || row?.is_admin);
    },

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
            (u.username || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.phone || "").toLowerCase().includes(q) ||
            (u.address || "").toLowerCase().includes(q)
          );
        });

        this.table.rows = filtered;
        this.table.totalRecordCount = filtered.length;
        this.numPag = 1;
        this.page = page;
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
      if (this.isAdminUser(row)) {
        this.showToast({
          title: "Acción bloqueada",
          message: "No se puede activar o desactivar un usuario administrador.",
          type: 2,
        });
        return;
      }

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

    async resetPassword(row) {
      const ok = await this.confirmDialogue({
        title: "Resetear contraseña",
        message: `Se reseteará la contraseña de ${row.username} a Temp123.`,
        okButton: "Resetear",
      });

      if (!ok) return;

      try {
        await axios.patch(`${url}user/api/${row.id}/reset-password/`);
        this.showToast({
          title: "Contraseña reseteada",
          message: `La contraseña de ${row.username} ahora es Temp123.`,
          type: 1,
        });
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: error?.response?.data?.detail || "No se pudo resetear la contraseña.",
          type: 2,
        });
      }
    },

    async deleteUser(row) {
      if (this.isAdminUser(row)) {
        this.showToast({
          title: "Acción bloqueada",
          message: "No se puede eliminar un usuario administrador.",
          type: 2,
        });
        return;
      }

      const ok = await this.confirmDialogue({
        title: "¿Eliminar usuario?",
        message: `Se eliminará el usuario ${row.first_name} ${row.last_name}.`,
        okButton: "Eliminar",
      });

      if (!ok) return;

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

    openEdit(row) {
      this.$refs.userEditModal.openModal(row);
    },

    filterTable() {
      this.getUsers(1);
    },

    onUserCreated() {
      this.getUsers(1);
    },

    onUserUpdated() {
      this.getUsers(this.page);
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
    <UserCreateModal ref="userCreateModal" @user:created="onUserCreated" />
    <UserEditModal ref="userEditModal" @user:updated="onUserUpdated" />

    <div class="row align-items-center mb-2">
      <div class="col-12 col-md-4 mb-2 mb-md-0">
        <button class="btn btn-primary btn-sm" @click="$refs.userCreateModal.openModal()">
          <i class="bi bi-person-plus"></i> Agregar Usuario
        </button>
      </div>

      <div class="col-12 col-md-8">
        <div class="input-group input-group-sm">
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
      <div class="users-table-wrapper">
        <table-lite
          class="mb-3 users-table"
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
                class="btn btn-primary btn-sm me-1"
                type="button"
                @click.stop="openEdit(data.value)"
                title="Editar"
              >
                <i class="bi bi-pencil-square"></i>
              </button>

              <button
                v-if="!isAdminUser(data.value)"
                class="btn btn-warning btn-sm me-1"
                type="button"
                @click.stop="toggleActive(data.value)"
                title="Activar / desactivar"
              >
                <i class="bi" :class="data.value.is_active ? 'bi-person-dash' : 'bi-person-check'"></i>
              </button>

              <button
                class="btn btn-info btn-sm me-1"
                type="button"
                @click.stop="resetPassword(data.value)"
                title="Resetear contraseña"
              >
                <i class="bi bi-key"></i>
              </button>

              <button
                v-if="!isAdminUser(data.value)"
                class="btn btn-danger btn-sm"
                type="button"
                @click.stop="deleteUser(data.value)"
                title="Eliminar"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </template>
        </table-lite>
      </div>
    </ListContent>
  </SystemContent>
</template>

<style scoped>
.users-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  min-width: 1300px;
}

.users-table-wrapper :deep(table) {
  width: 100% !important;
}
</style>
