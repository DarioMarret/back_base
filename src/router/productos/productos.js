import { Router } from 'express'
import { CargarProductosDesdeExcel, EliminarProductoPorId, ListarProducto, ListarProductoConsiDencia, CrearProductounitario } from '../../controller/productos/productos'

const routes = Router()

routes.post('/Cargar_producto_excel', CargarProductosDesdeExcel)
routes.post('/cargar_producto_unitario',CrearProductounitario)
routes.get('/listar_produtos_empresa',ListarProducto)
routes.post('/busqueda_coinsidencia',ListarProductoConsiDencia)
routes.delete('/eliminar_producto_id',EliminarProductoPorId)

export default routes