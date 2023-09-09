import { Validation } from "@/mixin/models/Validation";
export class ModelProduct {
  id = {
    value: undefined,
  };
  code = {
    value: undefined,
    validation: {},
  };
  name = {
    value: undefined,
    validation: {},
  };
  cost = {
    value: undefined,
    validation: {},
  };
  price = {
    value: undefined,
    validation: {},
  };
  stock = {
    value: undefined,
    validation: {},
  };
  description = {
    value: undefined,
    validation: {},
  };
  category = {
    value: undefined,
    validation: {},
  };
  onChangeCode() {
    this.validateCode();
  }
  onChangeName() {
    this.validateName();
  }
  onChangePrice() {
    if (this.price.value != "" && this.price.value != null && this.price.value != undefined) {
      this.price.value = this.price.value.replace(/[^0-9]/, "");
      this.price.value = Validation.changeCurrency(this.price.value);
    }
    this.validatePrice();
  }
  onChangeCost() {
    if (this.cost.value != "" && this.cost.value != null && this.cost.value != undefined) {
      this.cost.value = this.cost.value.replace(/[^0-9]/, "");
      this.cost.value = Validation.changeCurrency(this.cost.value);
    }
    this.validateCost();
  }
  onChangeStock() {
    if (this.stock.value != "" && this.stock.value != null && this.stock.value != undefined) {
      if (typeof this.stock.value == "string") {
        this.stock.value = this.stock.value.replace(/[^0-9]/, "");
      }
    }
    this.validateStock();
  }
  onChangeDescription() {
    this.validateDescription();
  }
  onChangeCategory() {
    this.validateCategory();
  }
  validateCode() {
    this.code.validation = Validation.requiredText(this.code.value, 3, 10);
  }
  validateName() {
    this.name.validation = Validation.requiredText(this.name.value, 3, 50);
  }
  validatePrice() {
    this.price.validation = Validation.requiredText(this.price.value, 3, 15);
  }
  validateCost() {
    this.cost.validation = Validation.requiredText(this.cost.value, 3, 15);
  }
  validateStock() {
    this.stock.validation = Validation.required(this.stock.value);
  }
  validateDescription() {
    this.description.validation = Validation.noRequiredText(this.description.value, 3, 50);
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

    var result =
      this.code.validation.isValid &&
      this.name.validation.isValid &&
      this.price.validation.isValid &&
      this.cost.validation.isValid &&
      this.stock.validation.isValid &&
      this.description.validation.isValid &&
      this.category.validation.isValid;
    return result;
  }
  getToAdd() {
    return {
      code: this.code.value,
      name: this.name.value,
      price: this.price.value,
      cost: this.cost.value,
      stock: this.stock.value,
      description: Validation.isEmpty(this.description.value) ? "Ninguna" : this.description.value,
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
      description: Validation.isEmpty(this.description.value) ? "Ninguna" : this.description.value,
      id_category: this.category.value.id,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.code.value = data.code;
    this.name.value = data.name;
    this.price.value = data.price;
    this.cost.value = data.cost;
    this.stock.value = data.stock;
    this.description.value = data.description;
    if (data.id_category != undefined) {
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
