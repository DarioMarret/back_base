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