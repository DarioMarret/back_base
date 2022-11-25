"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _reporte = require("../../controller/reporte/reporte");

const routes = (0, _express.Router)();
routes.put('/actualizar_estado', _reporte.ActualizarEstado);
routes.post('/listar_reporte_fechas', _reporte.ListarReporte);
routes.post('/crear_venta', _reporte.CrearVenta);
routes.get('/listar_reporte_venta_actual', _reporte.ListarReporteActual);
routes.post('/total_venta_fechas', _reporte.SacarTotalesVentaFechas);
var _default = routes;
exports.default = _default;