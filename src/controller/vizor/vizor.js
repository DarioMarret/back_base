import moment from "moment";
import { sql } from "../../database/conexion";


export const RegistrarOrden = async (req, res) => {
    const { orden, usuario, mesa, empresa } = req.body
    let fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log("orden: ",orden)
    console.log("mesero: ",usuario)
    console.log("mesa: ",mesa)
    console.log("empresa: ",empresa)
    try {
        // listar cual es la ultima orden de la empresa
        let query = `SELECT * FROM orden WHERE empresa = '${empresa}' ORDER BY id DESC LIMIT 1`
        const response = await sql.query(query)
        var numero_ordenes = 1
        if (response[0].length > 0) {
            numero_ordenes = response[0][0].orden + 1
        }

        // verificar  si ya existe una orden con el mismo numero de mesa y random para eliminar todo y crear nuevamente con el mismo random y numero de orden
        let me = `SELECT * FROM orden WHERE empresa = '${empresa}' AND mesa = '${mesa}' AND random = '${orden[0].random}'`
        const exitencia = await sql.query(me)
        if (exitencia[0].length > 0) {
            // eliminar todo
            let mismo_numero_orden = exitencia[0][0].orden
            let query = `DELETE FROM orden WHERE empresa = '${empresa}' AND mesa = '${mesa}' AND random = '${orden[0].random}'`
            await sql.query(query)
            for (let index = 0; index < orden.length; index++) {
                const items = orden[index];
                let query = `INSERT INTO orden (auxiliar, producto, precio_venta, porcentaje_iva, porcentaje, empresa, cantidad, opt, random, orden, usuario, fecha, mesa) VALUES 
                ('${items.auxiliar}', '${items.producto}', ${parseFloat(items.precio_venta)}, ${parseFloat(items.porcentaje_iva)}, ${items.porcentaje}, '${empresa}', ${items.cantidad}, '${items.opt}', '${items.random}', ${mismo_numero_orden}, '${usuario}', '${fecha}', '${mesa}')`
                await sql.query(query)
            }
            return res.json({ success: true, message: 'Orden registrada con exito', orden: mismo_numero_orden, mesa: mesa })
        }

        for (let index = 0; index < orden.length; index++) {
            const items = orden[index];
            let query = `INSERT INTO orden (auxiliar, producto, precio_venta, porcentaje_iva, porcentaje, empresa, cantidad, opt, random, orden, usuario, fecha, mesa) VALUES 
            ('${items.auxiliar}', '${items.producto}', ${parseFloat(items.precio_venta)}, ${parseFloat(items.porcentaje_iva)}, ${items.porcentaje}, '${empresa}', ${items.cantidad}, '${items.opt}', '${items.random}', ${numero_ordenes}, '${usuario}', '${fecha}', '${mesa}')`
            await sql.query(query)
        }

        return res.json({ success: true, message: 'Orden registrada con exito', orden: numero_ordenes, mesa: mesa })
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

export const ListarOrdenesPorEmpresaMesa = async (req, res) => {
    const { empresa, mesa } = req.body
    try {
        let query = `SELECT * FROM orden WHERE empresa = '${empresa}' AND mesa = '${mesa}'`
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

export const EliminarItemsOrden = async (req, res) => {
    const { id, cantidad } = req.params
    try {
        // si la cantidad es mayor a 0 se resta la cantidad del item
        if (parseInt(cantidad) > 0) {
            let query = `UPDATE orden SET cantidad = cantidad - ${cantidad} WHERE id = ${id}`
            const response = await sql.query(query)
            return res.json({
                success: true,
                data: response
            })
        }
        let query = `DELETE FROM orden WHERE id = ${id}`
        const response = await sql.query(query)
        return res.json({
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
        console.log("empresa: ",empresa)
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
    const { empresa } = req.body
    try {
        // ver cual es el ultimo numero de mesa de la empresa y sumarle 1
        let sum_mesa = `SELECT * FROM mesas WHERE empresa = '${empresa}' ORDER BY id DESC LIMIT 1`
        const response = await sql.query(sum_mesa)
        var numero_mesa = 1
        if (response[0].length > 0) {
            numero_mesa = response[0][0].numero_mesa + 1
            let query = `INSERT INTO mesas (empresa, numero_mesa) VALUES ('${empresa}', '${numero_mesa}')`
            await sql.query(query)
            return res.json({
                success: true,
                data: "Mesa registrada con exito"
            })

        }else{
            let query = `INSERT INTO mesas (empresa, numero_mesa) VALUES ('${empresa}', '${numero_mesa}')`
            await sql.query(query)
            return res.json({
                success: true,
                data: "Mesa registrada con exito"
            })
        }
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

export const ActualizarCantidadOpt = async (req, res) => {
    const { id, cantidad, opt } = req.body
    try {
        console.log("body: ",req.body)
        let query = `UPDATE orden SET cantidad = ${cantidad}, opt = '${opt}' WHERE id = ${id}`
        const response = await sql.query(query)
        console.log("response: ",response)
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

export const ActualizarTotalMesa = async (req, res) => {
    const { id, total } = req.body
    try {
        let query = `UPDATE mesas SET total = ${total} WHERE id = ${id}`
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

export const CambiarEstadoMesa = async (req, res) => {
    const { id, estado, mesero, ceder } = req.body
    try {
        if (ceder == true) {
            // si ceder se actualiza el mesero y ceder = "SI"
            let query = `UPDATE mesas SET estado = '${estado}', mesero = '${mesero}', ceder = 'SI' WHERE id = '${id}'`
            const response = await sql.query(query)
            return res.json({
                success: true,
                data: response
            })
        }
        let fecha = moment().format('YYYY-MM-DD HH:mm:ss')
        let query = `UPDATE mesas SET estado = '${estado}', mesero = '${mesero}', fecha_registros = '${fecha}', ceder = 'NO' WHERE id = '${id}'`
        const response = await sql.query(query)
        return res.json({
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