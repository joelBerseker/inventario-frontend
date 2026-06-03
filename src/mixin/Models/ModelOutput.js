import { Validation } from "@/mixin/models/Validation";

export class ModelOutput {
  header = new ModelOutputHeader();
  detail = [];

  validateForm() {
    const _validateHeader = this.header.validateForm();
    const _validateDetail = this.validateDetail();
    return _validateHeader && _validateDetail;
  }

  validateDetail() {
    let resp = true;
    for (let i = 0; i < this.detail.length; i++) {
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
    const resp = [];
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

class ModelOutputHeader {
  id = { value: undefined };

  order_code = {
    value: undefined,
    validation: {},
  };

  client = {
    value: undefined,
    validation: {},
  };

  payment_type = {
    value: "",
    validation: {},
  };

  description = {
    value: undefined,
    validation: {},
  };

  subtotal_price = {
    value: 0,
  };

  discount = {
    value: 0,
    validation: {},
  };

  total_price = {
    value: 0,
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

  onChangeDiscount() {
    this.validateDiscount();
  }

  validateCode() {
    this.order_code.validation = {};
  }

  validateClient() {
    this.client.validation = Validation.required(this.client.value);
  }

  validatePaymentType() {
    this.payment_type.validation = Validation.required(this.payment_type.value);
  }

  validateDescription() {
    this.description.validation = Validation.noRequiredText(
      this.description.value,
      3,
      250,
    );
  }

  validateDiscount() {
    const discount = Number(this.discount.value || 0);
    const subtotal = Number(this.subtotal_price.value || 0);

    if (isNaN(discount) || discount < 0) {
      this.discount.validation = {
        isValid: false,
        message: "El descuento no puede ser negativo.",
      };
      return;
    }

    if (discount > subtotal) {
      this.discount.validation = {
        isValid: false,
        message: "El descuento no puede ser mayor al subtotal.",
      };
      return;
    }

    this.discount.validation = {
      isValid: true,
      message: "",
    };
  }

  validateForm() {
    this.validateCode();
    this.validateClient();
    this.validatePaymentType();
    this.validateDescription();
    this.validateDiscount();

    return (
      this.client.validation.isValid &&
      this.payment_type.validation.isValid &&
      this.description.validation.isValid &&
      this.discount.validation.isValid
    );
  }

  getToAdd() {
    return {
      id_client: this.client.value.id,
      payment_type: this.payment_type.value,
      description: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      subtotal_price: Number(this.subtotal_price.value || 0).toFixed(2),
      discount: Number(this.discount.value || 0).toFixed(2),
      total_price: Number(this.total_price.value || 0).toFixed(2),
    };
  }

  getToEdit() {
    return {
      id: this.id.value,
      order_code: this.order_code.value,
      id_client: this.client.value.id,
      payment_type: this.payment_type.value,
      description: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      subtotal_price: Number(this.subtotal_price.value || 0).toFixed(2),
      discount: Number(this.discount.value || 0).toFixed(2),
      total_price: Number(this.total_price.value || 0).toFixed(2),
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.order_code.value = data?.order_code;

    if (data?.id_client !== undefined && data?.id_client !== null) {
      this.client.value = {
        id: data.id_client,
        name: data.client_name,
      };
    } else if (data?.client?.id) {
      this.client.value = data.client;
    } else {
      this.client.value = undefined;
    }

    this.payment_type.value =
      data?.payment_type != null ? String(data.payment_type) : "";

    this.description.value = data?.description ?? "";

    this.subtotal_price.value =
      data?.subtotal_price === undefined || data?.subtotal_price === null
        ? data?.total_price || 0
        : data.subtotal_price;

    this.discount.value =
      data?.discount === undefined || data?.discount === null
        ? 0
        : data.discount;

    this.total_price.value =
      data?.total_price === undefined || data?.total_price === null
        ? 0
        : data.total_price;
  }

  resetValidation() {
    this.order_code.validation = {};
    this.client.validation = {};
    this.payment_type.validation = {};
    this.description.validation = {};
    this.discount.validation = {};
  }
}

class ModelOutputDetail {
  id = { value: undefined };
  id_order = { value: undefined };

  product = {
    value: undefined,
    validation: {},
  };

  stock = {
    value: 0,
  };

  new_sale_price = {
    value: 0,
  };

  quantity = {
    value: 1,
    validation: {},
  };

  subtotal = {
    value: 0,
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
    this.quantity.validation = Validation.required(this.quantity.value);
  }

  validateForm() {
    this.validateProduct();
    this.validateQuantity();
    return this.product.validation.isValid && this.quantity.validation.isValid;
  }

  calculateSubtotal() {
    const quantity = Number(this.quantity.value || 0);
    const price = Number(this.new_sale_price.value || 0);
    this.subtotal.value = (quantity * price).toFixed(2);
  }

  copyFromProduct() {
    if (this.product.value) {
      if (this.product.value.price !== undefined) {
        this.new_sale_price.value = this.product.value.price;
      }

      if (this.product.value.stock !== undefined) {
        this.stock.value = this.product.value.stock;
      }
    }
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
    this.id.value = data?.id;
    this.id_order.value = data?.id_order;

    if (data?.id_product !== undefined && data?.id_product !== null) {
      this.product.value = {
        id: data.id_product,
        name: data.product_name,
        price: data.new_sale_price,
        stock: data.product_stock ?? data.stock ?? 0,
      };
    } else if (data?.product?.id) {
      this.product.value = data.product;
    } else {
      this.product.value = undefined;
    }

    this.stock.value = data?.product_stock ?? data?.stock ?? 0;
    this.new_sale_price.value =
      data?.new_sale_price === undefined || data?.new_sale_price === null
        ? 0
        : data.new_sale_price;
    this.quantity.value =
      data?.quantity === undefined || data?.quantity === null
        ? 1
        : data.quantity;

    this.calculateSubtotal();
  }

  resetValidation() {
    this.product.validation = {};
    this.quantity.validation = {};
  }
}
