import { Router } from 'express'
import { CrearCuadreCaja, IngresarMovimiento, ActualizaCaja, ListarCajaActual, ListarCajas, ListarMovimiento } from '../../controller/caja/caja'

const routes = Router()

routes.post('/listar_caja',ListarCajaActual)
routes.post('/cuadre_caja', CrearCuadreCaja)
routes.post('/listar_cajas',ListarCajas)
routes.put('/actualizar_caja', ActualizaCaja)

//movimiento de caja
routes.post('/ingresar_movimiento', IngresarMovimiento)
routes.get('/listar_movimiento', ListarMovimiento)


export default routes