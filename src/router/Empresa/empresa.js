import { Router } from 'express'
import { ActualizarEmpresa, CrearEmpresa, EliminarEmpresa, ListarEmpresa, ListarEmpresas } from '../../controller/Empresa/controller.empresa'

const routes = Router()

routes.post('/crear_empresa',CrearEmpresa)
routes.post('/listar_empresas',ListarEmpresas)
routes.post('/listar_empresa',ListarEmpresa)
routes.post('/actualizar_empresa',ActualizarEmpresa)
routes.delete('/eliminar_empresa',EliminarEmpresa)


export default routes

