import bcrypt from 'bcrypt';
import empty from 'is-empty';
import { sql } from '../../database/conexion';

export async function ValidarLogin(req, res) {
    try {
        const { email, password } = req.body;
        const response = await ValivarExisteEmail(email)
        if (response) {
            console.log("response--->",response)
            const x = await bcrypt.compare(password, response.password)
            console.log("x--->",x)
            if (x) {
                const datos_empresa = await ExtraerDatosEmpresa(response.empresa_array)
                console.log("datos_empresa--->",datos_empresa)
                let info = {
                    ...datos_empresa,
                    ...response,
                    empresa: JSON.parse(response.empresa_array),
                    perfil:"Administrador",
                    logos: datos_empresa
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
        const { email, nombreCompleto, password, whatsapp, empresa_array } = req.body;
        const existe = await ValivarExisteEmail(email)
        if (existe){
            res.json({
                success: false,
                msg: "El administrador ya existe dentro de las empresa "+ empresa_array
            })
        }else{
            let hash_clave = await bcrypt.hash(password, 8);
            const response = await sql.query(`INSERT INTO usuarios_admin 
            (email, nombreCompleto, whatsapp, password, empresa_array) VALUES 
            ('${email}', '${nombreCompleto}', '${whatsapp}', '${hash_clave}', '${JSON.stringify(empresa_array)}')`)
            if(!empty(response)){
                res.json({
                    success: true,
                    msg:'Nuevo Usuario registrado en la empresa: '+ empresa_array,
                })
            }else{
                res.json({
                    success: false,
                    msg:'No se pudo registrar el usuario en la empresa: '+ empresa_array,
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
        const response = await sql.query(`SELECT * FROM usuarios_admin WHERE email = '${email}'`)
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
        let empresa_array = JSON.parse(empresa)
        var datos_empresa = []
        for (let index = 0; index < empresa_array.length; index++) {
            const items = empresa_array[index];
            const response = await sql.query(`SELECT whatsapp, logo_empresa FROM empresa WHERE empresa = '${items}'`)
            if (!empty(response[0])) {
                let info = {
                    empresa: items,
                    whatsapp: response[0][0].whatsapp,
                    logo_empresa: response[0][0].logo_empresa
                }
                datos_empresa.push(info)
            }
        }
        return datos_empresa
    } catch (error) {
        console.log(error)
        return false
    }
}

