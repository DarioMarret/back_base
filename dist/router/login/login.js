"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _login = require("../../controller/login/login");

const routes = (0, _express.Router)();
routes.post('/validarlogin', _login.ValidarLogin);
routes.post('/crearUsuario', _login.CrearUsuario);
var _default = routes;
exports.default = _default;