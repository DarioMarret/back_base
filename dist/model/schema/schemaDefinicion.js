"use strict";

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = [// {"esquema":"esq_usuario"},
// {"esquema":"esq_productos"},
{
  "esquema": "esq_reporte"
}];

for (var index = 0; index < schema.length; index++) {
  _conexion_sequelize.default.createSchema(schema[index].esquema).then(() => {
    if (index == schema.length) {
      _conexion_sequelize.default.sync({
        force: false
      }).then(() => {
        console.log("Esquema creado ");
      }).catch(err => console.log("response:  ", err.original));
    }
  }).catch(err => {
    if (err) {
      _conexion_sequelize.default.sync({
        force: false
      }).then(() => {}).catch(err => console.log("response:  ", err.original));
    }
  });
}