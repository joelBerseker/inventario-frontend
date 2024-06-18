import { Validation } from "@/mixin/models/Validation";
export class ModelInput {
  header = new ModelInputHeader();
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
      this.detail.push(new ModelInputDetail(element));
    });
  }
  detailAdd(data) {
    this.detail.unshift(new ModelInputDetail(data));
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
  resetValidation() {
    this.header.resetValidation();
    this.detail.forEach((element) => {
      element.resetValidation();
    });
  }
}
class ModelInputHeader {
  id = {
    value: undefined,
  };
  order_code = {
    value: undefined,
    validation: {},
  };
  provider = {
    value: undefined,
    validation: {},
  };
  evidence = {
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
  onChangeProvider() {
    this.validateProvider();
  }
  onChangeEvidence() {
    this.validateEvidence();
  }
  onChangeDescription() {
    this.validateDescription();
  }
  validateProvider() {
    this.provider.validation = Validation.required(this.provider.value);
  }
  validateEvidence() {
    //this.payment_type.validation = Validation.required(this.payment_type.value);
  }
  validateDescription() {
    this.description.validation = Validation.noRequiredText(
      this.description.value,
      3,
      250
    );
  }
  validateForm() {
    this.validateProvider();
    //this.validateEvidence();
    this.validateDescription();

    var result =
      this.provider.validation.isValid && this.description.validation.isValid;
    return result;
  }
  getToAdd() {
    return {
      id_provider: this.provider.value.id,
      detail: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      total_price: this.total_price.value,
    };
  }
  getToEdit() {
    return {
      id: this.id.value,
      order_code: this.order_code.value,
      id_provider: this.provider.value.id,
      detail: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      total_price: this.total_price.value,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.order_code.value = data.order_code;
    if (data.id_provider != undefined) {
      this.provider.value = {
        id: data.id_provider,
        name: data.provider_name,
      };
    } else {
      this.provider.value = undefined;
    }
    this.description.value = data.detail;
    this.total_price.value = data.total_price;
  }
  resetValidation() {
    this.order_code.validation = {};
    this.provider.validation = {};
    this.description.validation = {};
  }
}
class ModelInputDetail {
  id = {
    value: undefined,
  };
  id_purchase = {
    value: undefined,
  };
  product = {
    value: undefined,
    validation: {},
  };
  purchase_price = {
    value: undefined,
    validation: {},
  };
  sale_price = {
    value: undefined,
    validation: {},
  };
  last_purchase_price = {
    value: undefined,
  };
  last_sale_price = {
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
  onChangePurchasePrice() {
    this.purchase_price.value = Validation.replaceOnlyNumber(
      this.purchase_price.value
    );
    this.purchase_price.value = Validation.replaceCurrency(
      this.purchase_price.value
    );
    this.calculateSubtotal();
    this.validatePurchasePrice();
  }
  onChangeSalePrice() {
    this.sale_price.value = Validation.replaceOnlyNumber(this.sale_price.value);
    this.sale_price.value = Validation.replaceCurrency(this.sale_price.value);
    this.validateSalePrice();
  }
  validateProduct() {
    this.product.validation = Validation.required(this.product.value);
  }
  validateQuantity() {
    this.quantity.validation = Validation.required(this.quantity.value);
  }
  validatePurchasePrice() {
    this.purchase_price.validation = Validation.required(
      this.purchase_price.value
    );
  }
  validateSalePrice() {
    this.sale_price.validation = Validation.required(this.sale_price.value);
  }
  validateForm() {
    this.validateProduct();
    this.validateQuantity();
    this.validatePurchasePrice();
    this.validateSalePrice();
    var result =
      this.product.validation.isValid && this.quantity.validation.isValid;
    return result;
  }
  calculateSubtotal() {
    this.subtotal.value = (
      this.quantity.value * this.purchase_price.value
    ).toFixed(2);
  }
  copyFromProduct() {
    this.purchase_price.value = this.product.value.cost;
    this.sale_price.value = this.product.value.price;
    this.last_purchase_price.value = this.product.value.cost;
    this.last_sale_price.value = this.product.value.price;
  }
  getToAdd() {
    return {
      id_purchase: this.id_purchase.value,
      id_product: this.product.value.id,
      purchase_price: this.purchase_price.value,
      sale_price: this.sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  getToAddId(id) {
    return {
      id_purchase: id,
      id_product: this.product.value.id,
      purchase_price: this.purchase_price.value,
      sale_price: this.sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  getToEdit() {
    return {
      id: this.id.value,
      id_purchase: this.id_purchase.value,
      id_product: this.product.value.id,
      purchase_price: this.purchase_price.value,
      sale_price: this.sale_price.value,
      quantity: this.quantity.value,
      manage_stock: false,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.id_purchase.value = data.id_purchase;
    if (data.id_product != undefined) {
      this.product.value = {
        id: data.id_product,
        name: data.product_name,
      };
    } else {
      this.product.value = undefined;
    }
    this.purchase_price.value =
      data.purchase_price == undefined ? 0 : data.purchase_price;
    this.sale_price.value = data.sale_price == undefined ? 0 : data.sale_price;
    this.last_purchase_price.value = undefined;
    this.last_sale_price.value = undefined;
    this.quantity.value = data.quantity == undefined ? 1 : data.quantity;
    this.calculateSubtotal();
  }
  resetValidation() {
    this.product.validation = {};
    this.quantity.validation = {};
    this.purchase_price.validation = {};
    this.sale_price.validation = {};
  }
}
