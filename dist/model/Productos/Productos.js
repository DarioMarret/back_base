"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Producto = _conexion_sequelize.default.define("producto", {
  id: {
    primaryKey: true,
    type: _sequelize.default.INTEGER,
    autoIncrement: true
  },
  id_categoria: {
    type: _sequelize.default.INTEGER,
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
  fecha_creacion: {
    type: _sequelize.default.DATE,
    defaultValue: _sequelize.default.NOW
  },
  porcentaje_iva: {
    type: _sequelize.default.DECIMAL(10, 2),
    defaultValue: 0
  },
  empresa: {
    type: _sequelize.default.STRING(100),
    allowNull: false
  },
  estado: {
    type: _sequelize.default.STRING(1),
    defaultValue: "A"
  }
}, {
  tableName: "producto",
  underscored: true,
  timestamps: false,
  schema: "esq_productos"
});

module.exports = Producto;