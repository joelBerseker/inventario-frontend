import { Validation } from "@/mixin/models/Validation";
export class ModelOutput {
  header = new ModelOutputHeader();
  detail = [];
  validateForm() {
    var _validateHeader = this.header.validateForm();
    var _validateDetail = this.validateDetail();
    var result = _validateHeader && _validateDetail;
    return result;
  }
  validateDetail() {
    var resp = true;
    for (var i = 0; i < this.detail.length; i++) {
      if (!this.detail[i].validateForm()) {
        resp = false;
      }
    }
    return resp;
  }
  detailFill(list) {
    this.detail = [];
    list.forEach((element) => {
      this.detail.push(new ModelOutputDetail(element));
    });
  }
  detailAdd(data) {
    this.detail.unshift(new ModelOutputDetail(data));
  }
  detailDelete(index) {
    this.detail.splice(index, 1);
  }

  getDetailToJSON(id) {
    var resp = [];
    this.detail.forEach((element) => {
      resp.unshift(element.getToAddId(id));
    });
    return JSON.stringify(resp);
  }
  setFromData(data) {
    this.id.value = data.id;
    this.name.value = data.name;
    this.description.value = data.description;
  }
  resetValidation() {
    this.header.resetValidation();
    this.detail.forEach((element) => {
      element.resetValidation();
    });
  }
}
class ModelOutputHeader {
  id = {
    value: undefined,
  };
  order_code = {
    value: undefined,
    validation: {},
  };
  client = {
    value: undefined,
    validation: {},
  };
  payment_type = {
    value: undefined,
    validation: {},
  };
  description = {
    value: undefined,
    validation: {},
  };
  total_price = {
    value: undefined,
  };
  onChangeCode() {
    this.validateCode();
  }
  onChangeClient() {
    this.validateClient();
  }
  onChangePaymentType() {
    this.validatePaymentType();
  }
  onChangeDescription() {
    this.validateDescription();
  }
  validateCode() {
    this.order_code.validation = Validation.requiredText(this.order_code.value, 3, 50);
  }
  validateClient() {
    this.client.validation = Validation.required(this.client.value);
  }
  validatePaymentType() {
    this.payment_type.validation = Validation.required(this.payment_type.value);
  }
  validateDescription() {
    this.description.validation = Validation.noRequiredText(this.description.value, 3, 250);
  }
  validateForm() {
    this.validateCode();
    this.validateClient();
    this.validatePaymentType();
    this.validateDescription();

    var result =
      this.order_code.validation.isValid &&
      this.client.validation.isValid &&
      this.payment_type.validation.isValid &&
      this.description.validation.isValid;
    return result;
  }
  getToAdd() {
    var descriptionEmpty = !(this.description.validation.validationMessage == "");
    console.log(this.client);
    return {
      order_code: this.order_code.value,
      id_client: this.client.value.id,
      payment_type: this.payment_type.value,
      description: descriptionEmpty ? "Ninguna" : this.description.value,
      total_price: this.total_price.value,
    };
  }
  getToEdit() {
    var descriptionEmpty = !(this.description.validation.validationMessage == "");
    return {
      id: this.id.value,
      order_code: this.order_code.value,
      id_client: this.client.value.id,
      payment_type: this.payment_type.value,
      description: descriptionEmpty ? "Ninguna" : this.description.value,
      total_price: this.total_price.value,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.order_code.value = data.order_code;
    if (data.id_client != undefined) {
      this.client.value = {
        id: data.id_client,
        name: data.client_name,
      };
    } else {
      this.client.value = undefined;
    }
    this.payment_type.value = data.payment_type;
    this.description.value = data.description;
    this.total_price.value = data.total_price;
  }
  resetValidation() {
    this.order_code.validation = {};
    this.client.validation = {};
    this.payment_type.validation = {};
    this.description.validation = {};
  }
}
class ModelOutputDetail {
  id = {
    value: undefined,
  };
  id_order = {
    value: undefined,
  };
  product = {
    value: undefined,
    validation: {},
  };
  new_sale_price = {
    value: undefined,
  };
  quantity = {
    value: undefined,
    validation: {},
  };
  subtotal = {
    value: undefined,
  };
  disabled = true;
  constructor(data) {
    this.setFromData(data);
  }
  onChangeProduct() {
    this.copyFromProduct();
    this.calculateSubtotal();
    this.validateProduct();
  }
  onChangeQuantity() {
    this.calculateSubtotal();
    this.validateQuantity();
  }
  validateProduct() {
    this.product.validation = Validation.required(this.product.value);
  }
  validateQuantity() {
    this.quantity.validation = Validation.required(this.quantity.value, 3, 50);
  }
  validateForm() {
    this.validateProduct();
    this.validateQuantity();
    var result = this.product.validation.isValid && this.quantity.validation.isValid;
    return result;
  }
  calculateSubtotal() {
    this.subtotal.value = (this.quantity.value * this.new_sale_price.value).toFixed(2);
  }
  copyFromProduct() {
    this.new_sale_price.value = this.product.value.price;
  }
  getToAdd() {
    return {
      id_order: this.id_order.value,
      id_product: this.product.value.id,
      new_sale_price: this.new_sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  getToAddId(id) {
    return {
      id_order: id,
      id_product: this.product.value.id,
      new_sale_price: this.new_sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  getToEdit() {
    return {
      id: this.id.value,
      id_order: this.id_order.value,
      id_product: this.product.value.id,
      new_sale_price: this.new_sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.id_order.value = data.id_order;
    if (data.id_product != undefined) {
      this.product.value = {
        id: data.id_product,
        name: data.product_name,
      };
    } else {
      this.product.value = undefined;
    }
    this.new_sale_price.value = data.new_sale_price == undefined ? 0 : data.new_sale_price;
    this.quantity.value = data.quantity == undefined ? 1 : data.quantity;
    this.calculateSubtotal();
  }
  resetValidation() {
    this.product.validation = {};
    this.quantity.validation = {};
  }
}
