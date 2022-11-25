"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Reporte = _conexion_sequelize.default.define("reporte", {
  id: {
    primaryKey: true,
    type: _sequelize.default.INTEGER,
    autoIncrement: true
  },
  secuencia: {
    type: _sequelize.default.STRING(160),
    allowNull: false
  },
  producto: {
    type: _sequelize.default.STRING(160),
    allowNull: false
  },
  precio_venta: {
    type: _sequelize.default.DECIMAL(10, 2),
    allowNull: false
  },
  cantidad: {
    type: _sequelize.default.INTEGER,
    allowNull: false
  },
  fecha_creacion: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  empresa: {
    type: _sequelize.default.STRING(100),
    allowNull: false
  },
  estado: {
    type: _sequelize.default.STRING(20),
    defaultValue: "ACTIVO"
  },
  forma_pago: {
    type: _sequelize.default.STRING(100),
    defaultValue: "EFECTIVO"
  }
}, {
  tableName: "reporte",
  underscored: true,
  timestamps: false,
  schema: "esq_reporte"
});

var _default = Reporte;
exports.default = _default;