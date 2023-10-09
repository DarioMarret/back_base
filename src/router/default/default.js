import { Router } from 'express'
import { ListarMedidas, ListarPerfil } from '../../controller/Default/controller.default'



const routes = Router()
routes.get('/perfil', ListarPerfil)
routes.get('/medidas', ListarMedidas)

export default routes