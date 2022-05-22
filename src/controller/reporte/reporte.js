import empty from "is-empty"
import db from "../../database/conexion_sequelize"
import sequelize from "sequelize"
import Reporte from "../../model/Reporte/Reporte";

export async function ListarReporte(req, res) {
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
}
export async function ListarReporteActual(req, res) {
    try {
        const { empresa, fecha } = req.query
        let estado = "CUADRE"
        let sql = `SELECT secuencia, fecha_creacion, empresa, sum(precio_venta * cantidad) AS total, estado, forma_pago FROM esq_reporte.reporte  WHERE empresa = '${empresa}' AND fecha_creacion = '${fecha}' AND estado != '${estado}' GROUP BY secuencia, empresa, fecha_creacion, estado, forma_pago`;
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
}
export async function CrearVenta(req, res) {
    const { empresa, tienda, secuencial, fecha } = req.body;
    var count = 0;
    for (var index = 0; index < tienda.length; index++) {
        Reporte.create({
            secuencia:secuencial,
            producto:tienda[index].producto,
            precio_venta:tienda[index].precio_venta,
            cantidad:tienda[index].cantidad,
            fecha_creacion:fecha,
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
        const { editar, forma_pago, estado } = req.body
        const { secuencia, empresa } = editar
        if(!empty(forma_pago) && !empty(estado)){
            const response = await Reporte.update({ estado, forma_pago }, { where: { secuencia, empresa } });
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
        }else if(!empty(estado)){
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
        }else if(!empty(forma_pago)){
            const response = await Reporte.update({ forma_pago }, { where: { secuencia, empresa } });
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
        }

    } catch (error) {
        console.log("ActualizarEstado", error)
    }
}

export async function SacarTotalesVentaFechas(req, res) {
    try {
        const { empresa, fecha_ini, fecha_fin, estado } = req.body;
        let sql = `SELECT SUM(precio_venta * cantidad) AS tota_venta FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND estado = '${estado}' AND fecha_creacion BETWEEN '${fecha_ini}' and '${fecha_fin}'`
        db.query(sql,{type: sequelize.QueryTypes.SELECT}).then((response)=>{
            console.log("SacarTotalesVentaFechas",response[0]);
            if(!empty(response)){
                res.json({
                    success: true,
                    data: response[0],
                    msg:'SacarTotalesVentaFechas',
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
}

export async function SacarTotalesVenta(empresa, fecha_ini, fecha_fin, estado) {
    try {
        return new Promise(function (resolve, reject) {
            let forma_pago = 'EFECTIVO'
            let sql = `SELECT SUM(precio_venta * cantidad) AS total_venta FROM esq_reporte.reporte WHERE empresa = '${empresa}' AND forma_pago = '${forma_pago}' AND estado = '${estado}' AND fecha_creacion BETWEEN '${fecha_ini}' AND '${fecha_fin}'`
            db.query(sql,{type: sequelize.QueryTypes.SELECT}).then((response)=>{
                if(!empty(response)){
                    console.log("SacarTotalesVentaFechas",response[0]);
                    resolve(response[0])
                }else{
                    resolve(0)
                }
            }).catch((err)=>{
                console.log("Error", err);
            })
        })
    } catch (error) {
        console.log("ListarReporte", error)
    }
}