

export const CreateReceta = async (req, res) => {
    const { empresa, id_producto, id_materia, cantidad } = req.body
    try {
        if( !empresa || !id_producto || !id_materia || !cantidad ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`INSERT INTO recetas (empresa, id_producto, id_materia, cantidad) VALUES ('${empresa}', ${id_producto}, ${id_materia}, ${cantidad})`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Receta registrada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo registrar la receta"
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

export const ListarRecetas = async (req, res) => {
    const { empresa } = req.query
    try {
        if( !empresa ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT * FROM recetas WHERE empresa = '${empresa}'`)
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

export const ListarRecetasPorId = async (req, res) => {
    const { empresa, id } = req.query
    try {
        if( !empresa || !id ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT * FROM recetas WHERE empresa = '${empresa}' AND id = ${id}`)
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

export const EliminarRecetaPorId = async (req, res) => {
    try {
        const { id, empresa } = req.query;
        const response = await sql.query(`DELETE FROM recetas WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Receta eliminada"
            })
        }else{
            res.json({
                success: false,
                msg: "No se pudo eliminar la receta"
            })
        }
    } catch (error) {
        console.log("EliminarRecetaPorId", error);
        res.json({
            success: false,
            data: error
        })
    }
}

export const ListarRecetasPorProducto = async (req, res) => {
    const { empresa, id_producto } = req.query
    try {
        if( !empresa || !id_producto ){
            return res.json({
                success: false,
                msg: "Todos los campos son obligatorios"
            })
        }
        const response = await sql.query(`SELECT * FROM recetas WHERE empresa = '${empresa}' AND id_producto = ${id_producto}`)
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

