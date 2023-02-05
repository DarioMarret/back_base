import { Router } from 'express'
import { CrearCuadreCaja, IngresarMovimiento, ActualizaCaja, ListarCajaActual, ListarCajas, ListarMovimiento, ListarMovimientoAdmin, ListarCuadresAdminFechas } from '../../controller/caja/caja'

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


export default routes