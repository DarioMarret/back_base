import bcrypt from 'bcrypt';
import isEmpty from "is-empty";
import { sql } from "../../database/conexion";
import { JwtSingle } from '../../function/JwtSingle';


// crear usuarios dashboard
export const CrearteUsuarioDash = async (req, res) => {
    const { nombreCompleto, email, password} = req.body
    if(isEmpty(nombreCompleto) || isEmpty(email) || isEmpty(password)){
        res.status(400).json({msg: 'Campos vacios'})
    }else{
        const query = await sql.query(`SELECT * FROM usuarios_dash WHERE email =  '${email}'`)
        if(query[0].length > 0){
            res.status(400).json({
                success: false,
                msg: 'El email ya existe'})
        }else{
            let hash_clave = await bcrypt.hash(password, 8)
            const query = await sql.query(`INSERT INTO usuarios_dash (nombreCompleto, email, password) 
            VALUES ('${nombreCompleto}', '${email}', '${hash_clave}')`)
            if(query){
                res.status(200).json({
                    success: true,
                    msg: 'Usuario creado'})
            }else{
                res.status(400).json({
                    success: false,
                    msg: 'Error al crear usuario'})
            }
        }
    }
}

// listar usuarios dashboard
export const ListarUsuariosDash = async (req, res) => {
    const query = await sql.query(`SELECT nombreCompleto, email FROM usuarios_dash`)
    if(query[0].length > 0){
        res.status(200).json({
            success: true,
            data: query[0]
        })
    }else{
        res.status(400).json({
            success: false,
            msg: 'No hay usuarios'
        })
    }
}

// actualizar usuarios dashboard
export const ActualizarUsuarioDash = async (req, res) => {
    const { id, nombreCompleto, email, password} = req.body
    if(isEmpty(nombreCompleto) || isEmpty(email)){
        res.status(400).json({msg: 'Campos vacios'})
    }else{
        const query = await sql.query(`SELECT * FROM usuarios_dash WHERE id = ${id}`)
        if(query[0].length > 0){
            if(password){
                let hash_clave = await bcrypt.hash(password, 8)
                const query = await sql.query(`UPDATE usuarios_dash SET nombreCompleto = '${nombreCompleto}', email = '${email}', password = '${hash_clave}' WHERE id = ${id}`)
                if(query){
                    res.status(200).json({
                        success: true,
                        msg: 'Usuario actualizado'})
                }else{
                    res.status(400).json({
                        success: false,
                        msg: 'Error al actualizar usuario'})
                }
            }else{
                const query = await sql.query(`UPDATE usuarios_dash SET nombreCompleto = '${nombreCompleto}', email = '${email}' WHERE id = ${id}`)
                if(query){
                    res.status(200).json({
                        success: true,
                        msg: 'Usuario actualizado'})
                }else{
                    res.status(400).json({
                        success: false,
                        msg: 'Error al actualizar usuario'})
                }
            }
        }else{
            res.status(400).json({
                success: false,
                msg: 'El usuario no existe'})
        }
    }
}

export const EliminarUsuarioDash = async (req, res) => {
    const { id } = req.body
    if(isEmpty(id)){
        res.status(400).json({
            success: false,
            msg: 'Campos vacios'})
    }else{
        const query = await sql.query(`SELECT * FROM usuarios_dash WHERE id = ${id}`)
        if(query[0].length > 0){
            const query = await sql.query(`DELETE FROM usuarios_dash WHERE id = ${id}`)
            if(query){
                res.status(200).json({
                    success: true,
                    msg: 'Usuario eliminado'})
            }else{
                res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar usuario'})
            }
        }else{
            res.status(400).json({
                success: false,
                msg: 'El usuario no existe'})
        }
    }
}

// login usuarios dashboard
export const LoginUsuarioDash = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    if(isEmpty(email) || isEmpty(password)){
        res.status(400).json({msg: 'Campos vacios'})
    }else{
        const query = await sql.query(`SELECT * FROM usuarios_dash WHERE email = '${email}'`)
        if(query[0].length > 0){
            let info = query[0][0]
            info.perfil = 'Dashboard'
            info.logo_empresa = 'https://i.ibb.co/0jZQYQg/logo.png'
            let compare = await bcrypt.compare(password, info.password)//1234567896321
            if(compare){
                delete info.password
                let token = await JwtSingle(info, process.env.SECRET)
                res.status(200).json({
                    success: true,
                    data: token,
                    msg: "Bienvenido "  + info.nombreCompleto,
                })
            }else{
                res.status(400).json({
                    success: false,
                    msg: 'Contraseña incorrecta'})
            }
        }else{
            res.status(400).json({
                success: false,
                msg: 'El usuario no existe'})
        }
    }
}