<template>
  <div class="profile">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <div class="profile-avatar">
            <img
              :src="displayUser.photo"
              alt="Foto de perfil"
              class="profile-photo"
            />
          </div>
        </div>
        <div class="col-lg-8">
          <div class="profile-details">
            <div class="profile-info">
              <div class="profile-field">
                <div class="profile-field-label">Nombre:</div>
                <div class="profile-field-value" v-if="!editing">
                  {{ displayUser.first_name }} {{ displayUser.last_name }}
                </div>
                <input
                  type="text"
                  class="form-control"
                  v-model="editUser.first_name"
                  v-if="editing"
                />
                <input
                  type="text"
                  class="form-control"
                  v-model="editUser.last_name"
                  v-if="editing"
                />
              </div>
              <div class="profile-field">
                <div class="profile-field-label">Email:</div>
                <div class="profile-field-value">{{ displayUser.email }}</div>
              </div>
              <div class="profile-field">
                <div class="profile-field-label">Dirección:</div>
                <div class="profile-field-value" v-if="!editing">
                  {{ displayUser.address }}
                </div>
                <textarea
                  class="form-control"
                  v-model="editUser.address"
                  v-if="editing"
                ></textarea>
              </div>
              <div class="profile-field">
                <div class="profile-field-label">Teléfono:</div>
                <div class="profile-field-value" v-if="!editing">
                  {{ displayUser.phone }}
                </div>
                <input
                  type="text"
                  class="form-control"
                  v-model="editUser.phone"
                  v-if="editing"
                />
              </div>
              <div class="profile-field">
                <div class="profile-field-label">RUC:</div>
                <div class="profile-field-value" v-if="!editing">
                  {{ displayUser.ruc }}
                </div>
                <input
                  type="text"
                  class="form-control"
                  v-model="editUser.ruc"
                  v-if="editing"
                />
              </div>
            </div>
            <div class="profile-actions">
              <button
                class="btn btn-primary profile-action-btn"
                @click="toggleEditing"
              >
                {{ editing ? "Cancelar" : "Editar perfil" }}
              </button>
              <button
                class="btn btn-success profile-action-btn"
                v-if="editing"
                @click="saveChanges"
              >
                Guardar cambios
              </button>
              <button
                class="btn btn-secondary profile-action-btn"
                v-if="editing"
                @click="cancelChanges"
              >
                Cancelar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
    };
  },
  async created() {
    this.getUser();
    console.log(this.user.value);
  },
  methods: {
    getUser() {
      var path = url + "user/api/" + this.$store.getters.getId + "/";
      axios
        .get(path)
        .then((response) => {
          this.user = response.data;
          this.editUser = { ...this.user };
          this.displayUser = { ...this.user };
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
.profile {
  min-height: calc(
    100vh - 70px
  ); /* Ajustar el valor 70px según la altura del encabezado de tu página */
  padding: 20px 0;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
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
