import empty from "is-empty"
import XLSX from "xlsx"
// import Productos from "../../model/Productos/Productos"
import path from "path"
import fs from "fs"
// import db from "../../database/conexion_sequelize"
// import sequelize from "sequelize"
import { sql } from "../../database/conexion"
import moment from "moment"
import { Random } from "../../function/functionRandom"

export async function ListarProducto(req, res) {
    try {
        const { empresa } = req.query;
        const response = await sql.query(`SELECT * FROM producto WHERE empresa = '${empresa}'`)
        if (!empty(response[0])) {
            res.json({
                success: true,
                data: response[0],
            })
        } else {
            res.json({
                success: false,
                data: response[0],
            })
        }
    } catch (error) {
        console.log("ListarProducto", error)
    }
}

export async function CrearProductounitario(req, res) {
    try {
        const {producto, precio_venta, porcentaje_iva, porcentaje, empresa, id_categoria } = req.body
        console.log("\n")
        console.log("body", req.body)
        console.log("\n")
        var ress = await VerificarProductoExistente(empresa, producto.toLowerCase())
        if (ress) {
            let auxiliar = Random(1, 999999999)
            await sql.query(`INSERT INTO producto (auxiliar, producto, id_categoria, precio_venta, porcentaje_iva, porcentaje, empresa, estado, fechaCreacion, fechaUpdate) VALUES 
            (
                '${auxiliar}',
                '${producto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"")}', 
                ${id_categoria},
                ${precio_venta}, 
                ${porcentaje_iva}, 
                ${porcentaje},
                '${empresa}', 
                'A', 
                '${moment().format('YYYY-MM-DD HH:mm:ss')}', 
                '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
            res.json({
                success: true,
                msg: "Producto creado"
            })
        }else{
            res.json({
                success: false, 
                msg: "producto ya exite es su lista"
            })
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
        if (ress) {
            let auxiliar = Random(1, 999999999)
            sql.query(`INSERT INTO producto
            (auxiliar, producto, id_categoria, precio_venta, porcentaje_iva, empresa, estado, fechaCreacion, fechaUpdate) VALUES
            (
                '${auxiliar}',
                '${producto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"")}',
                ${dataExcel[index].id_categoria},
                ${precio}, 
                ${dataExcel[index].porcentaje_iva}, 
                '${empresa}', 
                'A',
                '${moment().format('YYYY-MM-DD HH:mm:ss')}',
                '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
            count++
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
    try {
       const existe = await sql.query(`SELECT * FROM producto WHERE empresa = '${empresa}' AND producto = '${producto}'`)
        if (existe[0].length > 0) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.log(error)
    }
}

export async function ListarProductoConsiDencia(req, res){
    try {
        const { empresa, busqueda } = req.body;
        // let coinsi = busqueda.toLowerCase()
        let query = `SELECT id, producto, id_categoria, precio_venta, porcentaje_iva, porcentaje, estado FROM producto WHERE (producto LIKE '%${busqueda}%') AND empresa = '${empresa}' AND estado = 'A' LIMIT 12`;
        const response = await sql.query(query)
        // console.log(response[0])
        if (!empty(response[0])) {
            res.json({
                success: true,
                data: response[0],
            })
        }else{
            res.json({
                success: false,
                data: response[0],
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export async function EliminarProductoPorId(req, res){
    try {
        const { id, empresa } = req.query;
        const response = await sql.query(`UPDATE producto SET estado = 'I', fechaUpdate = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE id = ${id} AND empresa = '${empresa}'`)
        if (response[0].affectedRows > 0) {
            res.json({
                success: true,
                msg: "Producto eliminado"
            })
        }else{
            res.json({
                success: false,
                msg: "No se pudo eliminar el producto"
            })
        }
    } catch (error) {
        console.log("EliminarProductoPorId", error);
    }
}

export const ListarProductosPorCategoria = async (req, res) => {
    try {
        const { empresa, id_categoria } = req.body
        const response = await sql.query(`SELECT * FROM producto WHERE empresa = '${empresa}' AND id_categoria = ${id_categoria}`)
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