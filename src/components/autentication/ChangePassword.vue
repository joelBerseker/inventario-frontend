<template>
  <AppContent :loading.sync="loadingAppContent">
    <div class="mx-auto center justify-content-center my-bg2">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-5 mb-3">
            <div class="card login">
              <div class="card-body">
                <div class="text-center mb-3">
                  <p class="title-text my-c3 mb-2">Cambio obligatorio de contraseña</p>
                  <hr class="m-0 mb-2" />
                  <p class="secondary-text">
                    Tu contraseña fue reseteada. Debes ingresar una nueva para continuar.
                  </p>
                </div>

                <MyInput
                  name="Contraseña actual"
                  type="password"
                  v-model="form.current_password"
                  class="mb-3"
                >
                  <template v-slot:pre>
                    <i class="bi bi-lock"></i>
                  </template>
                </MyInput>

                <MyInput
                  name="Nueva contraseña"
                  type="password"
                  v-model="form.new_password"
                  class="mb-3"
                >
                  <template v-slot:pre>
                    <i class="bi bi-shield-lock"></i>
                  </template>
                </MyInput>

                <div class="text-end">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :disabled="loadingButton"
                    @click="changePassword"
                  >
                    <i v-if="!loadingButton" class="bi bi-check-lg"></i>
                    <div v-else class="spinner-border spinner-border-sm"></div>
                    Guardar nueva contraseña
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
  </AppContent>
</template>

<script>
import axios from "axios";
import AppContent from "@/AppContent.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import AuthService from "@/services/AuthService";

const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  name: "ChangePassword",
  inject: ["showToast"],
  components: {
    AppContent,
    MyInput,
  },
  data() {
    return {
      loadingAppContent: false,
      loadingButton: false,
      form: {
        current_password: "",
        new_password: "",
      },
    };
  },
  methods: {
    async changePassword() {
      if (!this.form.current_password || !this.form.new_password) {
        this.showToast({
          title: "Ocurrió un error",
          message: "Debe completar ambos campos.",
          type: 2,
        });
        return;
      }

      this.loadingButton = true;

      try {
        await axios.patch(`${url}user/api/change-password/`, this.form);

        AuthService.logout();

        this.showToast({
          title: "Contraseña actualizada",
          message: "Ahora inicia sesión con tu nueva contraseña.",
          type: 1,
        });

        await this.$router.replace({ name: "login" });
      } catch (error) {
        this.showToast({
          title: "Ocurrió un error",
          message: error?.response?.data?.detail || "No se pudo cambiar la contraseña.",
          type: 2,
        });
      } finally {
        this.loadingButton = false;
      }
    },
  },
};
</script>

<style scoped>
.login {
  overflow: hidden;
  background-color: var(--my-c1) !important;
  border: none !important;
}

.center {
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>