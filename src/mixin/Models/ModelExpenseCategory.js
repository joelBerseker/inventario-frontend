import { Validation } from "@/mixin/models/Validation";

export class ModelExpenseCategory {
  id = { value: undefined };
  name = { value: "", validation: {} };
  description = { value: "", validation: {} };

  onChangeName() {
    this.name.validation = Validation.requiredText(this.name.value, 2, 100);
  }

  onChangeDescription() {
    this.description.validation = Validation.noRequiredText(this.description.value, 0, 250);
  }

  validateForm() {
    this.onChangeName();
    this.onChangeDescription();
    return this.name.validation.isValid && this.description.validation.isValid;
  }

  getToAdd() {
    return {
      name: this.name.value,
      description: this.description.value || "",
    };
  }

  getToEdit() {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value || "",
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.name.value = data?.name || "";
    this.description.value = data?.description || "";
  }

  resetValidation() {
    this.name.validation = {};
    this.description.validation = {};
  }
}