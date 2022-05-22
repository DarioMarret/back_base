import { Router } from 'express'
import { ActualizarEstado, CrearVenta, ListarReporte, ListarReporteActual, SacarTotalesVentaFechas } from '../../controller/reporte/reporte'

const routes = Router()

routes.put('/actualizar_estado',ActualizarEstado)
routes.post('/listar_reporte_fechas',ListarReporte)
routes.post('/crear_venta',CrearVenta)
routes.get('/listar_reporte_venta_actual',ListarReporteActual)

routes.post('/total_venta_fechas',SacarTotalesVentaFechas)


export default routes