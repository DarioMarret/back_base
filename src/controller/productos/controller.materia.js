import { sql } from "../../database/conexion"



export const RegistrarMateria = async (req, res) => {
    const { empresa, materi_prima, peso_inicial, peso_actual, peso_concurrente, medida_entrada, medida_salida, cantidad_alerta } = req.body
    try {
        if( !empresa || !materi_prima || !peso_inicial || !peso_actual || !peso_concurrente ){
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
    const { id, empresa, materi_prima, peso_inicial, peso_actual, peso_concurrente, medida_entrada, medida_salida, cantidad_alerta } = req.body
    try {
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