import { Router } from 'express'
import { CambiarEstadoMesa, EliminarMesa, EliminarOrden, EliminarProductoOrden, ListarMesas, ListarOrdenes, RegistrarMesa, RegistrarOrden } from '../../controller/vizor/vizor'

const routes = Router()

routes.post('/vizor', RegistrarOrden)
routes.post('/listar_vizor',ListarOrdenes)
routes.delete('/eliminar_items/:id',EliminarProductoOrden)
routes.delete('/eliminar_item/:empresa/:random',EliminarOrden)
// mesas
routes.post('/mesas', ListarMesas)
routes.post('/registra_mesas', RegistrarMesa)
routes.delete('/elimina_mesa/:id/:empresa', EliminarMesa)
routes.post('/atender_mesa', CambiarEstadoMesa)


export default routes