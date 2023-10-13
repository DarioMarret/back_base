import empty from "is-empty";
// import db from "../../database/conexion_sequelize"
// import sequelize from "sequelize"
// import Reporte from "../../model/Reporte/Reporte";
import isEmpty from "is-empty";
import moment from "moment";
import { sql } from "../../database/conexion";

export async function ListarReporte(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin } = req.body;

        let query = `SELECT * FROM ventas WHERE empresa = '${empresa}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}' ORDER BY fecha_creacion`
        const response = await sql.query(query)
        if (!empty(response[0])) {
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                data: response[0],
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export const EmitidosSecuencia = async (req, res) => {
    try {
        const { empresa, secuencia } = req.body;
        let query = `SELECT * FROM ventas WHERE secuencia = '${secuencia}' AND empresa = '${empresa}' `
        const response = await sql.query(query)
        if (!empty(response[0])) {
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                data: response[0],
            })
        }  
    } catch (error) {
        res.json({
            success: false,
            data: error,
        })
    }
}

export async function ListarReporteActual(req, res) {
    try {
        const { empresa, fecha, fecha_fin } = req.query
        let estado = "CUADRE"
        let query = `SELECT secuencia, fecha, empresa, sum(precio_venta * cantidad) AS total, estado, forma_pago FROM ventas 
        WHERE empresa = '${empresa}' AND fecha = '${fecha}' AND estado != '${estado}' GROUP BY secuencia, empresa, fecha, estado, forma_pago`;
        const respuesta = await sql.query(query)
        if (!empty(respuesta[0])) {
            res.json({
                success: true,
                data: respuesta[0],
                msg: "reporte actual"
            })
        }else{
            res.json({
                success: false,
                data: respuesta[0],
                msg: "no se encontro reporte"
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export async function CrearVenta(req, res) {
    const { empresa, tienda, secuencial, caja_usuario, forma_pago, contador } = req.body;
    var count = 0;
    let fecha = moment().format("DD/MM/YYYY");
    console.log("fecha: ",moment().format("DD/MM/YYYY HH:mm:ss"))
    for (var index = 0; index < tienda.length; index++) {
        const { producto, cantidad, precio_venta } = tienda[index];
        await sql.query(`INSERT INTO ventas 
        (secuencia, producto, precio_venta, cantidad, fecha_creacion, empresa, estado, forma_pago, caja_usuario, fecha) VALUES 
        ('${secuencial}', '${producto}', ${precio_venta}, ${cantidad}, '${moment().format('DD/MM/YYYY HH:mm:ss')}','${empresa}', 'ACTIVO',  '${forma_pago}', '${caja_usuario}', '${fecha}')`)
        count = count + 1;
    }

    if(!isEmpty(contador)){
        await InfoEmpresanumeroSecuencialActualiza(empresa)
    }

    if(index === tienda.length){
        res.json({
            success:true,
            msg:'Se registro correctamente la Factura',
            items: "item registrado "+count
        })
    }else{
        console.log("error")
    }
}

const InfoEmpresanumeroSecuencialActualiza = async (empresa) => {
    try {
        const consulta = await sql.query(`SELECT * FROM empresa WHERE empresa = ?`, [empresa])
        if(consulta[0].length > 0){
            let numero_secuencial = parseInt(consulta[0][0].numero_secuencial) + 1
            let new_numero_secuencial = numero_secuencial.toString().padStart(9, "0")
            await sql.query(`UPDATE empresa SET numero_secuencial = ? WHERE empresa = ?`, [new_numero_secuencial, empresa]);
            return {
                success: true,
                numero_secuencial
            }
        }else{
            return {
                success: false,
                message: "La empresa no existe"
            }
        }
    } catch (error) {
        return 0
    }
}

export async function ActualizarEstado(req, res) {
    try {
        const { editar, forma_pago, estado } = req.body
        const { secuencia, empresa } = editar
        if(!empty(forma_pago) && !empty(estado)){
            let query = `UPDATE ventas SET estado = '${estado}', forma_pago = '${forma_pago}' WHERE secuencia = '${secuencia}' AND empresa = '${empresa}'`
            const respuesta = await sql.query(query)
            if(!empty(respuesta)){
                res.json({
                    success: true,
                    msg: "Se actualizo correctamente el estado"
                })
            }else{
                res.json({
                    success: false,
                    msg: "No se actualizo el estado"
                })
            }

        }else if(!empty(estado)){

            let query = `UPDATE ventas SET estado = '${estado}' WHERE secuencia = '${secuencia}' AND empresa = '${empresa}'`
            const respuesta = await sql.query(query)
            console.log("respuesta", respuesta)
            if(respuesta[0].affectedRows > 0){
                res.json({
                    success: true,
                    msg: "Se actualizo correctamente el estado"
                })
            }else{
                res.json({
                    success: false,
                    msg: "No se actualizo el estado"
                })
            }
        }else if(!empty(forma_pago)){
            let query = `UPDATE ventas SET forma_pago = '${forma_pago}' WHERE secuencia = '${secuencia}' AND empresa = '${empresa}'`
            const respuesta = await sql.query(query)
            if(!empty(respuesta)){
                res.json({
                    success: true,
                    msg: "Se actualizo correctamente el estado"
                })
            }else{
                res.json({
                    success: false,
                    msg: "No se actualizo el estado"
                })
            }
        }

    } catch (error) {
        console.log("ActualizarEstado", error)
    }
}

export async function SacarTotalesVentaFechas(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin, estado } = req.body;
        let query = `SELECT SUM(precio_venta * cantidad) AS tota_venta FROM ventas WHERE empresa = '${empresa}' AND estado = '${estado}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}'`
        const response = await sql.query(query)
        if(!empty(response[0])){
            console.log("SacarTotalesVenta", response[0])
            res.json({
                success: true,
                data: response[0]
            })
        }else{
            res.json({
                success: false,
                data: response[0],
                msg: "No se encontro datos"
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export async function SacarTotalesVenta(empresa, fecha_ini, fecha_fin, estado) {
    try {
        let forma_pago = 'EFECTIVO'
        let query = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM ventas WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha BETWEEN '${fecha_ini}' AND '${fecha_fin}'`
        const response = await sql.query(query)
        if(!empty(response[0])){
            console.log("SacarTotalesVenta", response[0])
            return response[0][0]
        }else{
            return 0
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export async function ListarReporteAdmin(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin } = req.query
        // let query = `SELECT secuencia, fecha, empresa, sum(precio_venta * cantidad) AS total, estado, forma_pago, caja_usuario
        // FROM ventas  
        // WHERE empresa = '${empresa}' AND fecha BETWEEN '${fecha_ini}' AND '${fecha_fin}' GROUP BY secuencia, fecha, empresa, estado, forma_pago, fecha, caja_usuario`;

        // filtrar solo por fecha y empresa
        let query = `SELECT secuencia, fecha, empresa, sum(precio_venta * cantidad) AS total, estado, forma_pago, caja_usuario
        FROM ventas  
        WHERE empresa = '${empresa}' AND fecha BETWEEN '${fecha_ini}' AND '${fecha_fin}' GROUP BY secuencia, fecha, empresa, estado, forma_pago, fecha, caja_usuario`;
        const respuesta = await sql.query(query)
        if (!empty(respuesta[0])) {
            var reporte = []
            // sacar todo lo que este en el rango de fecha_ini y fecha_fin
            for (let index = 0; index < respuesta[0].length; index++) {
                const element = respuesta[0][index];
                // fecha tiene que ser igual a fecha_ini y menor o igual a fecha_fin
                let fecha = moment(element.fecha).format("DD/MM/YYYY")
                let fecha_ini_format = moment(fecha_ini).format("DD/MM/YYYY")
                let fecha_fin_format = moment(fecha_fin).format("DD/MM/YYYY")
                if(fecha == fecha_ini_format || fecha <= fecha_fin_format){
                    reporte.push(element)
                }
            }
            res.json({
                success: true,
                data: reporte,
                msg: "reporte actual"
            })
        }else{
            res.json({
                success: false,
                data: [],
                msg: "no se encontro reporte"
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}