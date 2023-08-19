import { Router } from 'express'
import { EliminarOrden, EliminarProductoOrden, ListarOrdenes, RegistrarOrden } from '../../controller/vizor/vizor'

const routes = Router()

routes.post('/vizor', RegistrarOrden)
routes.post('/listar_vizor',ListarOrdenes)
routes.delete('/eliminar_items/:id',EliminarProductoOrden)
routes.delete('/eliminar_item/:empresa/:random',EliminarOrden)

export default routes