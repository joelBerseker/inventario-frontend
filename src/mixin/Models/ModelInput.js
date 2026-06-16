import { Validation } from "@/mixin/models/Validation";

export class ModelInput {
  header = new ModelInputHeader();
  detail = [];

  validateForm() {
    const validateHeader = this.header.validateForm();
    const validateDetail = this.validateDetail();
    return validateHeader && validateDetail;
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
    const resp = [];
    this.detail.forEach((element) => {
      resp.unshift(element.getToAddId(id));
    });
    return resp;
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
    value: 0,
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

  validateCode() {
    this.order_code.validation = {};
  }

  validateProvider() {
    this.provider.validation = Validation.required(this.provider.value);
  }

  validateEvidence() {
    this.evidence.validation = {};
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
    this.validateDescription();

    return (
      this.provider.validation.isValid &&
      this.description.validation.isValid
    );
  }

  getToAdd() {
    return {
      id_provider: this.provider.value.id,
      detail: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      total_price: Number(this.total_price.value || 0).toFixed(2),
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
      total_price: Number(this.total_price.value || 0).toFixed(2),
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.order_code.value = data?.order_code;

    if (data?.id_provider !== undefined && data?.id_provider !== null) {
      this.provider.value = {
        id: data.id_provider,
        name: data.provider_name,
      };
    } else {
      this.provider.value = undefined;
    }

    this.description.value = data?.detail ?? "";
    this.total_price.value = data?.total_price ?? 0;
  }

  resetValidation() {
    this.order_code.validation = {};
    this.provider.validation = {};
    this.description.validation = {};
    this.evidence.validation = {};
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
    value: "0",
    validation: {},
  };

  sale_price = {
    value: "0",
    validation: {},
  };

  last_purchase_price = {
    value: 0,
  };

  last_sale_price = {
    value: 0,
  };

  quantity = {
    value: 1,
    validation: {},
  };

  subtotal = {
    value: "0.00",
  };

  disabled = true;

  constructor(data) {
    this.setFromData(data);
  }

  sanitizeMoney(value) {
    let raw = String(value ?? "");

    raw = raw.replace(/,/g, ".");
    raw = raw.replace(/[^0-9.]/g, "");

    const parts = raw.split(".");
    if (parts.length > 2) {
      raw = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    if (raw.includes(".")) {
      const [intPart, decPart] = raw.split(".");
      raw = `${intPart}.${(decPart || "").slice(0, 2)}`;
    }

    return raw;
  }

  onChangeProduct() {
    this.copyFromProduct();
    this.calculateSubtotal();
    this.validateProduct();
  }

  onChangeQuantity() {
    let qty = Number(this.quantity.value || 0);

    if (isNaN(qty) || qty <= 0) {
      qty = 1;
    }

    this.quantity.value = qty;
    this.calculateSubtotal();
    this.validateQuantity();
  }

  onChangePurchasePrice() {
    this.purchase_price.value = this.sanitizeMoney(this.purchase_price.value);
    this.calculateSubtotal();
    this.validatePurchasePrice();
  }

  onChangeSalePrice() {
    this.sale_price.value = this.sanitizeMoney(this.sale_price.value);
    this.validateSalePrice();
  }

  validateProduct() {
    this.product.validation = Validation.required(this.product.value);
  }

  validateQuantity() {
    this.quantity.validation = Validation.required(this.quantity.value);
  }

  validatePurchasePrice() {
    this.purchase_price.validation = Validation.required(this.purchase_price.value);
  }

  validateSalePrice() {
    this.sale_price.validation = Validation.required(this.sale_price.value);
  }

  validateForm() {
    this.validateProduct();
    this.validateQuantity();
    this.validatePurchasePrice();
    this.validateSalePrice();

    return (
      this.product.validation.isValid &&
      this.quantity.validation.isValid &&
      this.purchase_price.validation.isValid &&
      this.sale_price.validation.isValid
    );
  }

  calculateSubtotal() {
    const qty = Number(this.quantity.value || 0);
    const purchase = Number(this.purchase_price.value || 0);
    this.subtotal.value = (qty * purchase).toFixed(2);
  }

  copyFromProduct() {
    this.purchase_price.value = String(this.product.value?.cost ?? 0);
    this.sale_price.value = String(this.product.value?.price ?? 0);
    this.last_purchase_price.value = this.product.value?.cost ?? 0;
    this.last_sale_price.value = this.product.value?.price ?? 0;
  }

  getToAdd() {
    return {
      id_purchase: this.id_purchase.value,
      id_product: this.product.value.id,
      purchase_price: Number(this.purchase_price.value || 0).toFixed(2),
      sale_price: Number(this.sale_price.value || 0).toFixed(2),
      quantity: Number(this.quantity.value || 0),
      manage_stock: false,
    };
  }

  getToAddId(id) {
    return {
      id_purchase: id,
      id_product: this.product.value.id,
      purchase_price: Number(this.purchase_price.value || 0).toFixed(2),
      sale_price: Number(this.sale_price.value || 0).toFixed(2),
      quantity: Number(this.quantity.value || 0),
      manage_stock: false,
    };
  }

  getToEdit() {
    return {
      id: this.id.value,
      id_purchase: this.id_purchase.value,
      id_product: this.product.value.id,
      purchase_price: Number(this.purchase_price.value || 0).toFixed(2),
      sale_price: Number(this.sale_price.value || 0).toFixed(2),
      quantity: Number(this.quantity.value || 0),
      manage_stock: false,
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.id_purchase.value = data?.id_purchase;

    if (data?.id_product !== undefined && data?.id_product !== null) {
      this.product.value = {
        id: data.id_product,
        name: data.product_name,
        cost: data.purchase_price ?? 0,
        price: data.sale_price ?? 0,
      };
    } else {
      this.product.value = undefined;
    }

    this.purchase_price.value =
      data?.purchase_price === undefined || data?.purchase_price === null
        ? "0"
        : String(data.purchase_price);

    this.sale_price.value =
      data?.sale_price === undefined || data?.sale_price === null
        ? "0"
        : String(data.sale_price);

    this.last_purchase_price.value =
      data?.purchase_price === undefined || data?.purchase_price === null
        ? 0
        : data.purchase_price;

    this.last_sale_price.value =
      data?.sale_price === undefined || data?.sale_price === null
        ? 0
        : data.sale_price;

    this.quantity.value =
      data?.quantity === undefined || data?.quantity === null
        ? 1
        : Number(data.quantity);

    this.calculateSubtotal();
  }

  resetValidation() {
    this.product.validation = {};
    this.quantity.validation = {};
    this.purchase_price.validation = {};
    this.sale_price.validation = {};
  }
}