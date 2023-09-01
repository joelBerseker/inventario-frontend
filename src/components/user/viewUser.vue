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
                      <MyForm name="Imagen" v-if="editing">
                        <input type="file" class="form-control form-control-sm mb-2" @change="uploadImage" />
                      </MyForm>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-12 text-center" v-if="!editing">
                      <p class="title-text mb-2">{{ displayUser.first_name }} {{ displayUser.last_name }}</p>
                      <hr class="w-75 m-auto mb-3 mt-0" />
                    </div>
                    <div class="col-6" v-if="editing">
                      <MyForm class="mb-3" name="Nombre">
                        <input type="text" class="form-control form-control-sm" v-model="editUser.first_name" />
                      </MyForm>
                    </div>
                    <div class="col-6" v-if="editing">
                      <MyForm class="mb-3" name="Apellidos">
                        <input type="text" class="form-control form-control-sm" v-model="editUser.last_name" />
                      </MyForm>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm class="mb-3" name="Dirección">
                        <div v-if="!editing">
                          {{ displayUser.address }}
                        </div>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.address"
                          v-if="editing"
                        />
                      </MyForm>
                    </div>
                    <div class="col-6">
                      <MyForm class="mb-3" name="Telefono">
                        <div v-if="!editing">
                          {{ displayUser.phone }}
                        </div>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.phone"
                          v-if="editing"
                        />
                      </MyForm>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm name="Email">
                        <div v-if="!editing">{{ displayUser.email }}</div>
                        <input
                          disabled
                          type="text"
                          class="form-control form-control-sm"
                          v-model="editUser.email"
                          v-if="editing"
                        />
                      </MyForm>
                    </div>
                    <div class="col-6">
                      <MyForm name="RUC">
                        <div v-if="!editing">
                          {{ displayUser.ruc }}
                        </div>
                        <input type="text" class="form-control form-control-sm" v-model="editUser.ruc" v-if="editing" />
                      </MyForm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <p class="title-text mb-3">Otras configuraciones</p>
            <MyForm class="mb-3" name="IGV">
              <div v-if="!editing">{{ displayUser.igv }}</div>
              <input type="text" class="form-control form-control-sm" v-model="editUser.igv" v-if="editing" />
            </MyForm>
            <hr class="m-auto mb-3 mt-0" />
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="editUser.dark_mode"
                :disabled="!editing"
              />
              <label class="form-check-label">Modo Oscuro</label>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="editUser.manage_stock"
                :disabled="!editing"
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
      <button v-if="!editing" class="btn btn-sm btn-primary profile-action-btn ms-1" @click="toggleEditing">
        <i class="bi bi-pen"></i> Editar
      </button>
      <button v-else class="btn btn-sm btn-secondary profile-action-btn" @click="cancelChanges">
        <i class="bi bi-x-circle"></i> Cancelar
      </button>
      <button class="btn btn-sm btn-primary profile-action-btn ms-1" v-if="editing" @click="saveChanges">
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
        email: "",
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        ruc: "",
        photo: "",
      },
      editUser: {},
      displayUser: {},
      loadingContentSystem: true,
      topbar: {
        title: "Usuario",
        icon: "bi bi-person-vcard",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Usuario",
            link: "",
          },
        ],
      },
    };
  },
  async created() {
    this.changeTopbar(this.topbar);
    this.getUser();
  },
  inject: ["confirmLogout"],
  props: ["changeTopbar"],
  components: {
    SystemContent,
    MyForm,
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
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        this.editPhto = true;
      };
    },
    getUser() {
      var path = url + "user/api/" + this.$store.getters.getId + "/";
      axios
        .get(path)
        .then((response) => {
          this.user = response.data;
          console.log(this.user);
          this.editUser = { ...this.user };
          this.displayUser = { ...this.user };
          this.loadingContentSystem = false;
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    toggleEditing() {
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
      // Aquí puedes realizar la llamada a la API para guardar los cambios
      var path = url + `user/api/` + this.$store.getters.getId + "/";
      var form_data = new FormData();
      for (var key in this.editUser) {
        if (key == "photo" && !this.editPhto) continue;
        form_data.append(key, this.editUser[key]);
      }
      console.log(this.editUser);
      /*if (this.editUser.photo != null) {
        form_data.append("photo", this.editUser.photo);
      }*/
      axios
        .put(path, form_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.user = response.data;
          this.editUser = { ...this.user };
          this.displayUser = { ...this.user };
          AuthService.setUser(this.user);
          console.log("editado");
          console.log(response);
        })
        .catch(() => {
          console.log("hubo un error");
        });

      // utilizando this.editUser
      console.log("GUARDADO");
      // ...
      this.user = { ...this.editUser };
      this.toggleEditing();
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

.profile-details {
  display: flex;
  flex-direction: column;
}

.profile-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.profile-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.profile-field {
  margin-bottom: 10px;
}

.profile-field-label {
  font-weight: bold;
  color: #555;
}

.profile-field-value {
  color: #888;
}
</style>
