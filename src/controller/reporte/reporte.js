import empty from "is-empty"
import db from "../../database/conexion_sequelize"
import sequelize from "sequelize"
import Reporte from "../../model/Reporte/Reporte";

export async function ListarReporte(req, res) {
    // jwt.verify(req.token, config.token, async (error, authData)=>{
    //     if(!error){
    try {
        const { empresa, fecha_ini, fecha_fin } = req.body;
        let sql = `SELECT * FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}' ORDER BY fecha_creacion`
        db.query(sql,{type: sequelize.QueryTypes.SELECT}).then((response)=>{
            console.log("reporte",response);
            if(!empty(response)){
                res.json({
                    success: true,
                    data: response,
                    msg:'reporte por fecha',
                })
            }else{
                res.json({msg: "no se encontro reporte"})
            }
        }).catch((err)=>{
            console.log("Error", err);
        })
    } catch (error) {
        console.log("ListarReporte", error)
    }
    //     }else{
    //         res.json(errorToken)
    //     } 
    // })
}

export async function CrearVenta(req, res) {
    const { empresa, tienda } = req.body;
    var count = 0;
    for (var index = 0; index < tienda.length; index++) {
        Reporte.create({
            secuencia:tienda[index].secuencia,
            producto:tienda[index].producto,
            precio_venta:tienda[index].cantidad,
            cantidad:tienda[index].cantidad,
            fecha_creacion:tienda[index].fecha_creacion,
            empresa,
        }) .then((response) => {
            count += 1
        }).catch((err) => {
            console.log(err);
        });
    }
    if(index === tienda.length){
        res.json({
            success:true,
            msg:'Se registro correctamente la Factura',
            items: "item registrado "+count
        })
    }else{
        console.log("error")
    }
}

export async function ActualizarEstado(req, res) {
    try {
        const { estado, secuencia, empresa } = req.body
        const response = await Reporte.update({ estado }, { where: { secuencia, empresa } });
        console.log(response)
        if (!empty(response[0])) {
            res.json({
                success: true,
                data: response[0],
                msg: 'reporte Actualizado'
            })
        }else{
            res.json({success: false, msg:"no se pudo actualizar"})
        }
    } catch (error) {
        console.log("ActualizarEstado", error)
    }
}

