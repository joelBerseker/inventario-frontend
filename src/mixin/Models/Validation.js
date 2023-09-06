export const Validation = {
  validateInput(text, validationMessage, required) {
    var validationStyle = "";
    var isValid = true;

    if (this.textEmpty(text, "") && !required) {
      validationMessage = "No requerido";
    } else {
      validationStyle = validationMessage != "" ? " is-invalid" : " is-valid";
      isValid = validationMessage != "" ? false : true;
    }

    var response = {
      validationMessage: validationMessage,
      validationStyle: validationStyle,
      isValid: isValid,
    };
    return response;
  },

  onlyText(text, previus_message) {
    var message_ = previus_message;
    if (message_ == "") {
      if (!this.regular_expressions.onlyText.test(text)) {
        message_ = "Solo se permite texto";
      }
    }
    return message_;
  },
  textEmpty(text, previus_message) {
    var message_ = previus_message;
    if (message_ == "") {
      if (text == "" || text == null || text == undefined) {
        message_ = "Por favor ingrese un valor";
      }
    }
    return message_;
  },
  textLength(text, previus_message, min, max) {
    var message_ = previus_message;
    if (message_ == "") {
      if (text == null) {
        if (0 < min) {
          message_ = "Debe contener al menos " + min + " caracteres";
        } else if (0 > max) {
          message_ = "Debe contener como maximo " + max + " caracteres";
        }
      } else {
        if (text.length < min) {
          message_ = "Debe contener al menos " + min + " caracteres";
        } else if (text.length > max) {
          message_ = "Debe contener como maximo " + max + " caracteres";
        }
      }
    }
    return message_;
  },
  /*VALIDATIONS*/
  required(text) {
    var validationMessage = "";
    validationMessage = this.textEmpty(text, validationMessage);
    return this.validateInput(text, validationMessage, true);
  },
  requiredText(text, min, max) {
    var validationMessage = "";
    validationMessage = this.textEmpty(text, validationMessage);
    validationMessage = this.textLength(text, validationMessage, min, max);
    return this.validateInput(text, validationMessage, true);
  },
  noRequiredText(text, min, max) {
    var validationMessage = "";
    validationMessage = this.textEmpty(text, validationMessage);
    validationMessage = this.textLength(text, validationMessage, min, max);
    return this.validateInput(text, validationMessage, false);
  },
  /*INPUT REPLACE */
  inputOnlyNumberPlus(text) {
    if (text == "" || text == null || text == undefined) {
      return text
    }
    return text.toString().replace(/[^0-9+]/, "");
  },
  inputOnlyNumber(text) {
    if (text == "" || text == null || text == undefined) {
      return text
    }
    return text.toString().replace(/[^0-9]/, "");
  },
  changeCurrency(data) {
    if (data == "" || data == null || data == undefined) {
      return data
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
