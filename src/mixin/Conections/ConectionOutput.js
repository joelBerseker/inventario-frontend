import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;
export default {
  methods: {
    async getOutputRegisters(params = {}) {
      return new Promise((resolve) => {
        axios
          .get(this.urlConectionOutput, { params })
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
    async addOutputRegister(data) {
      var path = this.urlConectionOutput;
      var form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      return new Promise((resolve, reject) => {
        axios
          .post(path, form_data)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "El registro se agrego correctamente.",
              type: 1,
            });
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            const message = this.getErrorMessage(
              error,
              "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
            );

            this.showMessage({
              title: "Ocurrió un error",
              message,
              type: 2,
            });

            resolve({ success: false, response: error, message });
          }); /*  */
      });
    },
    async editOutputRegister(data) {
      var path = this.urlConectionOutput + data.id + "/";
      var form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      return new Promise((resolve, reject) => {
        axios
          .put(path, form_data)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "El registro de edito correctamente.",
              type: 1,
            });
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            const message = this.getErrorMessage(
              error,
              "No se pudo editar el registro, si continúa sucediendo contacte con su proveedor.",
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
    async confirmDeleteOutputRegister(id) {
      return new Promise((resolve, reject) => {
        this.confirmDialogue({
          title: "Eliminar Registro",
          message: "¿Estas seguro que quieres eliminar el registro?",
          okButton: "Eliminar",
        }).then((result) => {
          if (result) {
            this.deleteOutputRegister(id)
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
    async deleteOutputRegister(id) {
      var path = this.urlConectionOutput + id + "/";
      return new Promise((resolve, reject) => {
        axios
          .delete(path)
          .then((response) => {
            this.showMessage({
              title: "Operación exitosa",
              message: "El registro de elimino correctamente.",
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
    async getOutputRegister(id) {
      var path = this.urlConectionOutput + id + "/";
      return new Promise((resolve, reject) => {
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

    if (Array.isArray(data)) {
      return data.flat().join(" ");
    }

    if (typeof data === "string") {
      return data;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail.join(" ");
    }

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data === "object" && data !== null) {
      const firstValue = Object.values(data)[0];

      if (Array.isArray(firstValue)) {
        return firstValue.join(" ");
      }

      if (typeof firstValue === "string") {
        return firstValue;
      }
    }

    return defaultMessage;
  },
  data() {
    return {
      urlConectionOutput: url + "orders/orders/",
    };
  },
};
