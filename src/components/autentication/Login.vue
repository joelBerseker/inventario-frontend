<script>
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService";
import axios from "axios";
import MyForm from "@/components/my_components/MyForm.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import Icon from "@/components/my_other_components/Icon.vue";
import AppContent from "@/AppContent.vue";
export default defineComponent({
  name: "Login",
  inject: ["showToast"],
  data() {
    return {
      user: {
        username: null,
        password: null,
      },
      loadingButton: false,
      validated: false,
      mode: 1,
      loadingAppContent: true,
    };
  },
  mixins: [ValidationFunctions],
  components: {
    MyForm,
    Icon,
    AppContent,
  },
  created() {
    this.loadingAppContent = false;
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.login();
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

        //await this.loadingApp(true)
        this.$router.push("/home");
      } catch (e) {
        this.showToast({
          title: "Ocurrió un error ",
          message: "Usuario y contraseña no válidos, verifique si los datos ingresados son correctos.",
          type: 2,
        });
      } finally {
        this.loadingButton = false;
      }
    },
  },
});
</script>

<template>
  <AppContent :loading.sync="loadingAppContent">
    <div class="mx-auto center justify-content-center bg-color-2">
      <div class="container">
        <div class="row justify-content-md-center" align-h="center">
          <div class="col-6 mb-3">
            <div class="card login">
              <div class="row g-0">
                <div class="col-5 image">
                  <div class="image-cover"></div>
                </div>
                <div class="col-7 content">
                  <div class="card-body">
                    <div class="text-center mb-1">
                      <Icon size="50px" :mode="2" :bg-mode="1"></Icon>
                      <p class="title-text color-3 mb-2">Gestion de Inventarios</p>
                      <hr class="m-0 mb-2" />
                      <p class="secondary-text">Ingrese su usuario y contraseña para ingresar al sistema</p>
                    </div>

                    <MyForm class="mb-3" name="Usuario">
                      <div class="input-group input-group-sm">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="email" class="form-control form-control-sm" v-model="user.username" />
                      </div>
                    </MyForm>
                    <MyForm class="mb-3" name="Contraseña">
                      <div class="input-group input-group-sm">
                        <span class="input-group-text"><i class="bi bi-lock"></i></span>
                        <input type="password" v-model="user.password" class="form-control form-control-sm" />
                      </div>
                    </MyForm>

                    <div class="text-end">
                      <button
                        type="submit"
                        @click="onSubmit"
                        class="btn btn-primary btn-sm button-space"
                        :disabled="loadingButton"
                      >
                        <i v-if="!loadingButton" class="bi bi-play-circle"></i>
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
      </div>
    </div>
  </AppContent>
</template>
<style scoped>
.login {
  overflow: hidden;
  background-color: var(--my-c1) !important;
}
.image {
  background-image: url("https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80");
  background-position: center;
  background-size: cover;
}
.image-cover {
  height: 100%;
  width: 100%;
  background-color: #41659710;
}
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
