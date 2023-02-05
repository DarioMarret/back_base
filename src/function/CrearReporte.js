import { CuadreIni, TotalMovimientos, TotalVentas, TotalVentasTarjeta, TotalVentasTransferencia } from "./cuadreCaja"

// (async ()=>{
//     try {
//         const response = await Productos.findAll()
//         response.map(async (item)=>{
//             let existe = await ExisteProducto(item.dataValues.empresa.toLowerCase().replace(/ /g, ''), item.dataValues.producto)
//             if (existe) {
//                 console.log(existe)
//                 console.log(item.dataValues)
//                 let auxiliar = Random(1, 999999999)
//                 await sql.query(`INSERT INTO producto 
//                 (auxiliar, producto, precio_venta, porcentaje_iva, empresa, estado, fechaCreacion, fechaUpdate) 
//                 VALUES ('${auxiliar}', '${item.dataValues.producto}', '${item.dataValues.precio_venta}', 
//                 '${item.dataValues.porcentaje_iva}', '${item.dataValues.empresa.toLowerCase().replace(/ /g, '')}', 'A', '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
//                 '${moment().format("YYYY-MM-DD HH:mm:ss")}')`)
//             }
//         })
//     } catch (error) {
//         console.log(error)        
//     }
// })()

// const ExisteProducto = async (empresa, producto) => {
//     try {
//        const existe = await sql.query(`SELECT * FROM producto WHERE empresa = '${empresa}' AND producto = '${producto}'`)
//         if (existe[0].length > 0) {
//             return false
//         } else {
//             return true
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
// const Random = (min, max) => {
//     return Math.floor(Math.random() * (max - min)) + min;
// }

// (async ()=>{
//     try {
//         const response = await Reporte.findAll()
//         response.map(async (item)=>{
//             // let existe = await ExisteProducto(item.dataValues.empresa.toLowerCase().replace(/ /g, ''), item.dataValues.producto)
//             // if (existe) {
//                 //     console.log(existe)
//                 //     console.log(item.dataValues)
//                 // let auxiliar = Random(1, 999999999)
//                 await sql.query(`INSERT INTO ventas 
//                 (secuencia, producto, precio_venta, cantidad, fecha_creacion, empresa, estado, forma_pago) 
//                 VALUES ('${item.dataValues.secuencia}', '${item.dataValues.producto}', '${item.dataValues.precio_venta}',
//                 '${item.dataValues.cantidad}', '${item.dataValues.fecha_creacion}',
//                 '${item.dataValues.empresa.toLowerCase().replace(/ /g, '')}', '${item.dataValues.estado}', '${item.dataValues.forma_pago}')`)

//                 console.log(item.dataValues)

//             // }
//         })
//     } catch (error) {
//         console.log(error)        
//     }
// })()


// (async ()=>{
//     try {
//         const response = await Caja.findAll()
//         response.map(async (item)=>{
//             console.log(item.dataValues)
//             // let existe = await ExisteProducto(item.dataValues.empresa.toLowerCase().replace(/ /g, ''), item.dataValues.producto)
//             // if (existe) {
//                 //     console.log(existe)
//                 //     console.log(item.dataValues)
//                 // let auxiliar = Random(1, 999999999)
//                 await sql.query(`INSERT INTO caja 
//                 (fecha_cuadre, usuario, conteo, venta, cuadre_total, empresa, estado) 
//                 VALUES ('${item.dataValues.fecha_cuadre}', '${item.dataValues.usuario}', '${item.dataValues.conteo}',
//                 '${item.dataValues.venta}', '${item.dataValues.cuadre_total}',
//                 '${item.dataValues.empresa.toLowerCase().replace(/ /g, '')}', '${item.dataValues.estado}')`)

//                 // console.log(item.dataValues)

//             // }
//         })
//     } catch (error) {
//         console.log(error)        
//     }
// })()

// (async ()=>{
//     try {
//         const response = await Movimiento.findAll()
//         response.map(async (item)=>{
//             // let existe = await ExisteProducto(item.dataValues.empresa.toLowerCase().replace(/ /g, ''), item.dataValues.producto)
//             // if (existe) {
//                 //     console.log(existe)
//                 //     console.log(item.dataValues)
//                 // let auxiliar = Random(1, 999999999)
//                 await sql.query(`INSERT INTO movimiento (detalle, usuario, ingreso, salida, empresa, fecha, estado) VALUES 
//                 ('${String(item.dataValues.detalle).toLowerCase().replace("'","").replace("(", "").replace(")", "").replace("uñas", "unas")}', '${item.dataValues.usuario}', ${item.dataValues.ingreso},${item.dataValues.salida}, '${item.dataValues.empresa.toLowerCase().replace(/ /g, '')}','${item.dataValues.fecha}', '${item.dataValues.estado}')`)
//                 console.log(item.dataValues)

//                 // console.log(item.dataValues)

//             // }
//         })
//     } catch (error) {
//         console.log(error)        
//     }
// })()

(async ()=>{
    try {
        let empresa = 'luielei'
        let estado = 'ACTIVO'
        let fecha_ini = '06/12/2022'    
        const ventaTotal = await TotalVentas(empresa, estado, fecha_ini)
        console.log("TotalVentas",ventaTotal)

        const respuesta2 = await TotalVentasTarjeta(empresa, estado, fecha_ini)//Total de vetnas respuesta2
        console.log("TotalVentasTarjeta", respuesta2)


        const response3 = await TotalVentasTransferencia(empresa, estado, fecha_ini)//Total de vetnas respuesta3
        console.log("TotalVentasTransferencia", response3)

        const {ingreso, salida} = await TotalMovimientos(empresa, estado, fecha_ini)//Total de vetnas respuesta3
        console.log("TotalMovimientos", "Ingreso:",ingreso, "Salida:",salida)

        const respuesta5 = await CuadreIni(empresa)//Total de vetnas respuesta4
        console.log("CuadreIni", respuesta5)

        let cuadre_total = ventaTotal + ingreso + respuesta5 - salida
        console.log("CuadreTotal", parseFloat((cuadre_total).toFixed(2)))

    } catch (error) {
        console.log("ListarReporte", error)
    }
})()