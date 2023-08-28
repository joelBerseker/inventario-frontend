import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;
export default {
  methods: {
    async getOutputDetailRegisters(id) {
      var path = this.urlConectionOutputDetail + `?id_order=` + id;
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
    async addOutputDetailRegister(data) {
      var path = this.urlConectionOutputDetail;
      var form_data = new FormData();
      for (var key in data) {
        if (key == "id" || key == "created_at" || key == "updated_at") {
          continue;
        }
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
            this.showMessage({
              title: "Ocurrió un error",
              message: "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },
    arrayOutputDetailToJson(id_order, array) {
      var resp = [];
      array.forEach((element) => {
        resp.push({
          id_order: id_order,
          id_product: element.id,
          new_sale_price: element.price,
          quantity: element.stock,
        });
      });
      return JSON.stringify(resp)
    },
    async addOutputDetailRegisters(id, data) {
      var path = this.urlConectionOutputDetail;
      var list_data = this.arrayOutputDetailToJson(id, data)
      const config = {
        headers: {
          "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es un JSON
        },
      };
      return new Promise((resolve, reject) => {
        axios
          .post(path, list_data, config)
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
    async editOutputDetailRegister(data) {
      var path = this.urlConectionOutputDetail  + data.id + "/";
      var form_data = new FormData();
      for (var key in data) {
        if (key == "id" || key == "created_at" || key == "updated_at" || key == "supplier_image") {
          continue;
        }
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
            this.showMessage({
              title: "Ocurrió un error",
              message: "No se pudo editar el registro, si continúa sucediendo contacte con su proveedor.",
              type: 2,
            });
            resolve({ success: false, response: error });
          });
      });
    },
    async confirmDeleteOutputDetailRegister(id) {
      return new Promise((resolve, reject) => {
        this.confirmDialogue({
          title: "Eliminar Registro",
          message: "¿Estas seguro que quieres eliminar el registro?",
          okButton: "Eliminar",
        }).then((result) => {
          if (result) {
            this.deleteOutputDetailRegister(id)
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
    async deleteOutputDetailRegister(id) {
      var path = this.urlConectionOutputDetail + id + "/";
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
    async getOutputDetailRegister(id) {
      var path = this.urlConectionOutputDetail + id + "/";
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
      urlConectionOutputDetail: url + "order_details/order_details/"
    };
  },
};
