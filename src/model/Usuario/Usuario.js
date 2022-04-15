import Sequelize from "sequelize"
import sequelize from "../../database/conexion_sequelize"


const Usuario = sequelize.define("usuario",{
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    usuario: {
      type: Sequelize.STRING(255),
    },
    contracena:{
        type: Sequelize.STRING(255),
    },
    perfil:{
      type: Sequelize.STRING(25),
    },
    empresa:{
      type: Sequelize.STRING(160),
      allowNull:false,
    },
    estado:{
      type: Sequelize.STRING(1),
      defaultValue:"A"
    },
    activos:{
      type: Sequelize.STRING(20),
      defaultValue:"BASICO"
    },
    fecha_ultimo_acceso: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    //Tabla asociada al objeto
    tableName:"usuario" ,
    underscored:true,
    timestamps:false,
    schema:"esq_usuario"
  }
);


export default Usuario;