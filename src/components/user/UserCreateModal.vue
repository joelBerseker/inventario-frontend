<template>
  <MyModal
    ref="myModal"
    :id="'userCreateModal'"
    title="Agregar Usuario Vendedor"
    v-on:mymodal:close="closeModal"
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-6">
          <MyInput
            type="text"
            name="Nombres"
            v-model="form.first_name"
            :validation="validation.first_name"
            v-on:input="validateFirstName"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="Apellidos"
            v-model="form.last_name"
            :validation="validation.last_name"
            v-on:input="validateLastName"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="Correo"
            v-model="form.email"
            :validation="validation.email"
            v-on:input="validateEmail"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="Teléfono"
            v-model="form.phone"
            :validation="validation.phone"
            v-on:input="validatePhone"
          />
        </div>

        <div class="col-12">
          <MyInput
            type="text"
            name="Dirección"
            v-model="form.address"
            :validation="validation.address"
            v-on:input="validateAddress"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="RUC (opcional)"
            v-model="form.ruc"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="password"
            name="Contraseña temporal"
            v-model="form.password"
            :validation="validation.password"
            v-on:input="validatePassword"
          />
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-sm" @click="closeModal">
        Cancelar
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="buttonSave">
        Guardar
      </button>
    </div>
  </MyModal>
</template>

<script>
import axios from "axios";
import MyModal from "@/components/my_components/MyModal.vue";
import MyInput from "@/components/my_components/MyInput.vue";

const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  name: "UserCreateModal",
  inject: ["showToast"],
  components: {
    MyModal,
    MyInput,
  },
  data() {
    return {
      form: this.getInitialForm(),
      validation: {
        first_name: {},
        last_name: {},
        email: {},
        phone: {},
        address: {},
        password: {},
      },
    };
  },
  methods: {
    getInitialForm() {
      return {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        ruc: "",
        password: "",
        is_staff: true,
        is_admin: false,
        is_superuser: false,
      };
    },

    openModal() {
      this.form = this.getInitialForm();
      this.validation = {
        first_name: {},
        last_name: {},
        email: {},
        phone: {},
        address: {},
        password: {},
      };
      this.$refs.myModal.openModal();
    },

    closeModal() {
      this.$refs.myModal.closeModal();
    },

    validateFirstName() {
      this.validation.first_name = {
        isValid: !!this.form.first_name?.trim(),
        message: this.form.first_name?.trim() ? "" : "El nombre es requerido.",
      };
    },

    validateLastName() {
      this.validation.last_name = { isValid: true, message: "" };
    },

    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(this.form.email || "");
      this.validation.email = {
        isValid: valid,
        message: valid ? "" : "Correo inválido.",
      };
    },

    validatePhone() {
      const valid = !!this.form.phone?.trim();
      this.validation.phone = {
        isValid: valid,
        message: valid ? "" : "El teléfono es requerido.",
      };
    },

    validateAddress() {
      const valid = !!this.form.address?.trim();
      this.validation.address = {
        isValid: valid,
        message: valid ? "" : "La dirección es requerida.",
      };
    },

    validatePassword() {
      const valid = !!this.form.password?.trim() && this.form.password.length >= 6;
      this.validation.password = {
        isValid: valid,
        message: valid ? "" : "La contraseña debe tener al menos 6 caracteres.",
      };
    },

    validateForm() {
      this.validateFirstName();
      this.validateLastName();
      this.validateEmail();
      this.validatePhone();
      this.validateAddress();
      this.validatePassword();

      return (
        this.validation.first_name.isValid &&
        this.validation.email.isValid &&
        this.validation.phone.isValid &&
        this.validation.address.isValid &&
        this.validation.password.isValid
      );
    },

    async buttonSave() {
      if (!this.validateForm()) {
        this.showToast({
          title: "Ocurrió un error",
          message: "Faltan datos requeridos o alguno no es válido.",
          type: 2,
        });
        return;
      }

      try {
        const response = await axios.post(`${url}user/api/`, this.form);

        this.showToast({
          title: "Guardado correctamente",
          message: "El usuario vendedor fue creado correctamente.",
          type: 1,
        });

        this.$emit("user:created", response.data);
        this.closeModal();
      } catch (error) {
        const backendMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.email?.[0] ||
          "Hubo un error al guardar el usuario.";

        this.showToast({
          title: "Ocurrió un error",
          message: backendMessage,
          type: 2,
        });
      }
    },
  },
};
</script>