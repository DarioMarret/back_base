import isEmpty from "is-empty"
import { sql } from "../database/conexion"

/**
 * 
 * @param {*} empresa 
 * @param {*} estado 
 * @param {*} fecha_ini 
 * @returns 
 */
export const TotalVentas = async (empresa, estado, fecha_ini) =>{
    try {
        let forma_pago = 'EFECTIVO'
        let query = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM ventas WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha = '${fecha_ini}'`
        const response = await sql.query(query)
        if(!isEmpty(response[0])){
            return !isEmpty(response[0][0].total_venta) ? parseFloat(response[0][0].total_venta) : 0
        }else{
            return 0
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}
/**
 * 
 * @param {*} empresa 
 * @param {*} estado 
 * @param {*} fecha_ini 
 * @returns 
 */
export const TotalVentasTarjeta = async (empresa, estado, fecha_ini) =>{
    try {
        let forma_pago = 'TARJETA'
        let query = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM ventas WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha = '${fecha_ini}'`
        const response = await sql.query(query)
        if(!isEmpty(response[0])){
            return !isEmpty(response[0][0].total_venta) ? parseFloat(response[0][0].total_venta) : 0
        }else{
            return 0
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

/**
 * 
 * @param {*} empresa 
 * @param {*} estado 
 * @param {*} fecha_ini 
 * @returns 
 */
export const TotalVentasTransferencia = async (empresa, estado, fecha_ini) =>{
    try {
        let forma_pago = 'TRANSFERENCIA'
        let query = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM ventas WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha = '${fecha_ini}'`
        const response = await sql.query(query)
        if(!isEmpty(response[0])){
            return !isEmpty(response[0][0].total_venta) ? parseFloat(response[0][0].total_venta) : 0
        }else{
            return 0
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}

/**
 * 
 * @param {*} empresa 
 * @param {*} estado 
 * @param {*} fecha_ini 
 * @returns 
 */
export const TotalMovimientos = async (empresa, estado, fecha_ini) =>{
    try {
        let query = `SELECT sum(ingreso) AS ingreso, sum(salida) AS salida FROM movimiento WHERE empresa = '${empresa}' AND fechaCreacion = '${fecha_ini}' AND estado = '${estado}'`;
        const response = await sql.query(query)
        if(!isEmpty(response[0])){
            return {
                ingreso: !isEmpty(response[0][0].ingreso) ? parseFloat(response[0][0].ingreso) : 0,
                salida: !isEmpty(response[0][0].salida) ? parseFloat(response[0][0].salida) : 0
            }
        }else{
            return {
                ingreso:0,
                salida:0
            }
        }
    } catch (error) {
        console.log("ListarReporte", error)
    }
}
/**
 * 
 * @param {*} empresa 
 * @param {*} estado 
 * @returns 
 */
export async function CuadreIni(empresa){
    let query = `SELECT venta, cuadre_total FROM caja  WHERE empresa = '${empresa}' ORDER BY id DESC LIMIT 1`;
    const response = await sql.query(query)
    if(!isEmpty(response[0])){
        return !isEmpty(response[0][0].cuadre_total) ? parseFloat(response[0][0].cuadre_total): 0
    }else{
        return 0
    }
}