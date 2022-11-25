"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Caja = _conexion_sequelize.default.define("caja", {
  id: {
    primaryKey: true,
    type: _sequelize.default.INTEGER,
    autoIncrement: true
  },
  fecha_cuadre: {
    type: _sequelize.default.STRING(160),
    defaultValue: _sequelize.default.NOW
  },
  usuario: {
    type: _sequelize.default.STRING(160),
    allowNull: false
  },
  conteo: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  venta: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  cuadre_total: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  empresa: {
    type: _sequelize.default.STRING(100),
    allowNull: false
  },
  estado: {
    type: _sequelize.default.STRING(20),
    defaultValue: "ACTIVO"
  }
}, {
  tableName: "caja",
  underscored: true,
  timestamps: false,
  schema: "esq_reporte"
});

var _default = Caja;
exports.default = _default;