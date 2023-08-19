import { Router } from 'express'
import { CrearCategoria, EditarCategoria, EliminarCategoria, ListarCategorias } from '../../controller/categoria/categoria'

const routes = Router()

routes.get('/listar_categoria/:empresa',ListarCategorias)
routes.post('/crear_categoria', CrearCategoria)
routes.put('/editar_categoria',EditarCategoria)
routes.delete('/eliminar_categoria', EliminarCategoria)



export default routes