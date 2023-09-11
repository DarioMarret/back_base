import { Router } from 'express'
import { CambiarEstadoMesa, EliminarItemsOrden, EliminarMesa, EliminarOrden, EliminarProductoOrden, ListarMesas, ListarOrdenes, ListarOrdenesPorEmpresaMesa, RegistrarMesa, RegistrarOrden } from '../../controller/vizor/vizor'

const routes = Router()

routes.post('/vizor', RegistrarOrden)
routes.post('/listar_vizor',ListarOrdenes)
routes.delete('/eliminar_items/:id',EliminarProductoOrden)
routes.delete('/eliminar_item/:empresa/:random',EliminarOrden)
// mesas
routes.post('/mesas', ListarMesas)
routes.post('/registra_mesas', RegistrarMesa)
routes.delete('/elimina_mesa/:id/:empresa', EliminarMesa)
routes.delete('/elimina_orden/:id/:cantidad', EliminarItemsOrden)
routes.post('/atender_mesa', CambiarEstadoMesa)
routes.post('/listar_orden_empresa_mesa',ListarOrdenesPorEmpresaMesa)



export default routes