"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

require("dotenv/config");

require("./database/conexion_sequelize");

var _login = _interopRequireDefault(require("./router/login/login"));

var _productos = _interopRequireDefault(require("./router/productos/productos"));

var _reporte = _interopRequireDefault(require("./router/reporte/reporte"));

var _caja = _interopRequireDefault(require("./router/caja/caja"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './src/model/index'
const app = (0, _express.default)();
const port = 3001; // process.env.PORT;

app.use(_express.default.urlencoded({
  extended: true
}));
app.use((0, _cors.default)());
app.use((0, _morgan.default)("dev"));
app.use(_express.default.json({
  limit: '50mb',
  extended: true
}));
app.use((0, _expressFileupload.default)());
app.use("/resource", _express.default.static(_path.default.resolve(__dirname, './src/public')));
app.use("/v1", _login.default);
app.use("/v1", _productos.default);
app.use("/v1", _reporte.default);
app.use("/v1", _caja.default); // const sslserver = https.createServer(
//   {
//     key: fs.readFileSync(
//       path.join(__dirname, "../../conf/bitnami/certs", "server.key")
//     ),
//     cert: fs.readFileSync(
//       path.join(__dirname, "../../conf/bitnami/certs", "server.crt")
//     ),
//   },
//   app
// );

app.listen(port, async () => {
  console.log(`Server listening on ${port}`);
});