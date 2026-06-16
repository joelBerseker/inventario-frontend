import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  methods: {
    async getInputRegisters(params = {}) {
      return new Promise((resolve) => {
        axios
          .get(this.urlConectionInput, { params })
          .then((response) => {
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            this.showMessage({
              title: "Ocurrió un error",
              message:
                "No se pudo obtener los registros, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async addInputRegister(data) {
      const path = this.urlConectionInput;
      const form_data = new FormData();

      for (const key in data) {
        form_data.append(key, data[key]);
      }

      return new Promise((resolve) => {
        axios
          .post(path, form_data)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "La entrada se agregó correctamente.",
              type: 1,
            });
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            const message = this.getErrorMessage(
              error,
              "No se pudo agregar la entrada, si continúa sucediendo contacte con su proveedor."
            );

            this.showMessage({
              title: "Ocurrió un error",
              message,
              type: 2,
            });

            resolve({ success: false, response: error, message });
          });
      });
    },

    async editInputRegister(data) {
      const path = this.urlConectionInput + data.id + "/";
      const form_data = new FormData();

      for (const key in data) {
        form_data.append(key, data[key]);
      }

      return new Promise((resolve) => {
        axios
          .put(path, form_data)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "La entrada se editó correctamente.",
              type: 1,
            });
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            const message = this.getErrorMessage(
              error,
              "No se pudo editar la entrada, si continúa sucediendo contacte con su proveedor."
            );

            this.showMessage({
              title: "Ocurrió un error",
              message,
              type: 2,
            });

            resolve({ success: false, response: error, message });
          });
      });
    },

    async confirmDeleteInputRegister(id) {
      return new Promise((resolve) => {
        this.confirmDialogue({
          title: "Eliminar Registro",
          message: "¿Estas seguro que quieres eliminar el registro?",
          okButton: "Eliminar",
        }).then((result) => {
          if (result) {
            this.deleteInputRegister(id)
              .then((response) => {
                resolve({ success: true, response: response });
              })
              .catch((error) => {
                resolve({ success: false, response: error });
              });
          } else {
            resolve({ success: false, response: result });
          }
        });
      });
    },

    async deleteInputRegister(id) {
      const path = this.urlConectionInput + id + "/";
      return new Promise((resolve) => {
        axios
          .delete(path)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "La entrada se eliminó correctamente.",
              type: 1,
            });
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            this.showMessage({
              title: "Ocurrió un error",
              message:
                "No se pudo eliminar el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async getInputRegister(id) {
      const path = this.urlConectionInput + id + "/";
      return new Promise((resolve) => {
        axios
          .get(path)
          .then((response) => {
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            this.showMessage({
              title: "Ocurrió un error",
              message:
                "No se pudo obtener el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    showMessage(data) {
      this.showToast(data);
    },
  },

  getErrorMessage(error, defaultMessage) {
    const data = error?.response?.data;

    if (Array.isArray(data)) return data.flat().join(" ");
    if (typeof data === "string") return data;
    if (typeof data?.detail === "string") return data.detail;

    if (typeof data === "object" && data !== null) {
      const firstValue = Object.values(data)[0];
      if (Array.isArray(firstValue)) return firstValue.join(" ");
      if (typeof firstValue === "string") return firstValue;
    }

    return defaultMessage;
  },

  data() {
    return {
      urlConectionInput: url + "purchase/purchase/",
    };
  },
};