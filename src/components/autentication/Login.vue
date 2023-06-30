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
                  <span class="input-group-text"
                    ><i class="bi bi-person"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="user.username"
                    id="user"
                    required
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-lock"></i
                  ></span>
                  <input
                    type="password"
                    v-model="user.password"
                    class="form-control"
                    id="ruc"
                    required
                  />
                </div>
              </div>
              <div class="text-end">
                <button
                  type="submit"
                  @click="onSubmit"
                  class="btn btn-dark btn-sm button-space"
                >
                  <i class="bi bi-send"></i> Ingresar
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
    };
  },
  methods: {
    goTo(url) {
      this.$router.push(url);
    },
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
      const credentials = {
        email: this.user.username,
        password: this.user.password,
      };
      try {
        //Verifica si un usuario existe en la BD , y si existe guarda su token
        // de manera persistenta para que quede en el sistema durante su
        //this.getTasks();
        const obtainToken = await AuthService.obtain_token(credentials);
        const token = obtainToken.access;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // o un usuario sin rol que este ultimo no puede ni ingresar al sistema
        this.$router.push("/home");
      } catch (e) {
        this.showAlert("al validar token");
      } finally {  
        this.butom_loading = false;
      }
      
    },
  },
});
</script>
