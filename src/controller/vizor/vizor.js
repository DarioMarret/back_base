import moment from "moment";
import { sql } from "../../database/conexion";


export const RegistrarOrden = async (req, res) => {
    const { orden, usuario } = req.body
    let fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
        for (let index = 0; index < orden.length; index++) {
            const items = orden[index];
            let query = `INSERT INTO orden (auxiliar, producto, precio_venta, porcentaje_iva, porcentaje, empresa, cantidad, opt, random, usuario, fecha) VALUES 
            ('${items.auxiliar}', '${items.producto}', ${parseFloat(items.precio_venta)}, ${parseFloat(items.porcentaje_iva)}, ${items.porcentaje}, '${items.empresa}', ${items.cantidad}, '${items.opt}', '${items.random}', '${usuario}', '${fecha}')`
            await sql.query(query)            
        }
        res.json({ message: 'Orden registrada' })
    } catch (error) {
        console.log(error)
    }
}

export const ListarOrdenes = async (req, res) => {
    const { empresa } = req.body
    try {
        let query = `SELECT * FROM orden WHERE empresa = '${empresa}'`
        const response = await sql.query(query)
        res.json(response)
    } catch (error) {
        console.log(error)
    }    
}

export const EliminarProductoOrden = async (req, res) => {
    const { id } = req.params
    try {
        let query = `DELETE FROM orden WHERE id = ${id}`
        const response = await sql.query(query)
        res.json(response)
    } catch (error) {
        console.log(error)
    }
}

export const EliminarOrden = async (req, res) => {
    const { empresa, random } = req.body
    try {
        let query = `DELETE FROM orden WHERE empresa = '${empresa}' AND random = '${random}'`
        const response = await sql.query(query)
        res.json(response)
    } catch (error) {
        console.log(error)
    }
}