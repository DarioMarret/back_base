import Sequelize from "sequelize"
import sequelize from "../../database/conexion_sequelize"

const Caja = sequelize.define("caja",{
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    fecha_cuadre:{
        type: Sequelize.STRING(160),
        defaultValue: Sequelize.NOW
    },
    usuario:{
        type: Sequelize.STRING(160),
        allowNull:false,
    },
    conteo:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.0
    },
    venta:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.0
    },
    cuadre_total:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.0
    },
    empresa:{
        type: Sequelize.STRING(100),
        allowNull:false,
    },
    estado: {
      type: Sequelize.STRING(20),
      defaultValue: "ACTIVO",
    },
  },
  {
    tableName:"caja" ,
    underscored:true,
    timestamps:false,
    schema:"esq_reporte"
  }
);

export default Caja;