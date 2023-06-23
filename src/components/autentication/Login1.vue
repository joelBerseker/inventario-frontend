<template>
  <div class="mx-auto center justify-content-center">
    <Container>
      <Row align-h="center">
        <Col xl="5" lg="6" md="8" sm="11">
          <Card class="login-card" body-class="mx-3 my-2">
            <div>
              <router-link :to="{ name: 'Home' }" class="title-page-link">
                <h1
                  class="d-flex justify-content-center text-dancing"
                  style="margin-bottom: 1.8rem"
                >
                  <span style="color: #f7912b; font-size: 2.8rem;!important"
                    ><strong>Healthy</strong></span
                  >&nbsp;
                  <span style="color: #f7912b; font-size: 2.8rem;!important"
                    ><strong>Fruits</strong></span
                  >
                </h1>
              </router-link>
            </div>
            <Alert
              :show="message.show"
              dismissible
              @dismissed="message.show = false"
              :variant="message.variant"
            >
              {{ message.error }}
            </Alert>

            <form @submit="onSubmit">
              <FormGroup
                class="mt-4 m2"
                label="Correo electronico"
                label-size="sm"
              >
                <Row>
                  <Col>
                    <InputGroup>
                      <template #prepend>
                        <InputGroupText class="item-left">
                          <Icon
                            icon="person-fill"
                            scale="1.2"
                            class="align-middle"
                          ></Icon
                        ></InputGroupText>
                      </template>
                      <FormInput
                        class="item-right"
                        id="input-username"
                        v-model="username"
                        placeholder="usuario@gmail.com"
                        required
                        autocomplete="username"
                      ></FormInput>
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup label="Contraseña" label-size="sm">
                <Row align-h="center">
                  <Col>
                    <InputGroup>
                      <template #prepend>
                        <InputGroupText class="item-left">
                          <Icon
                            icon="lock-fill"
                            scale="1.1"
                            class="align-middle"
                          ></Icon
                        ></InputGroupText>
                      </template>
                      <FormInput
                        id="input-password"
                        type="password"
                        v-model="password"
                        class="item-right"
                        required
                        autocomplete="current-password"
                      >
                      </FormInput>
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <Row>
                <Col>
                  <Button
                    :disabled="butom_loading"
                    pill
                    variant="primary"
                    class="float-right px-5 mt-2"
                    type="submit"
                  >
                    Ingresar
                  </Button>
                </Col>
              </Row>
            </form>
            <hr class="bg-white mt-3 m2" />

            <div class="d-flex justify-content-center">
              <small
                >¿No tienes una cuenta?
                <router-link class="a-mod" :to="{ name: 'home' }"
                  >Registrate aqui.</router-link
                ></small
              >
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      butom_loading: false,
      errortext: [],
      username: "",
      password: "",
      id: "",
      message: {
        show: false,
        variant: "danger",
        error: "Ocurrio un error desconocido.",
      },
      validation: {
        onlyTextAndNumber: /^[a-zA-Z0-9]*$/,
        username: /^([a-z0-9_-]+)@unsa\.edu.pe$/,
        inputusername: null,
        inputPassword: null,
      },

      visible: {
        empty_username: false,
        wrong_username: false,
        empty_password: false,
      },
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissCountDown2: 0,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },

    /**
     * @param {String} text Texto ingresado
     * @description Verifica si el texto esta vacio
     * @return {boolean}
     */
    textEmpty(text) {
      return text == "";
    },
    /**
     * @param {String} text Texto ingresado
     * @description Verifica si el texto cumple con la expresion regular de la variable onlyusername
     * @return {boolean}
     */
    onlyusername(text) {
      return this.validation.username.test(text);
    },

    /**
     * @description Metodo que verifica el tamaño del texto y los caracteres ingresados
     * del input del username
     * @return {boolean}
     */
    usernameValidation() {
      if (this.textEmpty(this.username)) {
        return new Boolean(null);
      }
      return true;
      //return this.onlyusername(this.username);
    },
    /**
     * @description Metodo que verifica el tamaño del texto y los caracteres ingresados
     * del input del password
     * @return {boolean}
     */
    passwordValidation() {
      if (this.textEmpty(this.password)) {
        return new Boolean(null);
      }
    },

    /**
     * @description Metodo de cuenta regresiva para la duracion de la vista de la alerta
     */
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    /**
     * @description Metodo para mostrar la alerta de datos incorrectos
     */
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
      this.message.error = "No existe ninguna cuenta con los datos ingresados";
      this.message.show = true;
    },
    /**
     * @description Metodo de cuenta regresiva para la duracion de la vista de la alerta
     */
    countDownChanged2(dismissCountDown) {
      this.dismissCountDown2 = dismissCountDown;
    },

    /**
     * @description Metodo para mostrar la alerta de ausencia de rol
     */
    showAlert2() {
      this.dismissCountDown2 = this.dismissSecs;
    },

    onSubmit(evt) {
      this.validation.inputusername = this.usernameValidation();
      this.validation.inputPassword = this.passwordValidation();
      evt.preventDefault();
      if (this.usernameValidation() && this.passwordValidation) {
        this.login();
      } else {
        this.showAlert();
      }
    },

    /**
     * @description Metodo para mostrar las alertas de validaciones
     */
    showValidations() {
      if (this.textEmpty(this.username)) {
        this.visible.empty_username = true;
      } else {
        this.visible.empty_username = false;
      }
      if (!this.onlyusername(this.username)) {
        this.visible.wrong_username = true;
      } else {
        this.visible.wrong_username = false;
      }
      if (this.textEmpty(this.password)) {
        this.visible.empty_password = true;
      } else {
        this.visible.empty_password = false;
      }
    },

    /**
     * @description Metodo para loguear a un usuario y setea el token y el id del usuario logueado
     */
    async login() {
      this.butom_loading = true;
      const credentials = {
        username: this.username,
        password: this.password,
      };
      try {
        //Verifica si un usuario existe en la BD , y si existe guarda su token
        // de manera persistenta para que quede en el sistema durante su
        // tiempo de sesion
        const obtainToken = await AuthService.obtain_token(credentials);
        const token = obtainToken.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        this.$store.dispatch("login", { token });
        // o un usuario sin rol que este ultimo no puede ni ingresar al sistema
        this.$router.push("/home");
      } catch (e) {
        this.showAlert();
      } finally {
        this.butom_loading = false;
      }
    },
  },
  async created() {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.item-left {
  border-top-left-radius: 1.1rem;
  border-bottom-left-radius: 1.1rem;
}
.item-right {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
