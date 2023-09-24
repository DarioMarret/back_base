import bcrypt from 'bcrypt';
import empty from 'is-empty';
import moment from 'moment';
import { sql } from '../database/conexion';

export async function Login(req, res) {
    try {
        const { email, password } = req.body;
        const response = await ValivarExisteEmail(email)
        if (response) {
            const x = await bcrypt.compare(password, response.password)
            if (x) {
                const datos_empresa = await ExtraerDatosEmpresa(response.empresa)
                let info = {
                    ...datos_empresa,
                    ...response,
                    perfil:"caja"
                }
                await FechaLogin(response.id)
                res.json({
                    data: info,
                    success: true,
                    msg: 'Bienvenido ' + response.nombreCompleto
                })
            } else {
                res.status(200).json({
                    success: false,
                    msg: "Contraceña incorrecta"
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

export async function CrearUsuario(req, res){
    try {
        const { email, nombreCompleto, password, empresa, whatsapp  } = req.body;
        const existe = await ValivarExisteEmail(email)
        if (existe){
            res.json({
                success: false,
                msg: "El usuario ya existe dentro de la empresa "+ empresa
            })
        }else{
            let hash_clave = await bcrypt.hash(password, 8);
            let fechaCreacion = moment().format('YYYY-MM-DD HH:mm:ss');
            let empres = empresa.toLowerCase().replace(/ /g, '')
            const response = await sql.query(`INSERT INTO usuarios_caja (email, nombreCompleto, password, empresa, whatsapp, fechaCreacion) VALUES ('${email}', '${nombreCompleto}', '${hash_clave}', '${empres}', '${whatsapp}', '${fechaCreacion}')`)
            if(!empty(response)){
                res.json({
                    success: true,
                    msg:'Nuevo Usuario registrado en la empresa: '+ empresa,
                })
            }else{
                res.json({
                    success: false,
                    msg:'No se pudo registrar el usuario en la empresa: '+ empresa,
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}

export async function ListarUsuarios(req, res){
    const { empresa } = req.body
    try {
        var user = []
        for (let index = 0; index < empresa.length; index++) {
            const element = empresa[index];
            const response = await sql.query(`SELECT * FROM usuarios_caja WHERE empresa = '${element}'`)
            response[0].map((item)=>{
                user.push(item)
            })
        }

        if(!empty(user)){
            res.json({
                success: true,
                data: user,
            })
        }else{
            res.json({
                success: false,
                data: user,
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

export const ActualizarUsuario = async (req, res) => {
    try {
        const { id, email, nombreCompleto, password, empresa, whatsapp } = req.body;
        console.log(req.body)
        if(!empty(password)){
            let hash_clave = await bcrypt.hash(password, 8);
            let fechaCreacion = moment().format('YYYY-MM-DD HH:mm:ss');
            let empres = empresa.toLowerCase().replace(/ /g, '')
            const response = await sql.query(`UPDATE usuarios_caja SET email = '${email}', nombreCompleto = '${nombreCompleto}', password = '${hash_clave}', empresa = '${empres}', whatsapp = '${whatsapp}', fechaCreacion = '${fechaCreacion}' WHERE id = ${id}`)
            if(!empty(response)){
                res.json({
                    success: true,
                    msg:'Usuario actualizado en la empresa: '+ empresa,
                })
            }else{
                res.json({
                    success: false,
                    msg:'No se pudo actualizar el usuario en la empresa: '+ empresa,
                })
            }
        }else{
            let fechaCreacion = moment().format('YYYY-MM-DD HH:mm:ss');
            let empres = empresa.toLowerCase().replace(/ /g, '')
            const response = await sql.query(`UPDATE usuarios_caja SET email = '${email}', nombreCompleto = '${nombreCompleto}', empresa = '${empres}', fechaCreacion = '${fechaCreacion}' WHERE id = ${id}`)
            if(!empty(response)){
                res.json({
                    success: true,
                    msg:'Usuario actualizado en la empresa: '+ empresa,
                })
            }else{
                res.json({
                    success: false,
                    msg:'No se pudo actualizar el usuario en la empresa: '+ empresa,
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "algo salio mal vuelve a intentar",
        })
    }
}


export const EliminarUsuario = async (req, res) => {
    try {
        const { id } = req.body;
        const response = await sql.query(`DELETE FROM usuarios_caja WHERE id = ${id}`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Usuario eliminado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo eliminar el usuario',
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

async function ValivarExisteEmail(email){
    try {
        const response = await sql.query(`SELECT * FROM usuarios_caja WHERE email = '${email}'`)
        if (!empty(response[0])) {
            return response[0][0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

async function ExtraerDatosEmpresa(empresa){
    try {
        const response = await sql.query(`SELECT whatsapp, logo_empresa FROM empresa WHERE empresa = '${empresa}'`)
        if (!empty(response[0])) {
            return response[0][0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

async function FechaLogin(id){
    try {
        let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        const response = await sql.query(`UPDATE usuarios_caja SET fechaLogin = '${fecha}' WHERE id = ${id}`)
        if (!empty(response)) {
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

async function FechaDesLogin(id){
    try {
        let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        const response = await sql.query(`UPDATE usuarios_caja SET fechaDesLogin = '${fecha}' WHERE id = ${id}`)
        if (!empty(response)) {
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}