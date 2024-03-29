import bcrypt from 'bcrypt';
import { default as empty, default as isEmpty } from 'is-empty';
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
                response.password = undefined
                let info = {
                    ...datos_empresa,
                    ...response,
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
        const { email, nombreCompleto, password, empresa, whatsapp, perfil, sueldo, asegurado  } = req.body;
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
            if(perfil === 'Administrador'){
                // sacar la password de usuario_caja y crearlo en la tabla de usuarios_admin
                await CrearUsuarioComoAdmin(email, nombreCompleto, hash_clave, whatsapp, JSON.stringify([empresa]))
            }
            const response = await sql.query(`INSERT INTO usuarios_caja (email, nombreCompleto, password, empresa, whatsapp, perfil, fechaCreacion, sueldo, asegurado) 
                VALUES 
            ('${email}', '${nombreCompleto}', '${hash_clave}', '${empres}', '${whatsapp}', '${perfil}', '${fechaCreacion}', ${sueldo}, ${asegurado})`)
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
        const { id, email, nombreCompleto, password, empresa, perfil, whatsapp, sueldo, asegurado } = req.body;
        console.log(req.body)
        if(perfil === 'Administrador'){
            // sacar la password de usuario_caja y crearlo en la tabla de usuarios_admin
            let clave = await sql.query(`SELECT password FROM usuarios_caja WHERE id = ${id}`)
            let contra = clave[0][0].password
            await CrearUsuarioComoAdmin(email, nombreCompleto, contra, whatsapp, JSON.stringify([empresa]))
        }
        if(!empty(password)){
            let hash_clave = await bcrypt.hash(password, 8);
            let fechaCreacion = moment().format('YYYY-MM-DD HH:mm:ss');
            let empres = empresa.toLowerCase().replace(/ /g, '')
            const response = await sql.query(`UPDATE usuarios_caja SET email = '${email}', nombreCompleto = '${nombreCompleto}',
            perfil = '${perfil}',
            password = '${hash_clave}', empresa = '${empres}', whatsapp = '${whatsapp}', fechaCreacion = '${fechaCreacion}',  sueldo = ${sueldo}, asegurado = ${asegurado}  WHERE id = ${id}`)
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
            const response = await sql.query(`UPDATE usuarios_caja SET email = '${email}', nombreCompleto = '${nombreCompleto}', 
            perfil = '${perfil}',
            empresa = '${empres}', whatsapp = '${whatsapp}', fechaCreacion = '${fechaCreacion}',  sueldo = ${sueldo}, asegurado = ${asegurado}  WHERE id = ${id}`)
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

async function CrearUsuarioComoAdmin(email, nombreCompleto, password, whatsapp, empresa){
    try {
        let validar_existe = await sql.query(`SELECT * FROM usuarios_admin WHERE email = '${email}'`)
        if (!empty(validar_existe[0])) {
            return validar_existe[0][0]
        }else{
            await sql.query(`INSERT INTO usuarios_admin (email, nombreCompleto, password, whatsapp, empresa_array) 
                VALUES 
            ('${email}', '${nombreCompleto}', '${password}', '${whatsapp}', '${empresa}')`)
        }
    }catch (error) {
        console.log(error)
    }
}

// registro de prestamos y abonos de los usuarios
export async function RegistrarPrestamo(req, res){
    try {
        const { id, empresa, prestamo, fecha, nota } = req.body;
        const response = await sql.query(`INSERT INTO prestamos (id_usuario, empresa, prestamo, fecha, nota, estado) 
            VALUES 
        ('${id}', '${empresa}', '${prestamo}', '${fecha}', '${nota}', 'pendiente')`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Prestamo registrado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo registrar el prestamo',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al registrar el prestamo",
        })
    }
}

export async function RegistrarAbono(req, res){
    try {
        const { id, empresa, abono, fecha, nota } = req.body;
        const response = await sql.query(`INSERT INTO abonos (id_usuario, empresa, abono, fecha, nota, estado) 
            VALUES 
        ('${id}', '${empresa}', '${abono}', '${fecha}', '${nota}', 'pendiente')`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Abono registrado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo registrar el abono',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al registrar el abono",
        })
    }
}


export async function ListarPrestamos(req, res){
    try {
        const { empresa } = req.body;
        const response = await sql.query(`SELECT * FROM prestamos WHERE empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar los prestamos',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar los prestamos",
        })
    }
}

export async function ListarAbonos(req, res){
    try {
        const { empresa } = req.body;
        const response = await sql.query(`SELECT * FROM abonos WHERE empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar los abonos',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar los abonos",
        })
    }
}


// acualizar prestamos y abonos el estado de pendiente a pagado si prestado se puede actualizar el prestamo
export async function ActualizarPrestamo(req, res){
    try {
        const { id, estado, prestamo } = req.body;
        const response = await sql.query(`UPDATE prestamos SET estado = '${estado}', prestamo = '${prestamo}' WHERE id = ${id}`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Prestamo actualizado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo actualizar el prestamo',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al actualizar el prestamo",
        })
    }
}

export async function ActualizarAbono(req, res){
    try {
        const { id, estado } = req.body;
        const response = await sql.query(`UPDATE abonos SET estado = '${estado}' WHERE id = ${id}`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Abono actualizado',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo actualizar el abono',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al actualizar el abono",
        })
    }
}


