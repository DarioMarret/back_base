import bcrypt from 'bcrypt';
import empty from 'is-empty';
import moment from 'moment';
import { sql } from '../../database/conexion';

export async function CrearEmpresa(req, res){
    try {
        const { ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, empresa, whatsapp, correo, logo_empresa, direccion, matriz, contabilidad, factura } = req.body;
        // numero de secuencia es de 9 digitos y se debe completar con ceros a la izquierda
        // 000000001
        // 000000002
        let numero_secuencial_completo = numero_secuencial.toString()
        while (numero_secuencial_completo.length < 9) {
            numero_secuencial_completo = "0" + numero_secuencial_completo;
        }
        const response = await sql.query(`INSERT INTO empresa 
        (ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, empresa, whatsapp, correo, logo_empresa,  direccion, matriz, contabilidad, factura) 
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial_completo, empresa, whatsapp, correo, logo_empresa, direccion, matriz, contabilidad, factura])
        if(!empty(response)){
            
            console.log("ruc",ruc)
            console.log("razon_social",razon_social)
            console.log("whatsapp",whatsapp)
            console.log("empresa",empresa)

            let hash_clave = await bcrypt.hash(ruc, 8);
            let resss = await CrearUsuarioComoAdmin(correo, razon_social, hash_clave, whatsapp, JSON.stringify([empresa]))
            if(resss){
                return res.json({
                    success: false,
                    msg:"se creo la empresa pero no se pudo crear el usuario administrador"
                })
            }
            return res.json({
                success: true,
                msg:'Empresa creada la contraseña es el RUC de la empresa',
            })
        }else{
            return res.json({
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

async function CrearUsuarioComoAdmin(email, nombreCompleto, password, whatsapp, empresa){
    try {
        let validar_existe = await sql.query(`SELECT * FROM usuarios_admin WHERE email = '${email}'`)
        if (!empty(validar_existe[0])) {
            return true
        }else{
            await sql.query(`INSERT INTO usuarios_admin (email, nombreCompleto, password, whatsapp, empresa_array) 
                VALUES 
            ('${email}', '${nombreCompleto}', '${password}', '${whatsapp}', '${empresa}')`)
            return false
        }
    }catch (error) {
        console.log(error)
        return false
    }
}

// export const RegistrarEmpresaInicial = async (req, res) => {
    
// }


export async function ListarEmpresas(req, res){
    try {
        const response = await sql.query(`SELECT * FROM empresa`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
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
        const { ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, empresa, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad, factura } = req.body;
        const response = await sql.query(`UPDATE empresa SET ruc = ?, razon_social = ?, ambiente = ?, iva_actual = ?, tarifa = ?, tipo_comprobante = ?, establecimiento = ?, punto_emision = ?, numero_secuencial = ?, tipo_emision = ?, clave_firma = ?, firma = ?, whatsapp = ?, correo = ?, logo_empresa = ?, fecha_emision = ?, fecha_vencimiento = ?, entidad_cert = ?, direccion = ?, matriz = ?, contabilidad = ?, factura = ? WHERE empresa = ?`,[ruc, razon_social, ambiente, iva_actual, tarifa, tipo_comprobante, establecimiento, punto_emision, numero_secuencial, tipo_emision, clave_firma, firma, whatsapp, correo, logo_empresa, fecha_emision, fecha_vencimiento, entidad_cert, direccion, matriz, contabilidad, factura, empresa])
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
            // eliminar usuario admin y todos los usuarios de la empresa
            await sql.query(`DELETE FROM usuarios_admin WHERE empresa_array LIKE '%${empresa}%'`)
            await sql.query(`DELETE FROM usuarios_caja WHERE empresa = '${empresa}'`)
            // eliminar todo los productos de la empresa catalogo materias primas
            await sql.query(`DELETE FROM producto WHERE empresa = '${empresa}'`)
            // eliminar todo los productos de la empresa catalogo productos terminados
            await sql.query(`DELETE FROM materias_prima WHERE empresa = '${empresa}'`)
            // eliminar todo los productos de la empresa catalogo productos terminados
            await sql.query(`DELETE FROM merma_materia WHERE empresa = '${empresa}'`)
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


// registrar vendedores
export async function RegistrarVendedor(req, res){
    try {
        const { nombreCompleto, email, password, ciudad, comision  } = req.body;
        console.log(req.body)
        let hash_clave = await bcrypt.hash(password, 8);
        const response = await sql.query(`INSERT INTO vendedores
        (nombreCompleto, email, password, ciudad, comision, fecha_creacion) VALUES 
        ('${nombreCompleto}', '${email}', '${hash_clave}', '${ciudad}', '${comision}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Nuevo Vendedor registrado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo registrar el vendedor',
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

// listar vendedores
export async function ListarVendedores(req, res){
    try {
        const response = await sql.query(`SELECT * FROM vendedores`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar los vendedores',
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

export async function ActualizarVendedor(req, res){
    const { id, nombreCompleto, email, password, ciudad, comision, estado } = req.body
    if(empty(password)){
        const query = await sql.query(`UPDATE vendedores SET nombreCompleto = '${nombreCompleto}', email = '${email}', ciudad = '${ciudad}', comision = '${comision}', estado = '${estado}' WHERE id = ${id}`)
        if(query){
            res.status(200).json({
                success: true,
                msg: 'Vendedor actualizado'})
        }else{
            res.status(400).json({
                success: false,
                msg: 'Error al actualizar vendedor'})
        }
    }else{
        let hash_clave = await bcrypt.hash(password, 8)
        const query = await sql.query(`UPDATE vendedores SET nombreCompleto = '${nombreCompleto}', email = '${email}', password = '${hash_clave}', ciudad = '${ciudad}', comision = '${comision}', estado = '${estado}' WHERE id = ${id}`)
        if(query){
            res.status(200).json({
                success: true,
                msg: 'Vendedor actualizado'})
        }else{
            res.status(400).json({
                success: false,
                msg: 'Error al actualizar vendedor'})
        }
    }
}

// login vendedor
export const LoginVendedor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await sql.query(`SELECT * FROM vendedores WHERE email = '${email}'`)
        if (!empty(response[0])) {
            const clave_valida = await bcrypt.compare(password, response[0][0].password);
            if (clave_valida) {
                res.status(200).json({
                    success: true,
                    data: response[0][0]
                })
            } else {
                res.status(200).json({
                    success: false,
                    msg: "contraseña incorrecta"
                })
            }
        } else {
            res.status(200).json({
                success: false,
                msg: "email incorrecta"
            })
        }
    } catch (error) {
        res.status(200).json({
            success: false,
            msg: "Error al iniciar sesion"
        })
    }
}