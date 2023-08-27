import { Router } from 'express'
import { CargarProductosDesdeExcel, EliminarProductoPorId, ListarProducto, ListarProductoConsiDencia, CrearProductounitario, ListarProductosPorCategoria, EditarProducto } from '../../controller/productos/productos'

const routes = Router()

routes.post('/Cargar_producto_excel', CargarProductosDesdeExcel)
routes.post('/cargar_producto_unitario',CrearProductounitario)
routes.put('/actualizar_producto',EditarProducto)
routes.get('/listar_produtos_empresa',ListarProducto)
routes.post('/listar_produtos_categorias',ListarProductosPorCategoria)

routes.post('/busqueda_coinsidencia',ListarProductoConsiDencia)
routes.delete('/eliminar_producto_id',EliminarProductoPorId)

export default routes