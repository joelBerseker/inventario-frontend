export const Validation = {
  validateInput(data) {
    var response = {
      message: data.message,
      validationStyle: data.isValid ? " is-valid " : " is-invalid ",
      isValid: data.isValid,
    };
    return response;
  },
  isEmpty(text) {
    var resp = false;
    if (text == "" || text == null || text == undefined) {
      resp = true;
    }
    return resp;
  },
  validateOnlyText(text) {
    var resp = {
      isValid: true,
      message: "",
    };
    if (!this.regular_expressions.onlyText.test(text)) {
      resp.message = "Solo se permite texto";
      resp.isValid = false;
    }

    return resp;
  },
  validateTextEmpty(text) {
    var resp = {
      isValid: true,
      message: "",
    };
    if (this.isEmpty(text)) {
      resp.message = "Por favor ingrese un valor";
      resp.isValid = false;
    }
    return resp;
  },
  validateNoRequired(text) {
    var resp = {
      isValid: false,
      message: "",
      class: this.classInvalid,
    };
    if (this.isEmpty(text)) {
      resp.message = "No requerido";
      resp.isValid = true;
    }
    return resp;
  },
  validateTextLength(text, min, max) {
    var resp = {
      isValid: true,
      message: "",
      class: this.classValid,
    };
    var textLength = 0;
    if (!this.isEmpty(text)) {
      textLength = text.length;
    }
    if (textLength < min) {
      resp.message = "Debe contener al menos " + min + " caracteres";
      resp.isValid = false;
    } else if (textLength > max) {
      resp.message = "Debe contener como maximo " + max + " caracteres";
      resp.isValid = false;
    }
    return resp;
  },
  /*VALIDATIONS*/
  required(text) {
    var resp = this.validateTextEmpty(text);
    return resp;
  },
  requiredText(text, min, max) {
    var resp = this.validateTextEmpty(text);
    if (resp.isValid) resp = this.validateTextLength(text, min, max);
    return resp;
  },
  noRequiredText(text, min, max) {
    var resp = undefined;
    if (this.isEmpty(text)) {
      resp = this.validateNoRequired(text);
    } else {
      //here anoter validations
      resp = this.validateTextLength(text, min, max);
    }
    return resp;
  },
  /*INPUT REPLACE */
  replaceOnlyNumberPlus(text) {
    if (this.isEmpty(text)) {
      return text;
    }
    return text.toString().replace(/[^0-9+]/, "");
  },
  replaceOnlyNumber(text) {
    if (this.isEmpty(text)) {
      return text;
    }
    return text.toString().replace(/[^0-9]/, "");
  },
  replaceCurrency(data) {
    if (this.isEmpty(data)) {
      return data;
    }
    var text = data.toString().replace(/[^0-9]/, "");
    if (text.length >= 3) {
      var firsPart = text.slice(0, -2);
      var lastPart = text.slice(text.length - 2);
      var complete = firsPart + "." + lastPart;
      return Number(complete).toFixed(2);
    }
    return data;
  },
  regular_expressions: {
    onlyNumber: /^[0-9].*$/,
    onlyTextAndNumber: /^[a-zá-úÁ-ÚA-Z0-9 _.,:;"#%&~^/(){}!¡¿?/\\/]*$/,
    onlyText: /^[a-zá-úÁ-ÚA-Z ]*$/,
    onlyTextAndNumber1: /^[a-zá-úÁ-ÚA-Z0-9 ]*$/,
    onlyTextAndNumber2: /^[a-zá-úÁ-ÚA-Z0-9/{/},.:;_!"#$%?¿&()\- //+-/*/[\]]*$/,
  },
};
