import { Router } from 'express'
import { ActualizarMateria, EliminarMateriaPorId, ListarMaterias, ListarMateriasPorId, ListarMermaMateria, RegistrarMateria, RegistrarMermaMateria } from '../../controller/productos/controller.materia'
import { CargarProductosDesdeExcel, CrearProductounitario, EditarProducto, EliminarProductoPorId, ListarProducto, ListarProductoConsiDencia, ListarProductosPorCategoria } from '../../controller/productos/productos'

const routes = Router()

routes.post('/Cargar_producto_excel', CargarProductosDesdeExcel)
routes.post('/cargar_producto_unitario',CrearProductounitario)
routes.put('/actualizar_producto',EditarProducto)
routes.get('/listar_produtos_empresa',ListarProducto)
routes.post('/listar_produtos_categorias',ListarProductosPorCategoria)

routes.post('/busqueda_coinsidencia',ListarProductoConsiDencia)
routes.delete('/eliminar_producto_id',EliminarProductoPorId)


// materia prima
routes.post('/crear_materia_prima',RegistrarMateria)
routes.put('/actualizar_materia_prima',ActualizarMateria)
routes.get('/listar_materia_prima',ListarMaterias)
routes.get('/listar_materia_prima_id',ListarMateriasPorId)
routes.delete('/eliminar_materia_prima_id',EliminarMateriaPorId)

//merma de la materia prima
routes.post('/crear_merma_materia_prima',RegistrarMermaMateria)
routes.get('/listar_merma_materia_prima_id',ListarMermaMateria)

export default routes