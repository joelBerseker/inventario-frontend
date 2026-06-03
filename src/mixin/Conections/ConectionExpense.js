import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default {
  data() {
    return {
      urlConectionExpense: url + "finances/expenses/",
      urlConectionFinancialDashboard: url + "finances/dashboard/",
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

    async getExpenseRegisters(page) {
      const path = this.urlConectionExpense + `?page=${page}`;
      return new Promise((resolve) => {
        axios
          .get(path)
          .then((response) => resolve({ success: true, response }))
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo obtener los gastos.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async addExpenseRegister(data) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      return new Promise((resolve) => {
        axios
          .post(this.urlConectionExpense, formData)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "El gasto se agregó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo agregar el gasto."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async editExpenseRegister(data) {
      const path = this.urlConectionExpense + data.id + "/";
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      return new Promise((resolve) => {
        axios
          .put(path, formData)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "El gasto se editó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo editar el gasto."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async deleteExpenseRegister(id) {
      const path = this.urlConectionExpense + id + "/";
      return new Promise((resolve) => {
        axios
          .delete(path)
          .then((response) => {
            this.showToast({
              title: "Operación exitosa",
              message: "El gasto se eliminó correctamente.",
              type: 1,
            });
            resolve({ success: true, response });
          })
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: this.getErrorMessage(error, "No se pudo eliminar el gasto."),
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async confirmDeleteExpenseRegister(id) {
      return new Promise((resolve) => {
        this.confirmDialogue({
          title: "Eliminar gasto",
          message: "¿Estás seguro que quieres eliminar este gasto?",
          okButton: "Eliminar",
        }).then((result) => {
          if (result) {
            this.deleteExpenseRegister(id).then((response) => resolve(response));
          } else {
            resolve({ success: false, response: result });
          }
        });
      });
    },

    async getExpenseRegister(id) {
      const path = this.urlConectionExpense + id + "/";
      return new Promise((resolve) => {
        axios
          .get(path)
          .then((response) => resolve({ success: true, response }))
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo obtener el gasto.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },

    async getFinancialDashboard(filters = {}) {
      return new Promise((resolve) => {
        axios
          .get(this.urlConectionFinancialDashboard, { params: filters })
          .then((response) => resolve({ success: true, response }))
          .catch((error) => {
            this.showToast({
              title: "Ocurrió un error",
              message: "No se pudo obtener el dashboard financiero.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },
  },
};