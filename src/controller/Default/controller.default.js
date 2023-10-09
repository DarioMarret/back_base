import isEmpty from "is-empty";
import { sql } from "../../database/conexion";


export const ListarPerfil = async (req, res) => {
    try {
        const response = await sql.query(`SELECT * FROM perfil`)
        if(!isEmpty(response[0])){
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                msg:'No se pudo obtener el perfil',
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

export const ListarMedidas = async (req, res) => {
    try {
        const response = await sql.query(`SELECT * FROM medidas`)
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
        console.log("ListarMedidas", error)
        res.json({
            success: false,
            data: error
        })
    }
}