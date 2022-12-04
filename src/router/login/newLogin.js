import { Router } from 'express'
import { CrearUsuario, Login } from '../../controller/controller.login'

const routes = Router()

routes.post('/login',Login)
routes.post('/crear_usuario',CrearUsuario)


export default routes