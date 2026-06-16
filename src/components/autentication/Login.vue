<script>
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService";
import axios from "axios";
import MyForm from "@/components/my_components/MyForm.vue";
import MyInput from "@/components/my_components/MyInput.vue";
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
      loadingAppContent: true,
      showPassword: false,
    };
  },
  mixins: [ValidationFunctions],
  components: {
    MyForm,
    Icon,
    AppContent,
    MyInput,
  },
  created() {
    this.loadingAppContent = false;
  },
  methods: {
    onSubmit(evt) {
      if (evt) evt.preventDefault();
      this.login();
    },

    onEnter() {
      if (!this.loadingButton) {
        this.login();
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async login() {
      if (this.loadingButton) return;

      this.loadingButton = true;

      const credentials = {
        username: this.user.username,
        password: this.user.password,
      };

      try {
        const obtainToken = await AuthService.obtain_token(credentials);
        const token = obtainToken.access;

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const currentUser = await AuthService.getUser();

        if (obtainToken?.must_change_password || currentUser?.must_change_password) {
          await this.$router.replace({ name: "change-password" });
          return;
        }

        if (currentUser?.is_superuser || currentUser?.is_admin) {
          await this.$router.replace({ name: "home" });
        } else if (currentUser?.is_staff) {
          await this.$router.replace({ name: "outputs" });
        } else {
          await this.$router.replace({ name: "home" });
        }
      } catch (e) {
        console.log(e);
        this.showToast({
          title: "Ocurrió un error",
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
    <div class="mx-auto center justify-content-center my-bg2">
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
                      <p class="title-text my-c3 mb-2">Gestion de Inventarios</p>
                      <hr class="m-0 mb-2" />
                      <p class="secondary-text">
                        Ingrese su username y contraseña para ingresar al sistema
                      </p>
                    </div>

                    <MyInput
                      name="Username"
                      type="text"
                      v-model="user.username"
                      class="mb-3"
                      @keyup.enter="onEnter"
                    >
                      <template v-slot:pre>
                        <i class="bi bi-person"></i>
                      </template>
                    </MyInput>

                    <div class="password-wrapper mb-3">
                      <MyInput
                        name="Contraseña"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="user.password"
                        @keyup.enter="onEnter"
                      >
                        <template v-slot:pre>
                          <i class="bi bi-lock"></i>
                        </template>
                      </MyInput>

                      <button
                        type="button"
                        class="password-toggle mt-3"
                        @click="togglePassword"
                        :disabled="loadingButton"
                        :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>

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
  border: none !important;
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

.password-wrapper {
  position: relative;
}

.password-wrapper :deep(input) {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.65rem;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0;
  color: #6c757d;
  cursor: pointer;
  z-index: 10;
}

.password-toggle:hover {
  color: #212529;
}
</style>