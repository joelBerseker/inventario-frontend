<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <div class="row">
      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <p class="title-text mb-3">Mi Perfil</p>

            <div class="p-0">
              <div class="row">
                <div class="container">
                  <div class="row justify-content-center mb-2">
                    <div class="col-6">
                      <div class="profile-avatar text-center" style="margin: 0 auto">
                        <img
                          v-if="previewImage != null && editing"
                          :src="previewImage"
                          alt="Foto de perfil"
                          class="profile-photo"
                        />
                        <span v-else>
                          <img
                            v-if="user.photo == null"
                            src="../../assets/person-circle.svg"
                            alt="Foto de perfil"
                            class="profile-photo"
                          />
                          <img v-else :src="displayUser.photo" alt="Foto de perfil" class="profile-photo" />
                        </span>
                      </div>

                      <MyForm name="Imagen" v-if="editing && canEditProfile">
                        <input type="file" class="form-control form-control-sm mb-2" @change="uploadImage" />
                      </MyForm>
                    </div>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <div class="col-12 text-center" v-if="!editing">
                      <p class="title-text mb-2">{{ displayUser.first_name }} {{ displayUser.last_name }}</p>
                      <p class="secondary-text mb-2">@{{ displayUser.username }}</p>
                      <hr class="w-75 m-auto mb-3 mt-0" />
                    </div>

                    <div class="col-6" v-if="editing && canEditProfile">
                      <MyForm class="mb-3" name="Nombre">
                        <input type="text" class="form-control form-control-sm" v-model="editUser.first_name" />
                      </MyForm>
                    </div>

                    <div class="col-6" v-if="editing && canEditProfile">
                      <MyForm class="mb-3" name="Apellidos">
                        <input type="text" class="form-control form-control-sm" v-model="editUser.last_name" />
                      </MyForm>
                    </div>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm class="mb-3" name="Username">
                        <div v-if="!editing || !canEditProfile">
                          {{ displayUser.username }}
                        </div>
                        <input
                          v-else
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.username"
                        />
                      </MyForm>
                    </div>

                    <div class="col-6">
                      <MyForm class="mb-3" name="Dirección">
                        <div v-if="!editing || !canEditProfile">
                          {{ displayUser.address || "-" }}
                        </div>
                        <input
                          v-else
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.address"
                        />
                      </MyForm>
                    </div>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm class="mb-3" name="Teléfono">
                        <div v-if="!editing || !canEditProfile">
                          {{ displayUser.phone || "-" }}
                        </div>
                        <input
                          v-else
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.phone"
                        />
                      </MyForm>
                    </div>

                    <div class="col-6">
                      <MyForm name="Email">
                        <div v-if="!editing || !canEditProfile">
                          {{ displayUser.email || "-" }}
                        </div>
                        <input
                          v-else
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.email"
                        />
                      </MyForm>
                    </div>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm name="RUC">
                        <div v-if="!editing || !canEditProfile">
                          {{ displayUser.ruc || "-" }}
                        </div>
                        <input
                          v-else
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.ruc"
                        />
                      </MyForm>
                    </div>

                    <div class="col-6">
                      <MyForm name="Rol">
                        <div>
                          {{ roleLabel }}
                        </div>
                      </MyForm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!-- col-6 -->

      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <p class="title-text mb-3">Otras configuraciones</p>

            <MyForm class="mb-3" name="IGV">
              <div v-if="!editing || !canEditProfile">{{ displayUser.igv }}</div>
              <input
                v-else
                type="text"
                class="form-control form-control-sm"
                v-model="editUser.igv"
              />
            </MyForm>

            <hr class="m-auto mb-3 mt-0" />

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="editUser.dark_mode"
                :disabled="!editing || !canEditProfile"
              />
              <label class="form-check-label">Modo Oscuro</label>
            </div>

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="editUser.manage_stock"
                :disabled="!editing || !canEditProfile"
              />
              <label class="form-check-label">Modo Facturación</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-actions mt-3">
      <button class="btn btn-sm btn-danger profile-action-btn" v-if="!editing" @click="buttonLogout">
        <i class="bi bi-power"></i> Cerrar Sesión
      </button>

      <button
        v-if="!editing && canEditProfile"
        class="btn btn-sm btn-primary profile-action-btn ms-1"
        @click="toggleEditing"
      >
        <i class="bi bi-pen"></i> Editar
      </button>

      <button
        v-if="editing && canEditProfile"
        class="btn btn-sm btn-secondary profile-action-btn"
        @click="cancelChanges"
      >
        <i class="bi bi-x-circle"></i> Cancelar
      </button>

      <button
        v-if="editing && canEditProfile"
        class="btn btn-sm btn-primary profile-action-btn ms-1"
        @click="saveChanges"
      >
        <i class="bi bi-check-lg"></i> Guardar
      </button>
    </div>
  </SystemContent>
