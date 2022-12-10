import empty from 'is-empty';
import { sql } from '../database/conexion'
import bcrypt from 'bcrypt'
import moment from 'moment'

export async function Login(req, res) {
    try {
        const { email, password } = req.body;
        const response = await ValivarExisteEmail(email)
        if (!empty(response)) {
            const x = await bcrypt.compare(password, response.password)
            console.log("compare password",x)
            if (x) {
                const datos_empresa = await ExtraerDatosEmpresa(response.empresa)
                let info = {
                    ...datos_empresa,
                    ...response,
                    perfil:"caja"
                }
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
                msg: "usuario incorrecta"
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
        const { email, nombreCompleto, password, empresa } = req.body;
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
            const response = await sql.query(`INSERT INTO usuarios_caja (email, nombreCompleto, password, empresa, fechaCreacion) VALUES ('${email}', '${nombreCompleto}', '${hash_clave}', '${empres}', '${fechaCreacion}')`)
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


async function ValivarExisteEmail(email){
    try {
        const response = await sql.query(`SELECT * FROM usuarios_caja WHERE email = '${email}'`)
        if (!empty(response[0])) {
            return response[0][0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
}

