import moment from "moment";
import { sql } from "../../database/conexion";


export const RegistrarOrden = async (req, res) => {
    const { orden, usuario, mesa } = req.body
    let fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
        // listar cual es la ultima orden de la empresa
        let query = `SELECT * FROM orden WHERE empresa = '${orden[0].empresa}' ORDER BY id DESC LIMIT 1`
        const response = await sql.query(query)
        var numero_ordenes = 1
        if (response[0].length > 0) {
            numero_ordenes = response[0][0].orden + 1
        }

        for (let index = 0; index < orden.length; index++) {
            const items = orden[index];
            let query = `INSERT INTO orden (auxiliar, producto, precio_venta, porcentaje_iva, porcentaje, empresa, cantidad, opt, random, orden, usuario, fecha, mesa) VALUES 
            ('${items.auxiliar}', '${items.producto}', ${parseFloat(items.precio_venta)}, ${parseFloat(items.porcentaje_iva)}, ${items.porcentaje}, '${items.empresa}', ${items.cantidad}, '${items.opt}', '${items.random}', ${numero_ordenes}, '${usuario}', '${fecha}', '${mesa}')`
            await sql.query(query)
        }

        res.json({ success: true, message: 'Orden registrada con exito', orden: numero_ordenes, mesa: mesa })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarOrdenes = async (req, res) => {
    const { empresa } = req.body
    try {
        let query = `SELECT * FROM orden WHERE empresa = '${empresa}'`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response[0]
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }    
}

export const EliminarProductoOrden = async (req, res) => {
    const { id } = req.params
    try {
        let query = `DELETE FROM orden WHERE id = ${id}`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const EliminarOrden = async (req, res) => {
    const { empresa, random } = req.params
    try {
        let query = `DELETE FROM orden WHERE empresa = '${empresa}' AND random = '${random}'`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response
        })
    } catch (error) {
        res.json({
            success: false,
            data: error
        })
    }
}


// mesas
export const ListarMesas = async (req, res) => {
    const { empresa } = req.body
    try {
        let query = `SELECT * FROM mesas WHERE empresa = '${empresa}'`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response[0]
        })
    } catch (error) {
        res.json({
            success: false,
            data: error
        })
    }
}

export const RegistrarMesa = async (req, res) => {
    const { empresa, mesa } = req.body
    try {
        let query = `INSERT INTO mesas (empresa, mesa) VALUES ('${empresa}', '${mesa}')`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response
        })
    } catch (error) {
        res.json({
            success: false,
            data: error
        })
    }
}

export const EliminarMesa = async (req, res) => {
    const { id, empresa } = req.params
    try {
        // verificar que la mesa este disponible para eliminarla
        let me = `SELECT * FROM orden WHERE empresa = '${empresa}' AND id = '${id}'`
        const response = await sql.query(me)
        if (response[0].length > 0 && response[0][0].estado == "Disponible") {
            return res.json({
                success: false,
                data: 'La mesa no se puede eliminar porque tiene ordenes activas'
            })
        }

        let query = `DELETE FROM mesas WHERE empresa = '${empresa}' AND id = '${id}'`
        await sql.query(query)
        res.json({
            success: true,
            data: "Mesa eliminada con exito"
        })
    } catch (error) {
        res.json({
            success: false,
            data: error
        })
    }
}

export const CambiarEstadoMesa = async (req, res) => {
    const { id, estado, mesero } = req.body
    try {
        let fecha = moment().format('YYYY-MM-DD HH:mm:ss')
        let query = `UPDATE mesas SET estado = '${estado}', mesero = '${mesero}', fecha = '${fecha}' WHERE id = '${id}'`
        const response = await sql.query(query)
        res.json({
            success: true,
            data: response
        })
    } catch (error) {
        res.json({
            success: false,
            data: error
        })
    }
}