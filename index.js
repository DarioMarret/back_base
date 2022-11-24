import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import https from 'https';
import fs from 'fs';

import 'dotenv/config'
import './src/database/conexion_sequelize'
// import './src/model/index'

import Login from './src/router/login/login'
import Productos from './src/router/productos/productos'
import Reporte from './src/router/reporte/reporte'
import Caja from './src/router/caja/caja'

const app = express();
const port =3001 // process.env.PORT;

app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({
    limit: '50mb',
    extended: true
}));
app.use(fileUpload())
app.use("/resource", express.static(path.resolve(__dirname, './src/public')))


app.use("/v1",Login)
app.use("/v1",Productos)
app.use("/v1",Reporte)
app.use("/v1",Caja)


// const sslserver = https.createServer(
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


app.listen(port, async() => {
    console.log(`Server listening on ${port}`);
});