import empty from "is-empty";
// import db from "../../database/conexion_sequelize"
// import sequelize from "sequelize"
// import Caja from "../../model/Caja/Caja";
// import axios from 'axios'
// import Reporte from "../../model/Reporte/Reporte";
// import Movimiento from "../../model/Caja/Movimiento";
import moment from "moment";
import { sql } from "../../database/conexion";
import { CuadreIni, TotalMovimientos, TotalVentas, TotalVentasTarjeta, TotalVentasTransferencia } from "../../function/cuadreCaja";

export async function ListarCajas(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin, estado } = req.body;
        let query = `SELECT * FROM caja WHERE empresa = '${empresa}' AND estado = '${estado}' AND fecha_cuadre BETWEEN '${fecha_ini}' and '${fecha_fin}' ORDER BY id DESC`
        const response = await sql.query(query);
        if(!empty(response)){
            res.status(200).json({
                success: true,
                data: response[0],
            })
        }else{
            res.status(200).json({
                success: false,
                data: response[0],
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export async function ListarCajaActual(req, res) {
    try {
        const { empresa } = req.body;
        let query = `SELECT * FROM caja WHERE empresa = '${empresa}' ORDER BY id DESC LIMIT 1 `
        const response = await sql.query(query);
        if(!empty(response[0])){
            res.status(200).json({
                success: true,
                data: response[0],
            })
        }else{
            res.status(200).json({
                success: false,
                data: response[0],
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

export async function CrearCuadreCaja(req, res) {
    try {
        const { empresa, fecha_cuadre, usuario, estado, conteo, cantidaVouchers, totalVouchers } = req.body
        let fecha_ini = fecha_cuadre.split(" ")[0]
        console.log("fecha_ini", fecha_ini)
        console.log("fecha_cuadre", fecha_cuadre)
        console.log("empresa", empresa)
        const ventaTotal = await TotalVentas(empresa, estado, fecha_ini)
        console.log("TotalVentas",ventaTotal)

        const respuesta2 = await TotalVentasTarjeta(empresa, estado, fecha_ini)//Total de vetnas respuesta2
        console.log("TotalVentasTarjeta", respuesta2)


        const response3 = await TotalVentasTransferencia(empresa, estado, fecha_ini)//Total de vetnas respuesta3
        console.log("TotalVentasTransferencia", response3)

        const {ingreso, salida} = await TotalMovimientos(empresa, estado, fecha_ini)//Total de vetnas respuesta3
        console.log("TotalMovimientos", "Ingreso:",ingreso, "Salida:",salida)

        const respuesta5 = await CuadreIni(empresa)//Total de vetnas respuesta4
        console.log("CuadreIni", respuesta5)

        let cuadre_total = ventaTotal + ingreso + respuesta5 - salida
        console.log("CuadreTotal", parseFloat((cuadre_total).toFixed(2)))

        await sql.query(`INSERT INTO caja 
        (fecha_cuadre, fecha, usuario, conteo, venta, cuadre_total, empresa, estado, cantidaVouchers, totalVouchers) VALUES 
        ('${fecha_cuadre}', '${fecha_ini}', '${usuario}', '${conteo}', '${ventaTotal}', '${cuadre_total}', '${empresa}', 'ACTIVO', '${cantidaVouchers}', '${respuesta2}')`)

        await sql.query(`UPDATE ventas SET estado = 'CUADRE' WHERE empresa = '${empresa}' AND estado = 'ACTIVO'`)

        await sql.query(`UPDATE movimiento SET estado = 'CUADRE' WHERE empresa = '${empresa}'`)


        res.json({
            success: true,
            data: {
                total_venta: parseFloat((cuadre_total).toFixed(2)),
                venta: ventaTotal,
                conteo: conteo,
                tarjeta: respuesta2,
                transferencia: response3,
            }
        })

    } catch (error) {
        console.log("ListarReporte", error)
    }
}


export async function CrearVenta(req, res) {
    const { empresa, tienda, secuencial, caja_usuario, forma_pago } = req.body;
    var count = 0;
    let fecha = moment().format("DD/MM/YYYY");
    console.log("fecha: ", fecha)
    for (var index = 0; index < tienda.length; index++) {
        const { producto, cantidad, precio_venta } = tienda[index];
        await sql.query(`INSERT INTO ventas 
        (secuencia, producto, precio_venta, cantidad, fecha_creacion, empresa, estado, forma_pago, caja_usuario, fecha) VALUES 
        ('${secuencial}', '${producto}', ${precio_venta}, ${cantidad}, '${moment().format('DD/MM/YYYY HH:mm:ss')}','${empresa}', 'ACTIVO',  '${forma_pago}', '${caja_usuario}', '${fecha}')`)
        count = count + 1;
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
            res.json({
                success: true,
                msg: "Se obtuvo correctamente los totales",
                data: response[0][0]
            })
        }else{
            res.json({
                success: false,
                data:{}
            })
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}



export async function ActualizaCaja(req, res){
    try {
        const { empresa, cantidad } = req.body
        let query = `SELECT * FROM caja WHERE empresa = '${empresa}' ORDER BY id DESC LIMIT 1 `
        const response = await sql.query(query)
        if(!empty(response[0])){
            // let cuadre_total = response[0][0].cuadre_total + cantidad
            let id = response[0][0].id
            console.log("id", id)
            let query = `UPDATE caja SET cuadre_total = ${cantidad} WHERE id = ${id}`
            const [row] = await sql.query(query)
            console.log("row", row)
            if(row.affectedRows > 0){
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
        }else{
            res.json({
                success: false,
                msg: "No se actualizo el estado"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            msg: "No se actualizo el estado",
            error
        })
    }
}

//movimiento de caja para 
export async function IngresarMovimiento(req, res) {
    try {
        const { detalle, usuario, empresa, ingreso, salida, fecha } = req.body
        let estado = "ACTIVO"
        let fechaCreacion = moment().format('DD/MM/YYYY')
        let query = `INSERT INTO movimiento (detalle, usuario, empresa, ingreso, salida, fecha, estado, fechaCreacion) VALUES ('${detalle}', '${usuario}', '${empresa}', ${ingreso}, ${salida}, '${fecha}', '${estado}', '${fechaCreacion}')`
        const response = await sql.query(query)
        if(response[0].affectedRows > 0){
            res.json({
                success: true,
                msg: "Se registro correctamente el movimiento"
            })
        }else{
            res.json({
                success: false,
                msg: "No se registro el movimiento"
            })
        }
    } catch (error) {
        console.log("IngresarMovimiento",error)
    }
}

export async function EliminarMovimiento(req, res) {
    try {
        const { id } = req.body
        let query = `DELETE FROM movimiento WHERE id = ${id}`
        const response = await sql.query(query)
        if(response[0].affectedRows > 0){
            res.json({
                success: true,
                msg: "Se elimino correctamente el movimiento"
            })
        }else{
            res.json({
                success: false,
                msg: "No se elimino el movimiento"
            })
        }
    } catch (error) {
        console.log("EliminarMovimiento",error)
    }
}

export async function ListarMovimiento(req, res) {
    try {
        const { empresa, estado, fecha } = req.query;
        let query = `SELECT * FROM movimiento WHERE empresa = '${empresa}' AND estado = '${estado}' AND fechaCreacion = '${fecha}' ORDER BY id DESC`
        const response = await sql.query(query)
        console.log("ListarMovimiento", response[0])
        if(response[0].length > 0){
            res.json({
                success: true,
                data: response[0],
                msg:'ListarMovimiento',
            })
        }else{
            res.json({
                success: false,
                msg: "no se encontro movimiento"
            })
        }

    } catch (error) {
        console.log("ListarReporte", error)
    } 
}

export async function ListarMovimientoAdmin(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin } = req.body;
        console.log("ListarMovimientoAdmin", req.body)
        let query = `SELECT * FROM movimiento 
        WHERE empresa = '${empresa}' AND fechaCreacion BETWEEN '${fecha_ini}' AND '${fecha_fin}' 
        ORDER BY id DESC`
        const response = await sql.query(query)
        if(response[0].length > 0){
            res.json({
                success: true,
                data: response[0],
                msg:'ListarMovimiento',
            })
        }else{
            res.json({
                success: false,
                msg: "no se encontro movimiento"
            })
        }

    } catch (error) {
        console.log("ListarReporte", error)
    } 
}

export async function ListarMovimientoAdminFechas() {
    try {
        let query = `SELECT * FROM caja`
        const response = await sql.query(query)
        if(response[0].length > 0){
            for (let index = 0; index < response[0].length; index++) {
                const items = response[0][index]
                let query = `UPDATE caja SET fecha = '${items.fecha_cuadre.split(" ")[0]}' WHERE id = ${items.id}`
                const [row] = await sql.query(query)
                console.log("row", row.affectedRows)
            }
        }

    } catch (error) {
        console.log("ListarReporte", error)
    }  
}

export async function ListarCuadresAdminFechas(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin } = req.body;
        let query = `SELECT * FROM caja WHERE fecha BETWEEN '${fecha_ini}' AND '${fecha_fin}' AND empresa = '${empresa}' ORDER BY id DESC`
        const response = await sql.query(query)  
        if(response[0].length > 0){
            res.json({
                success: true,
                data: response[0],
                msg:'ListarCuadresAdminFechas',
            })
        }else{
            res.json({
                success: false,
                msg: "no se encontro cuadres"
            })
        }
    } catch (error) {
        console.log("ListarCuadresAdminFechas", error)
    }  
}