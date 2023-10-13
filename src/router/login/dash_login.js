import { Router } from 'express'
import { ActualizarUsuarioDash, CrearteUsuarioDash, EliminarUsuarioDash, ListarUsuariosDash, LoginUsuarioDash } from '../../controller/userdashboard/controller.dash'

const routes = Router()

routes.post('/login_dash',LoginUsuarioDash)
routes.post('/crear_dash',CrearteUsuarioDash)
routes.post('/listar_dash',ListarUsuariosDash)
routes.post('/actualizar_dash',ActualizarUsuarioDash)
routes.post('/eliminar_dash',EliminarUsuarioDash)



export default routes