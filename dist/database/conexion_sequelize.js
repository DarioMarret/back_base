"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

const db = new _sequelize.Sequelize("csml", "dbmasteruser", "3[gW,[7.G&AYkZJiE9|>k79.M1dH.sF`", {
  dialect: "postgres",
  host: "ls-4348a29bbd0b2a80bd7049cad7d5b242c997b4c6.cwgz17arpefp.us-east-1.rds.amazonaws.com",
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    require: 30000,
    idle: 10000
  },
  logging: false
});
db.authenticate().then(() => console.log("Conectado a la base de datos: csml")).catch(error => console.log("No hay conexion a la base de datos: " + error));
var _default = db;
exports.default = _default;