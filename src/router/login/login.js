import { Router } from 'express'
import { CrearUsuario, ValidarLogin } from '../../controller/login/login'

const routes = Router()

routes.post('/validarlogin',ValidarLogin)
routes.post('/crearUsuario',CrearUsuario)


export default routes