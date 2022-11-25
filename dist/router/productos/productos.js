"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _productos = require("../../controller/productos/productos");

const routes = (0, _express.Router)();
routes.post('/Cargar_producto_excel', _productos.CargarProductosDesdeExcel);
routes.post('/cargar_producto_unitario', _productos.CrearProductounitario);
routes.get('/listar_produtos_empresa', _productos.ListarProducto);
routes.post('/busqueda_coinsidencia', _productos.ListarProductoConsiDencia);
routes.delete('/eliminar_producto_id', _productos.EliminarProductoPorId);
var _default = routes;
exports.default = _default;