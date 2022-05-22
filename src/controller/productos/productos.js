import empty from "is-empty"
import XLSX from "xlsx"
import Productos from "../../model/Productos/Productos"
import path from "path"
import fs from "fs"
import db from "../../database/conexion_sequelize"
import sequelize from "sequelize"

export async function ListarProducto(req, res) {
    // jwt.verify(req.token, config.token, async (error, authData)=>{
    //     if(!error){
    try {
        const { empresa } = req.query;
        const response = await Productos.findAll({ where: { empresa } })
        if (!empty(response)) {
            res.json({
                success: true,
                data: response,
            })
        } else {
            res.json({
                success: false,
                data: response,
            })
        }
    } catch (error) {
        console.log("ListarProducto", error)
    }
    //     }else{
    //         res.json(errorToken)
    //     } 
    // })
}
export async function CrearProductounitario(req, res) {
    try {
        const {id_categoria, producto, precio_venta, porcentaje_iva, empresa  } = req.body
        var ress = await VerificarProductoExistente(empresa, producto.toLowerCase())
        if (!ress) {
            Productos.create({
                id_categoria,
                producto: producto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,""),
                precio_venta: Math.round(((precio_venta) + Number.EPSILON) * 100) / 100,
                porcentaje_iva: porcentaje_iva,
                empresa
            }).then((response) => {
                console.log(response);
                res.json({success: true, data: response})
            }).catch((err) => {
                console.log("error", err)
            });
        }else{
            res.json({success: false, msg: "producto ya exite es su lista"})
        }
    } catch (error) {
        console.log(error)
    }
} 
export async function CargarProductosDesdeExcel(req, res) {
    const { empresa } = req.body
    let ruta_archivo = path.join(__dirname, '../../archivos_temporal/')
    let EDFile = req.files.archivo
    EDFile.mv(`${ruta_archivo}${EDFile.name}`, async function (err) {
        if (err) return res.status(500).send({ message: err })
        await LeerExcel(`./src/archivos_temporal/${EDFile.name}`, res, empresa);
        // return res.status(200).send({ message : 'File upload' })
    })
}
async function LeerExcel(ruta, res, empresa) {
    const workbook = XLSX.readFile(ruta);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    //Math.round(((tienda.total_iva - precio_cantidad) + Number.EPSILON) * 100)/100
    var count = 0
    for (let index = 0; index < dataExcel.length; index++) {
        let producto = dataExcel[index].producto
        let precio = Math.round(((dataExcel[index].precio_venta) + Number.EPSILON) * 100) / 100
        var ress = await VerificarProductoExistente(empresa, producto.toLowerCase(), precio)
        console.log(ress)
        if (!ress) {
            Productos.create({
                id_categoria: dataExcel[index].id_categoria,
                producto: dataExcel[index].producto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,""),
                precio_venta: Math.round(((dataExcel[index].precio_venta) + Number.EPSILON) * 100) / 100,
                porcentaje_iva: dataExcel[index].porcentaje_iva,
                empresa
            })
            .then((response) => {
                count += 1
                console.log("se guardo",response);
            }).catch((err) => {
                console.log("error", err)
            });
        }
    }
    fs.unlink(ruta)
        .then(() => {
            console.log("File removed");
        }).catch((err) => {
            console.error("Something wrong happened removing the file", err);
        });
    res.json({
        success: true,
        msg: "Cantidad de iten registrados "+count
    })

}
async function VerificarProductoExistente(empresa, producto, precio) {
    const response = await Productos.findAll({ where: { empresa, producto }, attributes: ['producto','precio_venta'] })
        // let product = response[0].producto
        // let preci = response[0].precio_venta
        // console.log("VerificarProductoExistente",product, preci)
        if (!empty(response)) {
            return true;
        } else {
            return false;
        }
}
export async function ListarProductoConsiDencia(req, res){
    // jwt.verify(req.token, config.token, async (error, authData)=>{
    // if(!error){
            try {
                const { empresa, busqueda } = req.body;
                let coinsi = busqueda.toLowerCase()
                let sql = `SELECT id, id_categoria, producto, precio_venta, porcentaje_iva, estado FROM esq_productos.producto WHERE (producto LIKE '%${busqueda}%') AND empresa = '${empresa}' AND estado = 'A' LIMIT 10`;
                db.query(sql,{type: sequelize.QueryTypes.SELECT}).then((response)=>{
                    console.log(response);
                    if(!empty(response)){
                        res.json({
                            success: true,
                            data: response,
                            msg:'ListarProductoConsiDencia',
                        })
                    }else{
                        res.json({msg: "no se encontro coinsidencia"})
                    }
                }).catch((err)=>{
                    console.log("Error", err);
                })
            } catch (error) {
                console.log(error)
            }
        // }else{
        //     res.json(errorToken)
        // }
    // })
}

export async function EliminarProductoPorId(req, res){
    try {
        const { id, empresa } = req.query;
        const response = await Productos.destroy({where: {id, empresa}})
        if (!empty(response)){
            res.json({
                success: true,
                data: response,
                msg:'Producto removido',
            })
        }else{
           res.json({success:false, msg:"id producto no existe"}) 
        }   
    } catch (error) {
        console.log("EliminarProductoPorId", error);
    }

}