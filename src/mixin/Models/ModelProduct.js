import { Validation } from "@/mixin/models/Validation";

export class ModelProduct {
  id = {
    value: undefined,
  };

  code = {
    value: "",
    validation: {},
  };

  name = {
    value: "",
    validation: {},
  };

  cost = {
    value: "",
    validation: {},
  };

  price = {
    value: "",
    validation: {},
  };

  stock = {
    value: "",
    validation: {},
  };

  description = {
    value: "",
    validation: {},
  };

  category = {
    value: undefined,
    validation: {},
  };

  barcode_image = {
    value: null,
  };

  barcode_image_url = {
    value: null,
  };

  onChangeCode() {
    this.validateCode();
  }

  onChangeName() {
    this.validateName();
  }

  onChangePrice() {
    const aux = this.price.value;
    this.price.value = Validation.replaceOnlyNumber(this.price.value);
    this.price.value = Validation.replaceCurrency(this.price.value);

    if (aux === this.price.value) {
      this.validatePrice();
    }
  }

  onChangeCost() {
    const aux = this.cost.value;
    this.cost.value = Validation.replaceOnlyNumber(this.cost.value);
    this.cost.value = Validation.replaceCurrency(this.cost.value);

    if (aux === this.cost.value) {
      this.validateCost();
    }
  }

  onChangeStock() {
    this.stock.value = Validation.replaceOnlyNumber(this.stock.value);
    this.validateStock();
  }

  onChangeDescription() {
    this.validateDescription();
  }

  onChangeCategory() {
    this.validateCategory();
  }

  validateCode() {
    // El código ahora lo genera el backend.
    this.code.validation = {
      isValid: true,
      message: "",
    };
  }

  validateName() {
    this.name.validation = Validation.requiredText(this.name.value, 3, 100);
  }

  validatePrice() {
    this.price.validation = Validation.requiredText(this.price.value, 1, 15);
  }

  validateCost() {
    this.cost.validation = Validation.requiredText(this.cost.value, 1, 15);
  }

  validateStock() {
    this.stock.validation = Validation.required(this.stock.value);
  }

  validateDescription() {
    this.description.validation = Validation.noRequiredText(this.description.value, 3, 250);
  }

  validateCategory() {
    this.category.validation = Validation.required(this.category.value);
  }

  validateForm() {
    this.validateCode();
    this.validateName();
    this.validatePrice();
    this.validateCost();
    this.validateStock();
    this.validateDescription();
    this.validateCategory();

    return (
      this.code.validation.isValid &&
      this.name.validation.isValid &&
      this.price.validation.isValid &&
      this.cost.validation.isValid &&
      this.stock.validation.isValid &&
      this.description.validation.isValid &&
      this.category.validation.isValid
    );
  }

  getToAdd() {
    return {
      // code ya NO se envía; lo genera el backend
      name: this.name.value,
      price: this.price.value,
      cost: this.cost.value,
      stock: this.stock.value,
      description: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      id_category: this.category.value.id,
    };
  }

  getToEdit() {
    return {
      id: this.id.value,
      code: this.code.value,
      name: this.name.value,
      price: this.price.value,
      cost: this.cost.value,
      stock: this.stock.value,
      description: Validation.isEmpty(this.description.value)
        ? "Ninguna"
        : this.description.value,
      id_category: this.category.value.id,
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.code.value = data?.code || "";
    this.name.value = data?.name || "";
    this.price.value = data?.price ?? "";
    this.cost.value = data?.cost ?? "";
    this.stock.value = data?.stock ?? "";
    this.description.value = data?.description || "";

    this.barcode_image.value = data?.barcode_image || null;
    this.barcode_image_url.value = data?.barcode_image_url || data?.barcode_image || null;

    if (data?.id_category !== undefined && data?.id_category !== null) {
      this.category.value = {
        id: data.id_category,
        name: data.category_name,
      };
    } else {
      this.category.value = undefined;
    }
  }

  resetValidation() {
    this.code.validation = {};
    this.name.validation = {};
    this.price.validation = {};
    this.cost.validation = {};
    this.stock.validation = {};
    this.description.validation = {};
    this.category.validation = {};
  }
}