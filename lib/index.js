"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useForm;
exports.defaultMessageProcessor = void 0;

var _react = require("react");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var validationTypes = ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valid', 'valueMissing'];
var defaultMessageProcessor = {
  badInput: function badInput(input) {
    var errorName = input.dataset.name || input.name;
    return "Incorrect value for ".concat(errorName);
  },
  customError: function customError(input) {
    var errorName = input.dataset.name || input.name;
    return "Invalid value for ".concat(errorName);
  },
  patternMismatch: function patternMismatch(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " don't match with the pattern");
  },
  rangeOverflow: function rangeOverflow(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " maximun is ").concat(input.max);
  },
  rangeUnderflow: function rangeUnderflow(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " minimum is ").concat(input.max);
  },
  stepMismatch: function stepMismatch(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " should grow by ").concat(input.step, " at the time");
  },
  tooLong: function tooLong(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " should have ").concat(input.maxLength, " or less characteres");
  },
  tooShort: function tooShort(input) {
    var errorName = input.dataset.name || input.name;
    return "".concat(errorName, " should have ").concat(input.minLength, " or more characteres");
  },
  typeMismatch: function typeMismatch(input) {
    return "Please write a valid ".concat(input.type);
  },
  valueMissing: function valueMissing(input) {
    var errorName = input.dataset.name || input.name;
    return "Please enter your ".concat(errorName);
  }
};
exports.defaultMessageProcessor = defaultMessageProcessor;

function formAndData(event) {
  event.preventDefault();
  var form = event.target;
  var valid = form.checkValidity();
  var formData = new FormData(form);
  return {
    form: form,
    valid: valid,
    formData: formData
  };
}

function getDataObj(formData) {
  return Array.from(formData.keys()).reduce(function (acc, key) {
    acc[key] = formData.get(key);
    return acc;
  }, {});
}

function getValidationFromInput(messageProcesor, input) {
  var validity = input.validity;
  var validation = {
    validity: validity,
    valid: validity.valid,
    errors: []
  };

  if (!validity.valid) {
    validationTypes.reduce(function (acc, key) {
      if (validity[key] && typeof messageProcesor[key] === 'function') {
        acc.errors.push(messageProcesor[key](input));
      }

      if (validity[key] && messageProcesor[input.name] && typeof messageProcesor[key] !== 'function' && messageProcesor[input.name][key]) {
        acc.errors.push(messageProcesor[input.name][key]);
      }

      return acc;
    }, validation);
  }

  return validation;
}

function getValidations(messageProcesor, form, formData) {
  return Array.from(formData.keys()).reduce(function (acc, elementKey) {
    var input = form.elements[elementKey];
    acc[elementKey] = getValidationFromInput(messageProcesor, input);
    return acc;
  }, {});
}

function formHandlers() {
  var messageProcesor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMessageProcessor;

  var onSubmitHandler = function onSubmitHandler(event) {
    var _formAndData = formAndData(event),
        form = _formAndData.form,
        valid = _formAndData.valid,
        formData = _formAndData.formData;

    var validation = getValidations(messageProcesor, form, formData);
    var data = getDataObj(formData);
    return {
      valid: valid,
      validation: validation,
      data: data
    };
  };

  var onInputHandler = function onInputHandler(event) {
    return {
      validity: getValidationFromInput(messageProcesor, event.target),
      valid: event.target.checkValidity(),
      data: event.target.value
    };
  };

  return [onSubmitHandler, onInputHandler];
}

function useForm() {
  var messageProcesor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMessageProcessor;

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      validation = _useState2[0],
      setValidation = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = _slicedToArray(_useState3, 2),
      valid = _useState4[0],
      setValid = _useState4[1];

  var _formHandlers = formHandlers(messageProcesor),
      _formHandlers2 = _slicedToArray(_formHandlers, 2),
      onSubmitHandler = _formHandlers2[0],
      onInputHandler = _formHandlers2[1];

  var onSubmit = function onSubmit(event) {
    var _onSubmitHandler = onSubmitHandler(event),
        validation = _onSubmitHandler.validation,
        data = _onSubmitHandler.data,
        valid = _onSubmitHandler.valid;

    setValidation(validation);
    setValid(valid);
    return {
      validation: validation,
      data: data
    };
  };

  var onInput = function onInput(event) {
    var _onInputHandler = onInputHandler(event),
        validity = _onInputHandler.validity,
        valid = _onInputHandler.valid;

    setValid(valid);
    setValidation(_objectSpread({}, validation, _defineProperty({}, event.target.name, validity)));
  };

  var hasError = function hasError(field) {
    return validation[field] && !validation[field].valid;
  };

  var getErrors = function getErrors(field) {
    return validation[field] && !validation[field].valid && validation[field].errors && validation[field].errors.length > 0 ? validation[field].errors : [];
  };

  return {
    validation: validation,
    valid: valid,
    onSubmit: onSubmit,
    onInput: onInput,
    hasError: hasError,
    getErrors: getErrors
  };
}