import { Validation } from "@/mixin/models/Validation";
export class ModelSupplier {
  id = {
    value: undefined,
  };
  name = {
    value: undefined,
    validation: {},
  };
  documentType = {
    value: undefined,
    validation: {},
  };
  document = {
    value: undefined,
    validation: {},
  };
  phone = {
    value: undefined,
    validation: {},
  };
  address = {
    value: undefined,
    validation: {},
  };
  onChangeName() {
    this.validateName();
  }
  onChangeDocumentType() {
    this.validateDocumentType();
  }
  onChangeDocument() {
    this.validateDocument();
  }
  onChangePhone() {
    var aux = this.phone.value;
    this.phone.value = Validation.inputOnlyNumber(this.phone.value);
    if (aux == this.phone.value) {
      this.validatePhone();
    }
  }
  onChangeAddress() {
    this.validateAddress();
  }
  validateName() {
    this.name.validation = Validation.requiredText(this.name.value, 3, 50);
  }
  validateDocumentType() {
    this.documentType.validation = Validation.required(this.documentType.value);
  }
  validateDocument() {
    this.document.validation = Validation.requiredText(this.document.value, 3, 10);
  }
  validatePhone() {
    var aux = this.phone.value;
    this.phone.value = Validation.inputOnlyNumber(this.phone.value);
    if (aux == this.phone.value) {
      this.phone.validation = Validation.requiredText(this.phone.value, 9, 9);
    }
  }
  validateAddress() {
    this.address.validation = Validation.requiredText(this.address.value, 3, 50);
  }
  validateForm() {
    this.validateName();
    this.validateDocumentType();
    this.validateDocument();
    this.validatePhone();
    this.validateAddress();
    var result =
      this.name.validation.isValid &&
      this.documentType.validation.isValid &&
      this.document.validation.isValid &&
      this.phone.validation.isValid &&
      this.address.validation.isValid;
    return result;
  }
  getToAdd() {
    return {
      name: this.name.value,
      documentType: this.documentType.value,
      document: this.document.value,
      phone: this.phone.value,
      address: this.address.value,
    };
  }
  getToEdit() {
    return {
      id: this.id.value,
      name: this.name.value,
      documentType: this.documentType.value,
      document: this.document.value,
      phone: this.phone.value,
      address: this.address.value,
    };
  }
  setFromData(data) {
    this.id.value = data.id;
    this.name.value = data.name;
    this.documentType.value = data.documentType;
    this.document.value = data.document;
    this.phone.value = data.phone;
    this.address.value = data.address;
  }
  resetValidation() {
    this.name.validation = {};
    this.documentType.validation = {};
    this.document.validation = {};
    this.phone.validation = {};
    this.address.validation = {};
  }
}
