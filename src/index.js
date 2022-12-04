import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';

import 'dotenv/config'
import './database/conexion_sequelize'
import './database/conexion'
import './function/CrearReporte'
// import './src/model/index'

import Login from './router/login/login'
import Productos from './router/productos/productos'
import Reporte from './router/reporte/reporte'
import Caja from './router/caja/caja'

import Newlogin from './router/login/newLogin'

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

app.use("/v1",Newlogin)

app.listen(port, async() => {
    console.log(`Server listening on ${port}`)
})