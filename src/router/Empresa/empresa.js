import { Router } from 'express'
import { ActualizarEmpresa, ActualizarVendedor, CrearEmpresa, EliminarEmpresa, ListarEmpresa, ListarEmpresas, ListarVendedores, RegistrarVendedor } from '../../controller/Empresa/controller.empresa'

const routes = Router()

routes.post('/crear_empresa',CrearEmpresa)
routes.post('/listar_empresas',ListarEmpresas)
routes.post('/listar_empresa',ListarEmpresa)
routes.post('/actualizar_empresa',ActualizarEmpresa)
routes.delete('/eliminar_empresa',EliminarEmpresa)

// Listar vENDEDORES
routes.post('/listar_vendedores',ListarVendedores)
routes.post('/crear_vendedor',RegistrarVendedor)
routes.post('/actualizar_vendedor',ActualizarVendedor)


export default routes

