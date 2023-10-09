import { Router } from 'express'
import { ActualizarAsistencia, ActualizarUsuario, CrearUsuario, EliminarAnticipos, EliminarUsuario, ListarAnticipos, ListarAsistencia, ListarAsistenciaUsuario, ListarUsuarios, Login, RegistrarAnticipos, RegistrarAsistencia } from '../../controller/controller.login'

const routes = Router()

routes.post('/login',Login)
routes.post('/crear_usuario',CrearUsuario)
routes.post('/listar_usuarios',ListarUsuarios)
routes.post('/actualizar',ActualizarUsuario)
routes.delete('/eliminar_usuario',EliminarUsuario)
// routes.post('/deslogin',ListarUsuariosEmpresa)

// asistencia de usuarios
routes.post('/asistencia',RegistrarAsistencia)
routes.post('/listar_asistencia',ListarAsistencia)
routes.post('/listar_asistencia_usuario',ListarAsistenciaUsuario)
routes.post('/listar_asistencia_usuario_salida',ActualizarAsistencia)

// anticipos
routes.post('/anticipo',RegistrarAnticipos)
routes.get('/anticipo',ListarAnticipos)
routes.delete('/anticipo',EliminarAnticipos)



export default routes