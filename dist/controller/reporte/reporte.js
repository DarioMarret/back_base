"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActualizarEstado = ActualizarEstado;
exports.CrearVenta = CrearVenta;
exports.ListarReporte = ListarReporte;
exports.ListarReporteActual = ListarReporteActual;
exports.SacarTotalesVenta = SacarTotalesVenta;
exports.SacarTotalesVentaFechas = SacarTotalesVentaFechas;

var _isEmpty = _interopRequireDefault(require("is-empty"));

var _conexion_sequelize = _interopRequireDefault(require("../../database/conexion_sequelize"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Reporte = _interopRequireDefault(require("../../model/Reporte/Reporte"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ListarReporte(req, res) {
  try {
    const {
      empresa,
      fecha_ini,
      fecha_fin
    } = req.body;
    let sql = `SELECT * FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}' ORDER BY fecha_creacion`;

    _conexion_sequelize.default.query(sql, {
      type: _sequelize.default.QueryTypes.SELECT
    }).then(response => {
      console.log("reporte", response);

      if (!(0, _isEmpty.default)(response)) {
        res.json({
          success: true,
          data: response,
          msg: 'reporte por fecha'
        });
      } else {
        res.json({
          msg: "no se encontro reporte"
        });
      }
    }).catch(err => {
      console.log("Error", err);
    });
  } catch (error) {
    console.log("ListarReporte", error);
  }
}

async function ListarReporteActual(req, res) {
  try {
    const {
      empresa,
      fecha
    } = req.query;
    let estado = "CUADRE";
    let sql = `SELECT secuencia, fecha_creacion, empresa, sum(precio_venta * cantidad) AS total, estado, forma_pago FROM esq_reporte.reporte  WHERE empresa = '${empresa}' AND fecha_creacion = '${fecha}' AND estado != '${estado}' GROUP BY secuencia, empresa, fecha_creacion, estado, forma_pago`;

    _conexion_sequelize.default.query(sql, {
      type: _sequelize.default.QueryTypes.SELECT
    }).then(response => {
      console.log("reporte", response);

      if (!(0, _isEmpty.default)(response)) {
        res.json({
          success: true,
          data: response,
          msg: 'reporte por fecha'
        });
      } else {
        res.json({
          msg: "no se encontro reporte"
        });
      }
    }).catch(err => {
      console.log("Error", err);
    });
  } catch (error) {
    console.log("ListarReporte", error);
  }
}

async function CrearVenta(req, res) {
  const {
    empresa,
    tienda,
    secuencial,
    fecha
  } = req.body;
  var count = 0;

  for (var index = 0; index < tienda.length; index++) {
    _Reporte.default.create({
      secuencia: secuencial,
      producto: tienda[index].producto,
      precio_venta: tienda[index].precio_venta,
      cantidad: tienda[index].cantidad,
      fecha_creacion: fecha,
      empresa
    }).then(response => {
      count += 1;
    }).catch(err => {
      console.log(err);
    });
  }

  if (index === tienda.length) {
    res.json({
      success: true,
      msg: 'Se registro correctamente la Factura',
      items: "item registrado " + count
    });
  } else {
    console.log("error");
  }
}

async function ActualizarEstado(req, res) {
  try {
    const {
      editar,
      forma_pago,
      estado
    } = req.body;
    const {
      secuencia,
      empresa
    } = editar;

    if (!(0, _isEmpty.default)(forma_pago) && !(0, _isEmpty.default)(estado)) {
      const response = await _Reporte.default.update({
        estado,
        forma_pago
      }, {
        where: {
          secuencia,
          empresa
        }
      });
      console.log(response);

      if (!(0, _isEmpty.default)(response[0])) {
        res.json({
          success: true,
          data: response[0],
          msg: 'reporte Actualizado'
        });
      } else {
        res.json({
          success: false,
          msg: "no se pudo actualizar"
        });
      }
    } else if (!(0, _isEmpty.default)(estado)) {
      const response = await _Reporte.default.update({
        estado
      }, {
        where: {
          secuencia,
          empresa
        }
      });
      console.log(response);

      if (!(0, _isEmpty.default)(response[0])) {
        res.json({
          success: true,
          data: response[0],
          msg: 'reporte Actualizado'
        });
      } else {
        res.json({
          success: false,
          msg: "no se pudo actualizar"
        });
      }
    } else if (!(0, _isEmpty.default)(forma_pago)) {
      const response = await _Reporte.default.update({
        forma_pago
      }, {
        where: {
          secuencia,
          empresa
        }
      });
      console.log(response);

      if (!(0, _isEmpty.default)(response[0])) {
        res.json({
          success: true,
          data: response[0],
          msg: 'reporte Actualizado'
        });
      } else {
        res.json({
          success: false,
          msg: "no se pudo actualizar"
        });
      }
    }
  } catch (error) {
    console.log("ActualizarEstado", error);
  }
}

async function SacarTotalesVentaFechas(req, res) {
  try {
    const {
      empresa,
      fecha_ini,
      fecha_fin,
      estado
    } = req.body;
    let sql = `SELECT SUM(precio_venta * cantidad) AS tota_venta FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND estado = '${estado}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}'`;

    _conexion_sequelize.default.query(sql, {
      type: _sequelize.default.QueryTypes.SELECT
    }).then(response => {
      console.log("SacarTotalesVentaFechas", response[0]);

      if (!(0, _isEmpty.default)(response)) {
        res.json({
          success: true,
          data: response[0],
          msg: 'SacarTotalesVentaFechas'
        });
      } else {
        res.json({
          msg: "no se encontro reporte"
        });
      }
    }).catch(err => {
      console.log("Error", err);
    });
  } catch (error) {
    console.log("ListarReporte", error);
  }
}

async function SacarTotalesVenta(empresa, fecha_ini, fecha_fin, estado) {
  try {
    return new Promise(function (resolve, reject) {
      let forma_pago = 'EFECTIVO';
      let sql = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha_creacion BETWEEN '${fecha_ini}' AND '${fecha_fin}'`;

      _conexion_sequelize.default.query(sql, {
        type: _sequelize.default.QueryTypes.SELECT
      }).then(response => {
        if (!(0, _isEmpty.default)(response)) {
          console.log("SacarTotalesVentaFechas", response[0]);
          resolve(response[0]);
        } else {
          resolve(0);
        }
      }).catch(err => {
        console.log("Error", err);
      });
    });
  } catch (error) {
    console.log("ListarReporte", error);
  }
}