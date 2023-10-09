import { Router } from 'express'
import { ActualizaCaja, CrearCuadreCaja, EliminarMovimiento, IngresarMovimiento, ListarCajaActual, ListarCajas, ListarCuadresAdminFechas, ListarMovimiento, ListarMovimientoAdmin } from '../../controller/caja/caja'

const routes = Router()

routes.post('/listar_caja',ListarCajaActual)
routes.post('/cuadre_caja', CrearCuadreCaja)
routes.post('/listar_cajas',ListarCajas)
routes.put('/actualizar_caja', ActualizaCaja)

routes.post('/cuadres_caja',ListarCuadresAdminFechas)

//movimiento de caja
routes.post('/ingresar_movimiento', IngresarMovimiento)
routes.get('/listar_movimiento', ListarMovimiento)

routes.post('/listar_movimiento_admin', ListarMovimientoAdmin)
routes.delete('/eliminar_movimiento', EliminarMovimiento)


export default routes