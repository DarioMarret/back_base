import isEmpty from "is-empty"
import moment from "moment"
import { sql } from "../../database/conexion"



export const RegistrarMateria = async (req, res) => {
    const { 
        empresa, materi_prima, peso_inicial, peso_actual, 
        peso_concurrente, medida_entrada, 
        medida_salida, cantidad_alerta } = req.body
    try {
        console.log(req.body)
        if(isEmpty(empresa) || isEmpty(materi_prima) || isEmpty(peso_inicial) || isEmpty(peso_actual) || isEmpty(peso_concurrente) ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`INSERT INTO materias_prima (empresa, materi_prima, peso_inicial, peso_actual, peso_concurrente, medida_entrada, medida_salida, cantidad_alerta, fecha_registro)
            VALUES
            ('${empresa}', '${materi_prima}', ${peso_inicial}, ${peso_actual}, ${peso_concurrente}, '${medida_entrada}', '${medida_salida}', '${cantidad_alerta}', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Materia prima registrada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo registrar la materia prima"
            })
        }
        
    } catch (error) {
        console.log("RegistrarMateria", error)
        res.json({
            success: false,
            data: error
        })
    }
}

// historial de merma de materia prima
export const RegistrarMermaMateria = async (req, res) => {
    const { empresa, id_materia, peso_merma, descripcion, id_usuario } = req.body
    try {
        if(isEmpty(empresa) || isEmpty(id_materia) || isEmpty(peso_merma) || isEmpty(descripcion) ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`INSERT INTO merma_materia (empresa, id_materia, peso_merma, descripcion, id_usuario, fecha_registro)
            VALUES
            ('${empresa}', ${id_materia}, ${peso_merma}, '${descripcion}', ${id_usuario}, '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
        if (response[0].affectedRows > 0) {       
            await sql.query(`UPDATE materias_prima SET peso_concurrente = peso_concurrente + ${peso_merma} WHERE id = ${id_materia} AND empresa = '${empresa}'`)
            res.json({
                success: true,
                msg: "Merma registrada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo registrar la merma"
            })
        }
        
    } catch (error) {
        console.log("RegistrarMermaMateria", error)
        res.json({
            success: false,
            data: error
        })
    }
}
// listar toda la merma de materia prima por id uniendo tablas de usuarios y materias primas
export const ListarMermaMateria = async (req, res) => {
    const { empresa, id } = req.query
    console.log(req.query)
    try {
        if( !empresa || !id ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT mm.*, u.nombreCompleto, mp.materi_prima
        FROM merma_materia mm 
        INNER JOIN usuarios_caja u ON mm.id_usuario = u.id
        INNER JOIN materias_prima mp ON mm.id_materia = mp.id WHERE mm.empresa = '${empresa}' AND mm.id_materia = ${id} ORDER BY mm.id DESC`)
        if (response[0].length > 0) {
            res.json({
                success: true,
                data: response[0]
            })
        } else {
            res.json({
                success: false,
                data: []
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }
}


export const ListarMaterias = async (req, res) => {
    const { empresa } = req.query
    try {
        if( !empresa ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT * FROM materias_prima WHERE empresa = '${empresa}'`)
        if (response[0].length > 0) {
            res.json({
                success: true,
                data: response[0]
            })
        } else {
            res.json({
                success: false,
                data: []
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarMateriasPorId = async (req, res) => {
    const { empresa, id } = req.query
    try {
        if( !empresa || !id ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT * FROM materias_prima WHERE empresa = '${empresa}' AND id = ${id}`)
        if (response[0].length > 0) {
            res.json({
                success: true,
                data: response[0][0]
            })
        } else {
            res.json({
                success: false,
                data: []
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: error
        })
    }
}

export const ActualizarMateria = async (req, res) => {
    const { id, empresa, materi_prima, peso_inicial, peso_actual, peso_concurrente, medida_entrada, medida_salida,
        nuevo_ingreso,
        cantidad_alerta } = req.body
        console.log(req.body)
    try {

        if(!isEmpty(nuevo_ingreso)){
            await sql.query(`UPDATE materias_prima SET peso_actual = peso_actual + ${nuevo_ingreso} WHERE id = ${id} AND empresa = '${empresa}'`)
        }

        if( !empresa || !materi_prima || !peso_inicial || !peso_actual || !peso_concurrente ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`UPDATE materias_prima SET materi_prima = '${materi_prima}', peso_inicial = ${peso_inicial}, peso_actual = ${peso_actual}, peso_concurrente = ${peso_concurrente}, medida_entrada = '${medida_entrada}', medida_salida = '${medida_salida}', cantidad_alerta = '${cantidad_alerta}' WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Materia prima actualizada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo actualizar la materia prima"
            })
        }
        
    } catch (error) {
        console.log("ActualizarMateria", error)
        res.json({
            success: false,
            data: error
        })
    }
}

export async function EliminarMateriaPorId(req, res){
    try {
        const { id, empresa } = req.query;
        if( !id || !empresa ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`DELETE FROM materias_prima WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Materia prima eliminada"
            })
        }else{
            res.json({
                success: false,
                msg: "No se pudo eliminar la materia prima"
            })
        }
    } catch (error) {
        console.log("EliminarMateriaPorId", error);
        res.json({
            success: false,
            data: error
        })
    }
}