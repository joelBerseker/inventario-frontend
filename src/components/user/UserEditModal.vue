<template>
  <MyModal
    ref="myModal"
    :id="'userEditModal'"
    title="Editar Usuario"
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
            name="Username"
            v-model="form.username"
            :validation="validation.username"
            v-on:input="validateUsername"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="Correo (opcional)"
            v-model="form.email"
            :validation="validation.email"
            v-on:input="validateEmail"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="Teléfono (opcional)"
            v-model="form.phone"
          />
        </div>

        <div class="col-6">
          <MyInput
            type="text"
            name="RUC (opcional)"
            v-model="form.ruc"
          />
        </div>

        <div class="col-12">
          <MyInput
            type="text"
            name="Dirección (opcional)"
            v-model="form.address"
          />
        </div>


        <div class="col-6">
          <div class="form-check form-switch mt-3">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="form.is_staff"
            />
            <label class="form-check-label">Es vendedor</label>
          </div>
        </div>

        <div class="col-6">
          <div class="form-check form-switch mt-3">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="form.is_active"
            />
            <label class="form-check-label">Activo</label>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-sm" @click="closeModal">
        Cancelar
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="buttonSave">
        Guardar cambios
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
  name: "UserEditModal",
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
        username: {},
        email: {},
      },
    };
  },
  methods: {
    getInitialForm() {
      return {
        id: null,
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        ruc: "",
        manage_stock: false,
        is_staff: true,
        is_active: true,
      };
    },

    openModal(user) {
      this.form = {
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        ruc: user.ruc || "",
        manage_stock: !!user.manage_stock,
        is_staff: !!user.is_staff,
        is_active: !!user.is_active,
      };

      this.validation = {
        first_name: {},
        last_name: {},
        username: {},
        email: {},
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

    validateUsername() {
      const valid = !!this.form.username?.trim();
      this.validation.username = {
        isValid: valid,
        message: valid ? "" : "El username es requerido.",
      };
    },

    validateEmail() {
      if (!this.form.email?.trim()) {
        this.validation.email = { isValid: true, message: "" };
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(this.form.email || "");
      this.validation.email = {
        isValid: valid,
        message: valid ? "" : "Correo inválido.",
      };
    },

    validateForm() {
      this.validateFirstName();
      this.validateLastName();
      this.validateUsername();
      this.validateEmail();

      return (
        this.validation.first_name.isValid &&
        this.validation.username.isValid &&
        this.validation.email.isValid
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
        const payload = { ...this.form };
        await axios.put(`${url}user/api/${this.form.id}/`, payload);

        this.showToast({
          title: "Guardado correctamente",
          message: "El usuario fue actualizado correctamente.",
          type: 1,
        });

        this.$emit("user:updated");
        this.closeModal();
      } catch (error) {
        const backendMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.username?.[0] ||
          error?.response?.data?.email?.[0] ||
          "Hubo un error al actualizar el usuario.";

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