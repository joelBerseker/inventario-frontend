<template>
  <div class="mx-auto center justify-content-center bg-dark">
    <div class="container">
      <div class="row justify-content-md-center" align-h="center">
        <div class="col-4 mb-3">
          <div class="card box">
            <div class="card-body">
              <p class="title-text mb-3">Sistema de Inventarios</p>
              <div class="mb-3">
                <label for="ruc" class="form-label">Usuario</label>

                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="email" class="form-control" v-model="user.username" id="user" required />
                </div>
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" v-model="user.password" class="form-control" id="ruc" required />
                </div>
              </div>
              <div class="text-end">
                <button type="submit" @click="onSubmit" class="btn btn-dark btn-sm button-space"
                  :disabled="loadingButton">
                  <i v-if="!loadingButton" class="bi bi-send"></i>
                  <div v-else class="spinner-border spinner-border-sm"></div>
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.center {
  height: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  margin: 0;
  overflow-x: hidden;
  overflow-y: hidden;

  min-height: 100%;
}
</style>
<script>
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService";
import axios from "axios";
export default defineComponent({
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      loadingButton: false
    };
  },
  props: [
    "loadingApp",
  ],
  created() {
    this.loadingApp(false)
  },
  methods: {
    textEmpty(text) {
      return text == "";
    },

    passwordValidation() {
      if (this.textEmpty(this.password)) {
        return new Boolean(null);
      }
    },

    usernameValidation() {
      if (this.textEmpty(this.username)) {
        return new Boolean(null);
      }
      return true;
    },
    passwordValidation() {
      if (this.textEmpty(this.password)) {
        return new Boolean(null);
      }
      //validar tamaño
      return true;
    },

    onSubmit(evt) {
      evt.preventDefault();
      if (this.usernameValidation() && this.passwordValidation) {
        this.login();
      } else {
        this.showAlert("luego de verificar");
      }
    },
    showAlert(msg) {
      console.log(msg);
    },
    async login() {
      this.loadingButton = true;
      const credentials = {
        email: this.user.username,
        password: this.user.password,
      };
      try {

        const obtainToken = await AuthService.obtain_token(credentials);
        const token = obtainToken.access;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        this.loadingApp(true)
        this.$router.push("/home");
      } catch (e) {
        this.showAlert("al validar token");
      } finally {
        this.loadingButton = false;
      }

    },
  },

});
</script>