</template>

<script>
import axios from "axios";
import SystemContent from "@/components/system/SystemContent.vue";
import MyForm from "@/components/my_components/MyForm.vue";
import AuthService from "@/services/AuthService";

const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  name: "Profile",
  data() {
    return {
      editing: false,
      editPhto: false,
      previewImage: null,
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        ruc: "",
        photo: "",
        igv: "",
        dark_mode: false,
        manage_stock: false,
      },
      editUser: {},
      displayUser: {},
      loadingContentSystem: true,
      topbar: {
        title: "Usuario",
        icon: "bi bi-person-vcard",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Usuario", link: "" },
        ],
      },
    };
  },
  async created() {
    this.changeTopbar(this.topbar);
    this.getUser();
  },
  inject: ["confirmLogout", "showToast"],
  props: ["changeTopbar"],
  components: {
    SystemContent,
    MyForm,
  },
  computed: {
    canEditProfile() {
      return !!(this.displayUser.is_superuser || this.displayUser.is_admin);
    },
    roleLabel() {
      if (this.displayUser.is_superuser || this.displayUser.is_admin) return "Admin";
      if (this.displayUser.is_staff) return "Vendedor";
      return "Usuario";
    },
  },
  methods: {
    buttonLogout() {
      this.confirmLogout();
    },
    uploadImage(e) {
      const image = e.target.files[0];
      this.editUser.photo = image;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (ev) => {
        this.previewImage = ev.target.result;
        this.editPhto = true;
      };
    },
    getUser() {
      const path = url + "user/api/" + this.$store.getters.getId + "/";
      axios
        .get(path)
        .then((response) => {
          this.user = response.data;
          this.editUser = { ...this.user };
          this.displayUser = { ...this.user };
          this.loadingContentSystem = false;
        })
        .catch((e) => {
          console.log(e.message);
          this.loadingContentSystem = false;
        });
    },
    toggleEditing() {
      if (!this.canEditProfile) return;

      this.previewImage = null;
      this.editing = !this.editing;

      if (this.editing) {
        this.editUser = { ...this.user };
      } else {
        this.editUser = { ...this.user };
        this.displayUser = { ...this.user };
      }
    },
    async saveChanges() {
      if (!this.canEditProfile) return;

      const path = url + `user/api/` + this.$store.getters.getId + "/";
      const form_data = new FormData();

      for (const key in this.editUser) {
        if (key === "photo" && !this.editPhto) continue;
        form_data.append(key, this.editUser[key] ?? "");
      }

      try {
        const response = await axios.put(path, form_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.user = response.data;
        this.editUser = { ...this.user };
        this.displayUser = { ...this.user };
        AuthService.setUser(this.user);

        this.showToast({
          title: "Guardado correctamente",
          message: "Tu perfil fue actualizado.",
          type: 1,
        });

        this.toggleEditing();
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se pudo actualizar el perfil.",
          type: 2,
        });
      }
    },
    cancelChanges() {
      this.toggleEditing();
    },
  },
};
</script>

<style scoped>
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.253);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>