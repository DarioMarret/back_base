"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uservalidar = void 0;

var _expressValidator = require("express-validator");

var _validateHelper = require("../helper/validateHelper");

const uservalidar = [(0, _expressValidator.check)("usuario").exists().not().isEmpty().isString(), (0, _expressValidator.check)("contracena").exists().not().isEmpty().isString(), (0, _expressValidator.check)("whatsapp").exists().not().isEmpty().isString(), (0, _expressValidator.check)("empresa").exists().not().isEmpty().isString(), (req, res, next) => {
  (0, _validateHelper.validateResul)(req, res, next);
}];
exports.uservalidar = uservalidar;