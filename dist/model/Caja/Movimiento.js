"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Movimiento = _conexion_sequelize.default.define("movimiento", {
  id: {
    primaryKey: true,
    type: _sequelize.default.INTEGER,
    autoIncrement: true
  },
  detalle: {
    type: _sequelize.default.STRING(160),
    defaultValue: _sequelize.default.NOW
  },
  usuario: {
    type: _sequelize.default.STRING(160),
    allowNull: false
  },
  ingreso: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  salida: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  empresa: {
    type: _sequelize.default.STRING(100),
    allowNull: false
  },
  fecha: {
    type: _sequelize.default.STRING(160),
    defaultValue: _sequelize.default.NOW
  },
  estado: {
    type: _sequelize.default.STRING(20),
    defaultValue: "ACTIVO"
  }
}, {
  tableName: "movimiento",
  underscored: true,
  timestamps: false,
  schema: "esq_reporte"
});

var _default = Movimiento;
exports.default = _default;