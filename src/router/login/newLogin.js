import { Router } from 'express'
import { ActualizarUsuario, CrearUsuario, ListarUsuarios, Login } from '../../controller/controller.login'

const routes = Router()

routes.post('/login',Login)
routes.post('/crear_usuario',CrearUsuario)
routes.post('/listar_usuarios',ListarUsuarios)
routes.post('/actualizar',ActualizarUsuario)


export default routes