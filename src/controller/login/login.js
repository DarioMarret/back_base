import empty from 'is-empty';
import bcrypt from 'bcrypt'
import Usuario from '../../model/Usuario/Usuario'

export async function ValidarLogin(req, res) {
    try {
        const { usuario, contracena } = req.body;
        const response = await Usuario.findAll({ where: { usuario } });
        if (!empty(response[0])) {
            const x = await bcrypt.compare(contracena, response[0].contracena)
            if (x) {
                //  jwt.sign({id_usuario}, config.token,  (err, token)=>{
                // if (!err) {
                    res.json({
                        data: response[0],
                        success: true,
                        msg: 'Bienvenido ' + response[0].usuario
                    })
                // } else {
                //     res.status(500).json({
                //         success: false,
                //         msg: "algo salio mal vuelve a intentar",
                //     })
                // }
                //  });
            } else {
                res.status(401).json({
                    success: false,
                    msg: "Contraceña incorrecta"
                })
            }
        } else {
            res.status(401).json({
                success: false,
                msg: "usuario incorrecta"
            })
        }
    } catch (error) {
        console.log("ValidarLogin", error);
    }
}

export async function CrearUsuario(req, res){
    try {
        // jwt.verify(req.token, config.token, async (error, authData)=>{
            // if(!error){
                const { usuario, contracena, perfil, empresa} = req.body;
                const existe = await ValivarExisteUsuario(usuario, empresa)
                if (existe){
                    res.send("El usuario ya existe dentro de la empresa "+ empresa)
                }else{
                    let hash_clave = await bcrypt.hash(contracena, 8);
                    const response = await Usuario.create({usuario, contracena:hash_clave, perfil, empresa})
                    if(!empty(response)){
                        res.json({
                            success: true,
                            msg:'Nuevo Usuario registrado en la empresa: '+ empresa,
                        })
                    }else{
                        res.send("server invalid state")
                    }
                }
            // }else{
            //     res.json(errorToken)
            // }
        // })
    } catch (error) {
        await Error.create({error, seccion:'creacion de usuario'})
    }
}
async function ValivarExisteUsuario(usuario, empresa){
    try {
        const response = await Usuario.findAll({ where: { usuario, empresa } });
        if (!empty(response[0])) {
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
    }
}