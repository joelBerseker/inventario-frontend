import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;
export default {
  methods: {
    async getOutputRegisters(page) {
      var path = this.urlConectionOutput + `?page=` + page;
      return new Promise((resolve, reject) => {
        axios
          .get(path)
          .then((response) => {
            resolve({ success: true, response: response });
          })
          .catch((error) => {
            this.showMessage({
              title: "Ocurrió un error",
              message: "No se pudo obtener los registros, si continúa sucediendo contacte con su proveedor.",
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
        if (key == "client") {
          console.log("entre 2222");
          continue;
        }
        form_data.append(key, data[key]);
      }
      form_data.append("id_client", data.client.id);
      if (data.description == null || data.description == "" || data.description == undefined) {
        form_data.append("description", "Ninguna");
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
            this.showMessage({
              title: "Ocurrió un error",
              message: "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },
    async editOutputRegister(data) {
      var path = this.urlConectionOutput + data.id + "/";
      var form_data = new FormData();
      for (var key in data) {
        if (key == "id" || key == "created_at" || key == "updated_at" || key == "client") {
          continue;
        }
        form_data.append(key, data[key]);
      }
      form_data.append("id_client", data.client.id);
      if (data.description == null || data.description == "" || data.description == undefined) {
        form_data.append("description", "Ninguna");
      }
      console.log(data.client.id);
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
            this.showMessage({
              title: "Ocurrió un error",
              message: "No se pudo editar el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
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
              message: "No se pudo eliminar el registro, si continúa sucediendo contacte con su proveedor.",
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
              message: "No se pudo obtener el registro, si continúa sucediendo contacte con su proveedor.",
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
  data() {
    return {
      urlConectionOutput: url + "orders/orders/",
    };
  },
};