//listar prestamos y abonos por usuario y empresa inner join con la tabla usuarios_caja para obtener el nombre del usuario 
export async function ListarPrestamosUsuario(req, res){
    try {
        const { id, empresa } = req.body;
        const response = await sql.query(`SELECT prestamos.id, prestamos.id_usuario, prestamos.prestamo, prestamos.fecha, prestamos.nota, prestamos.estado, usuarios_caja.nombreCompleto FROM prestamos INNER JOIN usuarios_caja ON prestamos.id_usuario = usuarios_caja.id WHERE prestamos.id_usuario = ${id} AND prestamos.empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar los prestamos',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar los prestamos",
        })
    }
}

export async function ListarAbonosUsuario(req, res){
    try {
        const { id, empresa } = req.body;
        const response = await sql.query(`SELECT abonos.id, abonos.id_usuario, abonos.abono, abonos.fecha, abonos.nota, abonos.estado, usuarios_caja.nombreCompleto FROM abonos INNER JOIN usuarios_caja ON abonos.id_usuario = usuarios_caja.id WHERE abonos.id_usuario = ${id} AND abonos.empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar los abonos',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar los abonos",
        })
    }
}

//tomar de asistencia a los usuarios
export async function RegistrarAsistencia(req, res){
    try {
        const { id, empresa } = req.body;
        const response = await sql.query(`INSERT INTO asistencias (id_usuario, empresa, mes, dia, fecha, hora_ingreso, hora_salida)
            VALUES
        ('${id}', '${empresa}', '${moment().format('MM')}', '${moment().format('DD')}', '${moment().format('YYYY-MM-DD')}', '${moment().format('HH:mm:ss')}', '00:00:00')`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Asistencia registrada',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo registrar la asistencia',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al registrar la asistencia",
        })
    }
}

export async function ListarAsistencia(req, res){
    try {
        const { empresa } = req.body;
        const response = await sql.query(`SELECT * FROM asistencias WHERE empresa = '${empresa}'`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar la asistencia',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar la asistencia",
        })
    }
}

export async function ListarAsistenciaUsuario(req, res){
    try {
        const { id, empresa, mes } = req.body;
        const response = await sql.query(`SELECT * FROM asistencias WHERE id_usuario = ${id} AND empresa = '${empresa}' AND MONTH(fecha) = ${mes}`)
        if(!empty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo listar la asistencia',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al listar la asistencia",
        })
    }
}

export async function ActualizarAsistencia(req, res){
    try {
        const { id } = req.body;
        const response = await sql.query(`UPDATE asistencias SET hora_salida = '${moment().format('HH:mm:ss')}' WHERE id = ${id}`)
        if(!empty(response)){
            res.json({
                success: true,
                msg:'Asistencia actualizada',
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo actualizar la asistencia',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            msg: "Error al actualizar la asistencia",
        })
    }
}

// registrar anticipos de los usuarios
export const RegistrarAnticipos = async (req, res) => {
    const { empresa, id_usuario, monto, usuario } = req.body
    try {
        if(isEmpty(empresa) || isEmpty(id_usuario) || isEmpty(monto)){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`INSERT INTO anticipos (empresa, id_usuario, monto, mes, dia, estado, fecha_registro)
            VALUES
            ('${empresa}', ${id_usuario}, ${monto}, '${moment().format('MM')}', '${moment().format('DD')}', 'pendiente', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
        if (response[0].affectedRows > 0) {
            // registrar tambien en la tabla de movimientos
            let nombreCompleto = await sql.query(`SELECT nombreCompleto FROM usuarios_caja WHERE id = ${id_usuario}`)
            let detalle = `Anticipo: ${nombreCompleto[0][0].nombreCompleto}`
            let fechaCreacion = moment().format('DD/MM/YYYY')
            let estado = "ACTIVO"
            let fecha = moment().format('YYYY/MM/DD HH:mm:ss')
            let query = `INSERT INTO movimiento (detalle, usuario, empresa, ingreso, salida, fecha, estado, fechaCreacion) 
                VALUES
            ('${detalle}', '${usuario}', '${empresa}', ${0.00}, ${monto}, '${fecha}', '${estado}', '${fechaCreacion}')`
            await sql.query(query)
            res.json({
                success: true,
                msg: "Anticipo registrado"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo registrar el anticipo"
            })
        }
        
    } catch (error) {
        console.log("RegistrarAnticipos", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarAnticipos = async (req, res) => {
    // listar todos anticipos por empresa y por mes unir con la tabla usuarios_caja para obtener el nombre del usuario
    const { empresa, mes } = req.query
    try {
        if( !empresa || !mes ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT anticipos.id, anticipos.id_usuario, anticipos.monto, anticipos.mes, anticipos.dia, anticipos.estado, usuarios_caja.nombreCompleto FROM anticipos INNER JOIN usuarios_caja ON anticipos.id_usuario = usuarios_caja.id WHERE anticipos.empresa = '${empresa}' AND anticipos.mes = ${mes}`)
        if (response[0].length > 0) {
            res.json({
                success: true,
                data: response[0]
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo listar los anticipos"
            })
        }
        
    } catch (error) {
        console.log("ListarAnticipos", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const EliminarAnticipos = async (req, res) => {
    const { id } = req.body
    try {
        if( !id ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`DELETE FROM anticipos WHERE id = ${id}`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Anticipo eliminado"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo eliminar el anticipo"
            })
        }
        
    } catch (error) {
        console.log("EliminarAnticipos", error)
        res.json({
            success: false,
            data: error
        })
    }
}