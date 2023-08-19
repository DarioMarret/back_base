


export const ListarCategorias = async (req, res) => {
    const { empresa } = req.params
    try {
        const response = await sql.query(`SELECT * FROM categoria WHERE empresa = '${empresa}'`)
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
    }
}

export const CrearCategoria = async (req, res) => {
    const { empresa, categoria } = req.body
    try {
        const response = await sql.query(`INSERT INTO categoria (empresa, categoria) VALUES ('${empresa}', '${categoria}')`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Categoria creada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo crear la categoria"
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const EditarCategoria = async (req, res) => {
    const { id, empresa, categoria } = req.body
    try {
        const response = await sql.query(`UPDATE categoria SET categoria = '${categoria}' WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Categoria actualizada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo actualizar la categoria"
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const EliminarCategoria = async (req, res) => {
    const { id, empresa } = req.query
    try {
        const response = await sql.query(`DELETE FROM categoria WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Categoria eliminada"
            })
        } else {
            res.json({
                success: false,
                msg: "No se pudo eliminar la categoria"
            })
        }
    } catch (error) {
        console.log(error)
    }
}