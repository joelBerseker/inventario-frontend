import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  data() {
    return {
      urlConectionExpenseCategory: url + "finances/expense-categories/",
    };
  },
  methods: {
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

    async getExpenseCategoryRegisters(page) {
      const path = this.urlConectionExpenseCategory + `?page=${page}`;
      return new Promise((resolve) => {
        axios
          .get(path)
          .then((response) => resolve({ success: true, response }))
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo obtener las categorías de gasto.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async addExpenseCategoryRegister(data) {
      return new Promise((resolve) => {
        axios
          .post(this.urlConectionExpenseCategory, data)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "La categoría se agregó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo agregar la categoría."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async editExpenseCategoryRegister(data) {
      const path = this.urlConectionExpenseCategory + data.id + "/";
      return new Promise((resolve) => {
        axios
          .put(path, data)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "La categoría se editó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo editar la categoría."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async deleteExpenseCategoryRegister(id) {
      const path = this.urlConectionExpenseCategory + id + "/";
      return new Promise((resolve) => {
        axios
          .delete(path)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "La categoría se eliminó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo eliminar la categoría."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async confirmDeleteExpenseCategoryRegister(id) {
      return new Promise((resolve) => {
        this.confirmDialogue({
          title: "Eliminar categoría",
          message: "¿Estás seguro que quieres eliminar esta categoría?",
          okButton: "Eliminar",
        }).then((result) => {
          if (result) {
            this.deleteExpenseCategoryRegister(id).then((response) => resolve(response));
          } else {
            resolve({ success: false, response: result });
          }
        });
      });
    },

    async getExpenseCategoryRegister(id) {
      const path = this.urlConectionExpenseCategory + id + "/";
      return new Promise((resolve) => {
        axios
          .get(path)
          .then((response) => resolve({ success: true, response }))
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo obtener la categoría.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },
  },
};