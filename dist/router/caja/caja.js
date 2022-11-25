"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _caja = require("../../controller/caja/caja");

const routes = (0, _express.Router)();
routes.post('/listar_caja', _caja.ListarCajaActual);
routes.post('/cuadre_caja', _caja.CrearCuadreCaja);
routes.post('/listar_cajas', _caja.ListarCajas);
routes.put('/actualizar_caja', _caja.ActualizaCaja); //movimiento de caja

routes.post('/ingresar_movimiento', _caja.IngresarMovimiento);
routes.get('/listar_movimiento', _caja.ListarMovimiento);
var _default = routes;
exports.default = _default;