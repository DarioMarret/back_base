import empty from 'is-empty';
import { sql } from '../../database/conexion';

export async function CrearEmpresa(req, res){
    try {
        const { ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, empresa, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad } = req.body;
        const response = await sql.query(`INSERT INTO empresa (ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, empresa, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad) VALUES 
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, empresa, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad])
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Empresa creada',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo crear la empresa',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}

export async function ListarEmpresas(req, res){
    try {
        const response = await sql.query(`SELECT * FROM empresa`)
        if(!empty(response[0])){
            res.json({
                success: true,
                empresas: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar las empresas',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}

export async function ListarEmpresa(req, res){
    try {
        const { empresa } = req.body;
        const response = await sql.query(`SELECT * FROM empresa WHERE empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                empresa: response[0][0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar la empresa',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}

export async function ActualizarEmpresa(req, res){
    try {
        const { ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, empresa, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad } = req.body;
        const response = await sql.query(`UPDATE empresa SET ruc = ?, razon_social = ?, ambiente = ?, iva_actual = ?, tarifa = ?, tipo_comprobante = ?, establecimiento = ?, punto_emision = ?, numero_secuencial = ?, tipo_emision = ?, clave_firma = ?, firma = ?, whatsapp = ?, correo = ?, logo_empresa = ?, fecha_emision = ?, fecha_vencimiento = ?, entidad_cert = ?, direccion = ?, matriz = ?, contabilidad = ? WHERE empresa = ?`,[ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad, empresa])
        if(!empty(response)){
            await ActualizarProductoIvaTaifa(iva_actual, empresa)
            res.json({
                success: true,
                msg:'Empresa actualizada',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo actualizar la empresa',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}

export async function EliminarEmpresa(req, res){
    try {
        const { empresa } = req.body;
        const response = await sql.query(`DELETE FROM empresa WHERE empresa = '${empresa}'`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Empresa eliminada',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo eliminar la empresa',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}


async function ActualizarProductoIvaTaifa(iva_actual, empresa){
    try {
        const response = await sql.query(`UPDATE producto SET porcentaje_iva = ? WHERE empresa = ?`,[parseFloat(iva_actual), empresa])
        if(!empty(response)){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}