import moment from "moment"
import { sql } from "../../database/conexion"


export const RegistrasGastosFacturas = async (req, res) => {
    const { empresa, id_proveedor, numero_factura, total, iva, subtotal, fecha, descripcion } = req.body
    try {
        let forma_fecha = moment(fecha).format('YYYY/MM/DD')
        let mes = moment(fecha).format('MM')
        const response = await sql.query(`INSERT INTO gastos_registros (empresa, id_proveedor, numero_factura, total, iva, subtotal, fecha, mes, descripcion) 
                                    VALUES 
                                    ('${empresa}', '${id_proveedor}', '${numero_factura}', '${total}', '${iva}', '${subtotal}', '${forma_fecha}', '${mes}', '${descripcion}')`)
        if (response) {
            res.json({
                success: true,
                data: response
            })
        } else {
            res.json({
                success: false,
                data: response
            })
        }
    }catch (error) {
        console.log("RegistrasGastosFacturas", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarGastosFacturas = async (req, res) => {
    const { empresa, mes } = req.query
    try {
        if(mes){
            const response = await sql.query(`SELECT * FROM gastos_registros WHERE empresa = '${empresa}' AND mes = '${mes}'`)
            if (response) {
                res.json({
                    success: true,
                    data: response[0]
                })
            } else {
                res.json({
                    success: false,
                    data: response[0]
                })
            }
        }else{
            const response = await sql.query(`SELECT * FROM gastos_registros WHERE empresa = '${empresa}'`)
            if (response) {
                res.json({
                    success: true,
                    data: response[0]
                })
            } else {
                res.json({
                    success: false,
                    data: response[0]
                })
            }
        }
    }catch (error) {
        console.log("ListarGastosFacturas", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarGastosFacturasPorId = async (req, res) => {
    const { empresa, id } = req.query
    try {
        const response = await sql.query(`SELECT * FROM gastos_registros WHERE empresa = '${empresa}' AND id = ${id}`)
        if (response) {
            res.json({
                success: true,
                data: response[0]
            })
        } else {
            res.json({
                success: false,
                data: response[0]
            })
        }
    }catch (error) {
        console.log("ListarGastosFacturasPorId", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ActualizarGastosFacturas = async (req, res) => {
    const { empresa, id, id_proveedor, numero_factura, total, iva, subtotal, fecha, descripcion } = req.body
    try {
        let forma_fecha = moment(fecha).format('YYYY/MM/DD')
        let mes = moment(fecha).format('MM')
        const response = await sql.query(`UPDATE gastos_registros SET id_proveedor = '${id_proveedor}', numero_factura = '${numero_factura}', total = '${total}', iva = '${iva}', subtotal = '${subtotal}', fecha = '${forma_fecha}', mes = '${mes}', descripcion = '${descripcion}' WHERE empresa = '${empresa}' AND id = ${id}`)
        if (response) {
            res.json({
                success: true,
                data: response
            })
        } else {
            res.json({
                success: false,
                data: response
            })
        }
    }catch (error) {
        console.log("ActualizarGastosFacturas", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const EliminarGastosFacturas = async (req, res) => {
    const { empresa, id } = req.query
    try {
        if(empresa == undefined || id == undefined ){
            res.json({
                success: false,
                data: "Falta un parametro"
            })
        }

        const response = await sql.query(`DELETE FROM gastos_registros WHERE empresa = '${empresa}' AND id = ${id}`)
        if (response) {
            res.json({
                success: true,
                data: response
            })
        } else {
            res.json({
                success: false,
                data: response
            })
        }
    }catch (error) {
        console.log("EliminarGastosFacturas", error)
        res.json({
            success: false,
            data: error
        })
    }
}