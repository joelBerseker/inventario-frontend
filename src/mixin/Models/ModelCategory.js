import { Validation } from "@/mixin/models/Validation";
export class ModelCategory {
  id = {
    value: undefined,
  };
  name = {
    value: undefined,
    validation: {},
  };
  description = {
    value: undefined,
    validation: {},
  };
  validateName() {
    this.name.validation = Validation.requiredText(this.name.value, 3, 50);
  }
  validateDescription() {
    this.description.validation = Validation.noRequiredText(this.description.value, 3, 250);
  }
  validateForm() {
    this.validateName();
    this.validateDescription();
    var result = this.name.validation.isValid && this.description.validation.isValid;
    return result;
  }
  getToAdd() {
    var descriptionEmpty = !(this.description.validation.validationMessage == "");
    return {
      name: this.name.value,
      description: descriptionEmpty ? "Ninguna" : this.description.value,
    };
  }
  getToEdit() {
    var descriptionEmpty = !(this.description.validation.validationMessage == "");
    return {
      id: this.id.value,
      name: this.name.value,
      description: descriptionEmpty ? "Ninguna" : this.description.value,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.name.value = data.name;
    this.description.value = data.description;
  }
  resetValidation() {
    this.id.validation = {};
    this.name.validation = {};
    this.description.validation = {};
  }
}
