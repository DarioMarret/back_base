"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateResul = void 0;

var _expressValidator = require("express-validator");

const validateResul = (req, res, next) => {
  try {
    (0, _expressValidator.validationResult)(req).throw();
    return next();
  } catch (err) {
    res.status(403);
    res.json({
      errors: err.array()
    });
  }
};

exports.validateResul = validateResul;