import { Router } from 'express'
import { ActualizarEstado, CrearVenta, ListarReporte } from '../../controller/reporte/reporte'

const routes = Router()

routes.post('/actualizar_estado',ActualizarEstado)
routes.post('/listar_reporte_fechas',ListarReporte)
routes.post('/crear_venta',CrearVenta)


export default routes