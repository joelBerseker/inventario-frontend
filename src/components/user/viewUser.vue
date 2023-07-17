<template>
  <Content ref="content" :loading="loading">
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

                    <div class="profile-avatar text-center" style="margin: 0 auto;">

                      <!--img :src="displayUser.photo" alt="Foto de perfil" class="profile-photo" /-->
                      <img
                        src="data:image/png;base64,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"
                        alt="Foto de perfil" class="profile-photo" />
                    </div>
                    <MyForm name="Imagen" v-if="editing">
                      <input type="file" class="form-control form-control-sm mb-2" id="inputGroupFile01">
                    </MyForm>
                  </div>
                </div>
              </div>
                <div class="container">
                  <div class="row">
                    <div class="col-12 text-center" v-if="!editing">
                      <p class="title-text mb-2">{{ displayUser.first_name }} {{ displayUser.last_name }}</p>
                      <hr class="w-75 m-auto mb-3 mt-0"/>
                    </div>
                    <div class="col-6" v-if="editing">
                      <MyForm class="mb-3" name="Nombre">
                        <input type="text" class="form-control form-control-sm" v-model="editUser.first_name"
                           />
                      </MyForm>
                    </div>
                    <div class="col-6" v-if="editing">
                      <MyForm class="mb-3" name="Apellidos" >
                        <input type="text" class="form-control form-control-sm" v-model="editUser.last_name" />
                      </MyForm>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm class="mb-3" name="Dirección">
                        <div class="profile-field-value" v-if="!editing">
                          {{ displayUser.address }}
                        </div>
                        <input type="text" class="form-control form-control-sm" v-model="editUser.address"
                          v-if="editing" />
                      </MyForm>
                    </div>
                    <div class="col-6">

                      <MyForm class="mb-3" name="Telefono">
                        <div class="profile-field-value" v-if="!editing">
                          {{ displayUser.phone }}
                        </div>
                        <input type="text" class="form-control form-control-sm" v-model="editUser.phone" v-if="editing" />
                      </MyForm>
                    </div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <MyForm class="mb-3" name="Email">
                        <div class="profile-field-value" v-if="!editing">{{ displayUser.email }}</div>
                        <input disabled type="text" class="form-control form-control-sm" v-model="editUser.email"
                          v-if="editing" />
                      </MyForm>
                    </div>
                    <div class="col-6">
                      <MyForm class="mb-3" name="RUC">
                        <div class="profile-field-value" v-if="!editing">
                          {{ displayUser.ruc }}
                        </div>
                        <input type="text" class="form-control form-control-sm" v-model="editUser.ruc" v-if="editing" />
                      </MyForm>
                    </div>
                  </div>
                </div>
              </div>
              <div class="profile-actions text-end">

                <button v-if="!editing" class="btn btn-sm btn-primary profile-action-btn" @click="toggleEditing">
                  <i class="bi bi-pen"></i> Editar
                </button>
                <button v-else class="btn btn-sm btn-secondary profile-action-btn" @click="saveChanges">
                  <i class="bi bi-x-circle"></i> Cancelar
                </button>
                <button class="btn btn-sm btn-success profile-action-btn ms-1" v-if="editing" @click="saveChanges">
                  <i class="bi bi-check-circle"></i> Guardar
                </button>
                <button class="btn btn-sm btn-danger profile-action-btn ms-1" v-if="!editing" @click="saveChanges">
                  <i class="bi bi-power"></i> Cerrar Sesión
                </button>

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
                        <div class="profile-field-value" v-if="!editing">
                          0.18%
                        </div>
                        <input type="text" class="form-control form-control-sm" v-model="editUser.first_name"
                          v-if="editing" />
                      </MyForm>
          </div>
        </div>
      </div>
    </div>

  </Content>
</template>

<script>
import axios from "axios";
import Content from '@/components/home/Content.vue'
import MyForm from "@/components/my_components/MyForm.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
export default {
  name: "Profile",
  data() {
    return {
      editing: false,
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
      loading: true,
      topbar: {
        title: "Usuario",
        icon: "bi bi-person-vcard",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home"
          },
          {
            name: "Usuario",
            link: ""
          },

        ],
      }
    };
  },
  async created() {
    this.changeTopbar(this.topbar);
    this.getUser();
    console.log(this.user.value);
  },
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  components: {
    Content, MyForm
  },
  methods: {
    loadingContent(loading) {
      this.$refs.content.loadingContent(loading);
    },
    getUser() {
      var path = url + "user/api/" + this.$store.getters.getId + "/";
      axios
        .get(path)
        .then((response) => {
          this.user = response.data;
          this.editUser = { ...this.user };
          this.displayUser = { ...this.user };
          this.loadingContent(false)
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    toggleEditing() {
      this.editing = !this.editing;
      if (this.editing) {
        this.editUser = { ...this.user };
      } else {
        this.editUser = { ...this.user };
        this.displayUser = { ...this.user };
      }
    },
    saveChanges() {
      // Aquí puedes realizar la llamada a la API para guardar los cambios
      var path = url + `user/api/` + this.$store.getters.getId + "/";
      var form_data = new FormData();
      for (var key in this.user) {
        form_data.append(key, this.user[key]);
      }
      axios
        .put(path, form_data)
        .then((response) => {
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
