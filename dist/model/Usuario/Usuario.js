"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Usuario = _conexion_sequelize.default.define("usuario", {
  id: {
    primaryKey: true,
    type: _sequelize.default.INTEGER,
    autoIncrement: true
  },
  usuario: {
    type: _sequelize.default.STRING(255)
  },
  contracena: {
    type: _sequelize.default.STRING(255)
  },
  perfil: {
    type: _sequelize.default.STRING(25)
  },
  empresa: {
    type: _sequelize.default.STRING(160),
    allowNull: false
  },
  estado: {
    type: _sequelize.default.STRING(1),
    defaultValue: "A"
  },
  activos: {
    type: _sequelize.default.STRING(20),
    defaultValue: "BASICO"
  },
  fecha_ultimo_acceso: {
    type: _sequelize.default.DATE,
    defaultValue: _sequelize.default.NOW
  }
}, {
  //Tabla asociada al objeto
  tableName: "usuario",
  underscored: true,
  timestamps: false,
  schema: "esq_usuario"
});

var _default = Usuario;
exports.default = _default;