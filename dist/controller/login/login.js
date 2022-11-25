"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrearUsuario = CrearUsuario;
exports.ValidarLogin = ValidarLogin;

var _isEmpty = _interopRequireDefault(require("is-empty"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Usuario = _interopRequireDefault(require("../../model/Usuario/Usuario"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ValidarLogin(req, res) {
  try {
    const {
      usuario,
      contracena
    } = req.body;
    const response = await _Usuario.default.findAll({
      where: {
        usuario
      }
    });

    if (!(0, _isEmpty.default)(response[0])) {
      const x = await _bcrypt.default.compare(contracena, response[0].contracena);

      if (x) {
        //  jwt.sign({id_usuario}, config.token,  (err, token)=>{
        // if (!err) {
        res.json({
          data: response[0],
          success: true,
          msg: 'Bienvenido ' + response[0].usuario
        }); // } else {
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
        });
      }
    } else {
      res.status(401).json({
        success: false,
        msg: "usuario incorrecta"
      });
    }
  } catch (error) {
    console.log("ValidarLogin", error);
  }
}

async function CrearUsuario(req, res) {
  try {
    // jwt.verify(req.token, config.token, async (error, authData)=>{
    // if(!error){
    const {
      usuario,
      contracena,
      perfil,
      empresa
    } = req.body;
    const existe = await ValivarExisteUsuario(usuario, empresa);

    if (existe) {
      res.send("El usuario ya existe dentro de la empresa " + empresa);
    } else {
      let hash_clave = await _bcrypt.default.hash(contracena, 8);
      const response = await _Usuario.default.create({
        usuario,
        contracena: hash_clave,
        perfil,
        empresa
      });

      if (!(0, _isEmpty.default)(response)) {
        res.json({
          success: true,
          msg: 'Nuevo Usuario registrado en la empresa: ' + empresa
        });
      } else {
        res.send("server invalid state");
      }
    } // }else{
    //     res.json(errorToken)
    // }
    // })

  } catch (error) {
    await Error.create({
      error,
      seccion: 'creacion de usuario'
    });
  }
}

async function ValivarExisteUsuario(usuario, empresa) {
  try {
    const response = await _Usuario.default.findAll({
      where: {
        usuario,
        empresa
      }
    });

    if (!(0, _isEmpty.default)(response[0])) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}